import { protectedApi, baseUrl } from "./config";

// Helper function to determine if we're using json-server
const isJsonServer = () => baseUrl.includes('3001');

// Helper function to get current user ID from auth store
const getCurrentUserId = () => {
  try {
    const authState = JSON.parse(localStorage.getItem('spritify-auth-token') || '{}');
    return authState?.state?.user?.id || null;
  } catch {
    return null;
  }
};

// Get all projects for the authenticated user
export const fetchProjects = async () => {
  try {
    if (isJsonServer()) {
      // For json-server, we need to get projects the user has access to via project_members
      const [projectsResponse, membersResponse] = await Promise.all([
        protectedApi.get("/projects"),
        protectedApi.get("/project_members")
      ]);
      
      const allProjects = projectsResponse.data;
      const allMembers = membersResponse.data;
      
      // Get the current user's ID from auth store
      const currentUserId = getCurrentUserId();
      if (!currentUserId) {
        throw new Error("User not authenticated");
      }
      
      // Filter projects where the user is a member
      const userMemberships = allMembers.filter(member => member.userId === currentUserId);
      const userProjectIds = userMemberships.map(member => member.projectId);
      const userProjects = allProjects.filter(project => userProjectIds.includes(project.id));
      
      return { data: userProjects };
    } else {
      const response = await protectedApi.get("/project");
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to fetch projects"
      );
    }
    throw new Error("Failed to fetch projects. Please check your connection.");
  }
};

// Create a new project
export const createProject = async (projectData) => {
  try {
    const response = await protectedApi.post("/project", projectData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to create project"
      );
    }
    throw new Error("Failed to create project. Please check your connection.");
  }
};

// Update project
export const updateProject = async (projectData) => {
  try {
    const response = await protectedApi.patch("/project", projectData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to update project"
      );
    }
    throw new Error("Failed to update project. Please check your connection.");
  }
};

// Delete project
export const deleteProject = async (projectId) => {
  try {
    const response = await protectedApi.delete(`/project/${projectId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to delete project"
      );
    }
    throw new Error("Failed to delete project. Please check your connection.");
  }
};

// Get project by ID with detailed information
export const fetchProjectWithDetails = async (projectId) => {
  try {
    const response = await protectedApi.get(`/project/${projectId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to fetch project details"
      );
    }
    throw new Error(
      "Failed to fetch project details. Please check your connection."
    );
  }
};

// Get project by ID (simple version)
export const fetchProjectById = async (projectId) => {
  try {
    const response = await protectedApi.get(`/project/${projectId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to fetch project"
      );
    }
    throw new Error("Failed to fetch project. Please check your connection.");
  }
};

// Get project members
export const fetchProjectMembers = async (projectId) => {
  try {
    const response = await protectedApi.get(`/${projectId}/members`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to fetch project members"
      );
    }
    throw new Error(
      "Failed to fetch project members. Please check your connection."
    );
  }
};

// Add member to project
export const addProjectMember = async (projectId, memberData) => {
  try {
    const response = await protectedApi.post(
      `/${projectId}/members`,
      memberData
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to add project member"
      );
    }
    throw new Error(
      "Failed to add project member. Please check your connection."
    );
  }
};

// Remove member from project
export const removeProjectMember = async (projectId, memberId) => {
  try {
    const response = await protectedApi.delete(
      `/${projectId}/members/${memberId}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to remove project member"
      );
    }
    throw new Error(
      "Failed to remove project member. Please check your connection."
    );
  }
};

// Update project member permissions
export const updateProjectMember = async (projectId, memberId, memberData) => {
  try {
    const response = await protectedApi.patch(
      `/${projectId}/members/${memberId}`,
      memberData
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to update project member"
      );
    }
    throw new Error(
      "Failed to update project member. Please check your connection."
    );
  }
};
