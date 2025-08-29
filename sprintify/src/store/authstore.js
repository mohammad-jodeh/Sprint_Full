import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/config";
import { getRoleFromPermission } from "../utils/backendPermission";

function decodeToken(token) {
  if (!token) return null;
  try {
    // Handle both JWT format (with dots) and simple base64 format
    if (token.includes(".")) {
      // JWT format
      const payload = token.split(".")[1];
      const decodedPayload = atob(
        payload.replace(/-/g, "+").replace(/_/g, "/")
      );
      return JSON.parse(decodedPayload);
    } else {
      // Simple base64 format
      const decodedPayload = atob(token);
      return JSON.parse(decodedPayload);
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      // Project role management
      currentProjectId: null,
      currentProjectRole: null,
      projectRoleLoading: false,
      projectRoleError: null,

      setAuth: (token, user) => {
        set({
          token,
          user,
          isAuthenticated: !!token,
        });
      },

      clearAuth: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          currentProjectId: null,
          currentProjectRole: null,
          projectRoleError: null,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),

      // Set current project and fetch user's role
      setCurrentProject: async (projectId) => {
        const state = get();

        // If same project, don't refetch
        if (
          state.currentProjectId === projectId &&
          state.currentProjectRole !== null
        ) {
          return;
        }

        if (!projectId) {
          set({
            currentProjectId: null,
            currentProjectRole: null,
            projectRoleError: null,
            projectRoleLoading: false,
          });
          return;
        }

        if (!state.user) {
          set({
            currentProjectId: projectId,
            currentProjectRole: null,
            projectRoleError: "User not authenticated",
            projectRoleLoading: false,
          });
          return;
        }

        set({ projectRoleLoading: true, projectRoleError: null });

        try {
          const response = await api.get(`/project_members/${projectId}`);
          const members = response.data.members || response.data || [];
          const projectMember = members.find(
            (member) => member.userId === state.user.id
          );          if (projectMember) {
            const roleString = getRoleFromPermission(projectMember.permission);
            set({
              currentProjectId: projectId,
              currentProjectRole: roleString,
              projectRoleError: null,
              projectRoleLoading: false,
            });
          } else {
            set({
              currentProjectId: projectId,
              currentProjectRole: null,
              projectRoleError: "You are not a member of this project",
              projectRoleLoading: false,
            });
          }
        } catch (error) {
          console.error("Failed to fetch project role:", error);
          set({
            currentProjectId: projectId,
            currentProjectRole: null,
            projectRoleError: "Failed to fetch project role",
            projectRoleLoading: false,
          });
        }
      },

      // Clear current project
      clearCurrentProject: () => {
        set({
          currentProjectId: null,
          currentProjectRole: null,
          projectRoleError: null,
          projectRoleLoading: false,
        });
      },

      // Project role helper methods
      isAdmin: () => {
        const state = get();
        return state.currentProjectRole === "ADMINISTRATOR";
      },

      isModerator: () => {
        const state = get();
        return (
          state.currentProjectRole === "MODERATOR" ||
          state.currentProjectRole === "ADMINISTRATOR"
        );
      },

      isMember: () => {
        const state = get();
        return ["MEMBER", "MODERATOR", "ADMINISTRATOR"].includes(
          state.currentProjectRole
        );
      },

      hasRole: (role) => {
        const state = get();
        return state.currentProjectRole === role;
      },

      hasAnyRole: (roles) => {
        const state = get();
        return roles.includes(state.currentProjectRole);
      },

      // Get user info from token
      getUserFromToken: () => {
        const state = get();
        if (!state.token) return null;
        return decodeToken(state.token);
      }, // Check if token is expired
      isTokenExpired: () => {
        const state = get();
        if (!state.token) return true;

        const decoded = decodeToken(state.token);
        if (!decoded || !decoded.exp) return true;

        // JWT exp is in seconds, Date.now() is in milliseconds
        return Date.now() > decoded.exp * 1000;
      }, // Check auth status and clear if expired
      checkAuth: () => {
        const state = get();

        if (!state.token) {
          return false;
        }

        if (get().isTokenExpired()) {
          console.log("Token is expired, clearing auth");
          get().clearAuth();
          return false;
        }

        return true;
      },
    }),
    {
      name: "spritify-auth-token",
    }
  )
);

export default useAuthStore;
