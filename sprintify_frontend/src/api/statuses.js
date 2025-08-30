import { protectedApi } from "./config";

export const fetchStatuses = async (params = {}) => {
  const { projectId, ...otherParams } = params;
  
  if (projectId) {
    // Use the project-specific endpoint
    const response = await protectedApi.get(`/${projectId}/status`, { params: otherParams });
    return response.data.data?.statuses || response.data.statuses || response.data;
  } else {
    // No fallback - projectId is required
    throw new Error('Project ID is required to fetch statuses');
  }
};

export const fetchStatusTypeMap = async (projectId) => {
  const statuses = await fetchStatuses({ projectId });
  return Object.fromEntries(statuses.map((s) => [s.id, s.type]));
};

export const fetchStatusById = async (id, projectId) => {
  if (projectId) {
    const response = await protectedApi.get(`/${projectId}/status`, { params: { id } });
    return response.data.data?.status || response.data.status || response.data;
  } else {
    throw new Error('Project ID is required to fetch status by ID');
  }
};

export const createStatus = async (status, projectId) => {
  if (projectId) {
    const response = await protectedApi.post(`/${projectId}/status`, status);
    return response.data.data?.status || response.data.status || response.data;
  } else {
    throw new Error('Project ID is required to create status');
  }
};

export const updateStatus = async (id, updates, projectId) => {
  if (projectId) {
    const response = await protectedApi.patch(`/${projectId}/status`, updates);
    return response.data.data?.status || response.data.status || response.data;
  } else {
    throw new Error('Project ID is required to update status');
  }
};

export const deleteStatus = async (id, projectId) => {
  if (projectId) {
    await protectedApi.delete(`/${projectId}/status/${id}`);
  } else {
    throw new Error('Project ID is required to delete status');
  }
};