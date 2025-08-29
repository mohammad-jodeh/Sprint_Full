import { protectedApi, baseUrl } from "./config";

// Helper function to determine if we're using json-server
const isJsonServer = () => baseUrl.includes('3001');

// Get all issues for a project
export const fetchIssues = async (projectId) => {
  try {
    const endpoint = isJsonServer() ? `/issues` : `/${projectId}/issues`;
    const response = await protectedApi.get(endpoint);
    
    if (isJsonServer()) {
      // Filter issues by projectId when using json-server
      const allIssues = response.data;
      const projectIssues = allIssues.filter(issue => issue.projectId === projectId);
      return { data: projectIssues };
    }
    
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
    const endpoint = isJsonServer() ? `/issues/${issueId}` : `/${projectId}/issues/${issueId}`;
    const response = await protectedApi.get(endpoint);
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
    if (isJsonServer()) {
      // For json-server, we need to include projectId in the issue data
      const issueWithProject = { ...issueData, projectId };
      const response = await protectedApi.post(`/issues`, issueWithProject);
      return { data: response.data };
    } else {
      const response = await protectedApi.post(`/${projectId}/issues`, issueData);
      return response.data;
    }
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
    if (isJsonServer()) {
      // For json-server, use simple PATCH to /issues/{id}
      const response = await protectedApi.patch(`/issues/${issueId}`, issueData);
      return { data: response.data };
    } else {
      const response = await protectedApi.patch(
        `/${projectId}/issues/${issueId}`,
        issueData
      );
      return response.data;
    }
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
    const endpoint = isJsonServer() ? `/issues/${issueId}` : `/${projectId}/issues/${issueId}`;
    const response = await protectedApi.delete(endpoint);
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
    if (isJsonServer()) {
      // Get all issues and filter by assignee and projectId
      const response = await protectedApi.get(`/issues`);
      const userIssues = response.data.filter(issue => 
        issue.assignee === userId && issue.projectId === projectId
      );
      return { data: userIssues };
    } else {
      const response = await protectedApi.get(
        `/${projectId}/issues/?assignee=${userId}`
      );
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to fetch issues by user"
      );
    }
    throw new Error("Failed to fetch issues by user. Please check your connection.");
  }
}
