import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useProjectRoleStore from "../store/projectRoleStore";
import useAuthStore from "../store/authstore";

/**
 * Custom hook to get project role information
 * Automatically fetches the role for the current project and user
 */
export const useProjectRole = () => {
  const { projectId } = useParams();
  const { user } = useAuthStore();

  const {
    fetchProjectRole,
    getProjectRole,
    isProjectLoading,
    getProjectError,
    isAdmin,
    isModerator,
    isMember,
    hasRole,
    hasAnyRole,
  } = useProjectRoleStore();

  // Auto-fetch role when component mounts or projectId/user changes
  useEffect(() => {
    if (projectId && user?.id) {
      fetchProjectRole(projectId, user.id);
    }
  }, [projectId, user?.id, fetchProjectRole]);

  return {
    // Data
    projectRole: getProjectRole(projectId),
    loading: isProjectLoading(projectId),
    error: getProjectError(projectId),

    // Convenience helpers
    isAdmin: isAdmin(projectId),
    isModerator: isModerator(projectId),
    isMember: isMember(projectId),
    hasRole: (role) => hasRole(projectId, role),
    hasAnyRole: (roles) => hasAnyRole(projectId, roles),

    // Manual refresh
    refresh: () => user?.id && fetchProjectRole(projectId, user.id),
  };
};
