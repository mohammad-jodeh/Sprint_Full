import { protectedApi } from "./config";

// Get all issues for a project
export const fetchIssues = async (projectId) => {
  try {
    const response = await protectedApi.get(`/${projectId}/issues`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to fetch issues");
    }
    throw new Error("Failed to fetch issues. Please check your connection.");
  }
};

// Get issue by ID
export const fetchIssueById = async (projectId, issueId) => {
  try {
    const response = await protectedApi.get(`/${projectId}/issues/${issueId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to fetch issue");
    }
    throw new Error("Failed to fetch issue. Please check your connection.");
  }
};

// Create new issue
export const createIssue = async (projectId, issueData) => {
  try {
    const response = await protectedApi.post(`/${projectId}/issues`, issueData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to create issue");
    }
    throw new Error("Failed to create issue. Please check your connection.");
  }
};

// Update issue
export const updateIssue = async (projectId, issueId, issueData) => {
  try {
    const response = await protectedApi.patch(
      `/${projectId}/issues/${issueId}`,
      issueData
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to update issue");
    }
    throw new Error("Failed to update issue. Please check your connection.");
  }
};

// Delete issue
export const deleteIssue = async (projectId, issueId) => {
  try {
    const response = await protectedApi.delete(
      `/${projectId}/issues/${issueId}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to delete issue");
    }
    throw new Error("Failed to delete issue. Please check your connection.");
  }
};


export const fetchIssueByUserId = async (projectId, userId) => {
  try {
    const response = await protectedApi.get(
      `/${projectId}/issues/?assignee=${userId}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to fetch issues by user"
      );
    }
    throw new Error("Failed to fetch issues by user. Please check your connection.");
  }
}
