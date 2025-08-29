import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../api/projects";
import useAuthStore from "../../store/authstore";
import { triggerDataRefresh } from "../../hooks/useDataRefresh";
import { can, PERMISSIONS } from "../../utils/permission";
import { getRoleFromPermission } from "../../utils/backendPermission";

export default function useProjectsLogic() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [userProjectRoles, setUserProjectRoles] = useState({});

  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // Load projects effect
  useEffect(() => {
    const loadProjects = async () => {
      if (!user?.id) return;
      try {
        const response = await fetchProjects();
        const userProjects = response.projects || response || [];

        // Build user project roles mapping
        const projectRolesMap = {};

        const projectsWithRoles = userProjects.map((project) => {
          const isCurrentUserCreator = project.createdBy === user?.id;

          let userRole = "MEMBER"; // default role

          // If user is the project creator, they have ADMINISTRATOR role
          if (isCurrentUserCreator) {
            userRole = "ADMINISTRATOR";
          } else {
            // For non-creators, find their role from the members array
            const currentUserMember = project.members?.find(
              (member) => member.user?.id === user?.id || member.userId === user?.id
            );
            
            if (currentUserMember) {
              userRole = getRoleFromPermission(currentUserMember.permission);
            } else {
              // If we can't find the user in members but they can see the project,
              // they must be a member (default role)
              userRole = "MEMBER";
            }
          }

          projectRolesMap[project.id] = userRole;

          let creatorName = "Unknown";
          if (isCurrentUserCreator) {
            creatorName = "You";
          } else {
            // Try to get creator name from members if available
            const creatorMember = project.members?.find(
              (member) => member.user?.id === project.createdBy
            );
            if (creatorMember?.user?.fullName) {
              creatorName = creatorMember.user.fullName;
            } else {
              creatorName = "Creator";
            }
          }

          return {
            ...project,
            memberCount: project.members?.length || 0,
            creatorName,
            userRole,
          };
        });

        setProjects(projectsWithRoles);
        setUserProjectRoles(projectRolesMap);
      } catch (err) {
        console.error("Failed to load project data:", err);
        toast.error("Failed to load projects");
      }
    };

    loadProjects();
  }, [user?.id]);

  // Handle URL params for new project modal
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setShowCreateModal(true);
    }
  }, [searchParams]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery)
  );

  // Permission checking functions
  const canEditProject = (project) => {
    const userRole = userProjectRoles[project.id];
    return can(userRole, PERMISSIONS.EDIT_PROJECT);
  };

  const canDeleteProject = (project) => {
    const userRole = userProjectRoles[project.id];
    return can(userRole, PERMISSIONS.DELETE_PROJECT);
  };

  // Validate key prefix
  const validateKeyPrefix = (keyPrefix, excludeProjectId = null) => {
    if (!/^[A-Za-z]{5}$/.test(keyPrefix)) {
      toast.error("Key prefix must be exactly 5 letters.");
      return false;
    }

    const existingPrefix = projects.find(
      (p) =>
        p.createdBy === user.id &&
        p.keyPrefix === keyPrefix &&
        p.id !== excludeProjectId
    );

    if (existingPrefix) {
      toast.error("Key prefix must be unique for your projects.");
      return false;
    }

    return true;
  };

  // Handler functions
  const handleCreate = async (form) => {
    if (!user?.id) return;

    if (!validateKeyPrefix(form.keyPrefix)) return;

    try {
      const result = await createProject({
        name: form.name,
        keyPrefix: form.keyPrefix,
        createdBy: user.id,
      });

      const savedProject = result.project || result;

      setProjects((prev) => [
        ...prev,
        {
          ...savedProject,
          memberCount: 1,
          creatorName: "You",
          userRole: "ADMINISTRATOR",
        },
      ]);

      setShowCreateModal(false);
      setSearchParams({});
      toast.success("Project created successfully!");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    }
  };

  const handleUpdate = async (form) => {
    if (!user?.id) return;

    if (!validateKeyPrefix(form.keyPrefix, form.id)) return;
    try {
      const response = await updateProject({
        id: form.id,
        name: form.name,
        keyPrefix: form.keyPrefix,
      });

      console.log("Update response:", response); // Debug log

      // Handle the nested response structure
      const updatedProject = response.project || response;

      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === updatedProject.id) {
            // Preserve computed properties when updating, but update memberCount
            return {
              ...p,
              ...updatedProject,
              // Update memberCount based on the updated project data
              memberCount: updatedProject.members?.length || p.memberCount,
              // Preserve these computed properties to avoid losing them
              creatorName: p.creatorName,
              userRole: p.userRole,
            };
          }
          return p;
        })
      );

      toast.success("Project updated successfully!");

      setEditTarget(null);
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !deleteTarget.id) {
      console.error("No delete target or missing project ID");
      toast.error("Invalid project to delete");
      return;
    }
    
    try {
      console.log("Deleting project with ID:", deleteTarget.id);
      await deleteProject(deleteTarget.id);

      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success("Project deleted successfully");
      setDeleteTarget(null);

      triggerDataRefresh("projects");
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error(error.message || "Failed to delete project");
      setDeleteTarget(null);
    }
  };

  const handleProjectClick = (project) => {
    navigate(`/projects/${project.id}`);
  };

  const handleProjectEdit = (project) => {
    setEditTarget(project);
  };

  const handleProjectDelete = (project) => {
    setDeleteTarget(project);
  };

  // Modal handlers
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setSearchParams({});
  };

  const handleCloseEditModal = () => {
    setEditTarget(null);
  };

  const handleCloseDeleteModal = () => {
    setDeleteTarget(null);
  };

  return {
    // State
    filteredProjects,
    showCreateModal,
    editTarget,
    deleteTarget,

    // Permission functions
    canEditProject,
    canDeleteProject,

    // Handlers
    handleCreate,
    handleUpdate,
    handleDelete,
    handleProjectClick,
    handleProjectEdit,
    handleProjectDelete,

    // Modal handlers
    handleCloseCreateModal,
    handleCloseEditModal,
    handleCloseDeleteModal,
  };
}

