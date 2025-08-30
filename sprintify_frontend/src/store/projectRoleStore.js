import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/config";
import { getProjectMembers } from "../api/projectMembers";
import { getRoleFromPermission } from "../utils/backendPermission";

const useProjectRoleStore = create(
  persist(
    (set, get) => ({
      // State
      projectRoles: {}, // { projectId: { role, loading, error, lastFetched } }

      // Actions
      setProjectRole: (projectId, role) =>
        set((state) => ({
          projectRoles: {
            ...state.projectRoles,
            [projectId]: {
              ...state.projectRoles[projectId],
              role,
              loading: false,
              error: null,
              lastFetched: Date.now(),
            },
          },
        })),

      setProjectLoading: (projectId, loading) =>
        set((state) => ({
          projectRoles: {
            ...state.projectRoles,
            [projectId]: {
              ...state.projectRoles[projectId],
              loading,
            },
          },
        })),

      setProjectError: (projectId, error) =>
        set((state) => ({
          projectRoles: {
            ...state.projectRoles,
            [projectId]: {
              ...state.projectRoles[projectId],
              loading: false,
              error,
              lastFetched: Date.now(), // Add timestamp for error caching
            },
          },
        })),

      clearProjectRole: (projectId) =>
        set((state) => {
          const newProjectRoles = { ...state.projectRoles };
          delete newProjectRoles[projectId];
          return { projectRoles: newProjectRoles };
        }),

      clearAllProjectRoles: () => set({ projectRoles: {} }),      // Fetch project role from API
      fetchProjectRole: async (projectId, userId) => {
        if (!projectId || !userId) return null;

        const state = get();
        const existingRole = state.projectRoles[projectId];

        // Check if we have recent data (cache for 5 minutes)
        if (existingRole && !existingRole.loading && !existingRole.error) {
          const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
          if (existingRole.lastFetched > fiveMinutesAgo) {
            return existingRole.role;
          }
        }

        // Prevent repeated calls for recent errors (wait 30 seconds before retry)
        if (existingRole && existingRole.error && existingRole.lastFetched) {
          const thirtySecondsAgo = Date.now() - 30 * 1000;
          if (existingRole.lastFetched > thirtySecondsAgo) {
            console.warn(`Skipping repeated getProjectMembers call due to recent error for project ${projectId}`);
            return null;
          }
        }

        // Prevent concurrent calls for the same project
        if (existingRole && existingRole.loading) {
          console.warn(`Already loading project role for project ${projectId}`);
          return null;
        }

        try {
          get().setProjectLoading(projectId, true);

          const response = await getProjectMembers(projectId);
          
          // Add safety check for response.memberships (backend returns memberships, not members)
          if (!response || !response.memberships || !Array.isArray(response.memberships)) {
            console.error("Invalid response from getProjectMembers:", response);
            get().setProjectError(projectId, "Invalid response from server");
            return null;
          }
          
          const projectMember = response.memberships.find(
            (membership) => membership.user && (membership.user.id === userId || membership.user === userId)
          );

          if (projectMember) {
            // Permission is already a string like "ADMINISTRATOR", "MODERATOR", "MEMBER"
            const roleString = typeof projectMember.permission === 'string' 
              ? projectMember.permission 
              : (projectMember.permission === 2 ? "ADMINISTRATOR" : 
                 projectMember.permission === 1 ? "MODERATOR" : "MEMBER");
            get().setProjectRole(projectId, roleString);
            return roleString;
          } else {
            get().setProjectError(
              projectId,
              "You are not a member of this project"
            );
            return null;
          }
        } catch (error) {
          console.error("Failed to fetch project role:", error);
          get().setProjectError(projectId, "Failed to fetch project role");
          return null;
        }
      },

      // Getters
      getProjectRole: (projectId) => {
        const state = get();
        return state.projectRoles[projectId]?.role || null;
      },

      isProjectLoading: (projectId) => {
        const state = get();
        return state.projectRoles[projectId]?.loading || false;
      },

      getProjectError: (projectId) => {
        const state = get();
        return state.projectRoles[projectId]?.error || null;
      },

      // Role helpers
      isAdmin: (projectId) => {
        const role = get().getProjectRole(projectId);
        return role === "ADMINISTRATOR";
      },

      isModerator: (projectId) => {
        const role = get().getProjectRole(projectId);
        return role === "MODERATOR" || role === "ADMINISTRATOR";
      },

      isMember: (projectId) => {
        const role = get().getProjectRole(projectId);
        return (
          role === "MEMBER" || role === "MODERATOR" || role === "ADMINISTRATOR"
        );
      },

      hasRole: (projectId, targetRole) => {
        const role = get().getProjectRole(projectId);
        return role === targetRole;
      },

      hasAnyRole: (projectId, roles) => {
        const role = get().getProjectRole(projectId);
        return roles.includes(role);
      },
    }),
    {
      name: "sprintify-project-roles",
      // Only persist the roles data, not loading/error states
      partialize: (state) => ({
        projectRoles: Object.fromEntries(
          Object.entries(state.projectRoles).map(([projectId, data]) => [
            projectId,
            {
              role: data.role,
              lastFetched: data.lastFetched,
            },
          ])
        ),
      }),
    }
  )
);

export default useProjectRoleStore;
