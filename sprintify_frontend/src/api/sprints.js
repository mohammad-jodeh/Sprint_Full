import { protectedApi, baseUrl } from "./config";

// Helper function to determine if we're using json-server
const isJsonServer = () => baseUrl.includes('3001');

export const fetchSprints = async (projectId, params = {}) => {
  try {
    if (isJsonServer()) {
      // Get all sprints and filter by projectId
      const response = await protectedApi.get(`/sprints`);
      const projectSprints = response.data.filter(sprint => sprint.projectId === projectId);
      return projectSprints;
    } else {
      const response = await protectedApi.get(`/${projectId}/sprints`, { params });
      return response.data.sprints || response.data.data?.sprints || response.data;
    }
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to fetch sprints");
    }
    throw new Error("Failed to fetch sprints. Please check your connection.");
  }
};

export const fetchSprintById = async (projectId, id) => {
  try {
    const response = await protectedApi.get(`/${projectId}/sprints/${id}`);
    return response.data.sprint || response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to fetch sprint");
    }
    throw new Error("Failed to fetch sprint. Please check your connection.");
  }
};

export const createSprint = async (projectId, sprint) => {
  try {
    const response = await protectedApi.post(`/${projectId}/sprints`, sprint);
    return response.data.sprint || response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to create sprint");
    }
    throw new Error("Failed to create sprint. Please check your connection.");
  }
};

export const updateSprint = async (projectId, id, updates) => {
  try {
    const response = await protectedApi.patch(`/${projectId}/sprints/${id}`, updates);
    return response.data.sprint || response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to update sprint");
    }
    throw new Error("Failed to update sprint. Please check your connection.");
  }
};

export const deleteSprint = async (projectId, id) => {
  try {
    const response = await protectedApi.delete(`/${projectId}/sprints/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to delete sprint");
    }
    throw new Error("Failed to delete sprint. Please check your connection.");
  }
};

export const fetchSprintIssues = async (projectId, sprintId, params = {}) => {
  try {
    if (isJsonServer()) {
      // Get all issues and filter by sprintId
      const response = await protectedApi.get(`/issues`);
      const sprintIssues = response.data.filter(issue => issue.sprintId === sprintId);
      return sprintIssues;
    } else {
      const response = await protectedApi.get(`/${projectId}/sprints/${sprintId}/issues`, { params });
      return response.data.data || response.data;
    }
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to fetch sprint issues");
    }
    throw new Error("Failed to fetch sprint issues. Please check your connection.");
  }
};