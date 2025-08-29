import { protectedApi } from "./config";

export const fetchStatuses = async (params = {}) => {
  const { projectId, ...otherParams } = params;
  
  if (!projectId) {
    throw new Error("projectId is required for fetching statuses");
  }
  
  // Use the project-specific endpoint
  const response = await protectedApi.get(`/${projectId}/status`, { params: otherParams });
  return response.data.statuses || response.data;
};

export const fetchStatusTypeMap = async (projectId) => {
  if (!projectId) {
    throw new Error("projectId is required for fetching status type map");
  }
  
  const statuses = await fetchStatuses({ projectId });
  return Object.fromEntries(statuses.map((s) => [s.id, s.type]));
};

export const fetchStatusById = async (id, projectId) => {
  if (!projectId) {
    throw new Error("projectId is required for fetching status by ID");
  }
  
  const response = await protectedApi.get(`/${projectId}/status`, { params: { id } });
  return response.data.status || response.data;
};

export const createStatus = async (status, projectId) => {
  if (!projectId) {
    throw new Error("projectId is required for creating status");
  }
  
  const response = await protectedApi.post(`/${projectId}/status`, status);
  return response.data.status || response.data;
};

export const updateStatus = async (id, updates, projectId) => {
  if (!projectId) {
    throw new Error("projectId is required for updating status");
  }
  
  const response = await protectedApi.patch(`/${projectId}/status`, updates);
  return response.data.status || response.data;
};

export const deleteStatus = async (id, projectId) => {
  if (!projectId) {
    throw new Error("projectId is required for deleting status");
  }
  
  await protectedApi.delete(`/${projectId}/status/${id}`);
};