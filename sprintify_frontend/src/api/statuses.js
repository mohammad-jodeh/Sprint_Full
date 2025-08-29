import { protectedApi } from "./config";

export const fetchStatuses = async (params = {}) => {
  const { projectId, ...otherParams } = params;
  
  if (projectId) {
    // Use the project-specific endpoint
    const response = await protectedApi.get(`/${projectId}/status`, { params: otherParams });
    return response.data.statuses || response.data;
  } else {
    // Fallback to the global endpoint (if available)
    const response = await protectedApi.get("/statuses", { params: otherParams });
    return response.data.statuses || response.data;
  }
};

export const fetchStatusTypeMap = async () => {
  const statuses = await fetchStatuses();
  return Object.fromEntries(statuses.map((s) => [s.id, s.type]));
};

export const fetchStatusById = async (id, projectId) => {
  if (projectId) {
    const response = await protectedApi.get(`/${projectId}/status`, { params: { id } });
    return response.data.status || response.data;
  } else {
    const response = await protectedApi.get(`/statuses/${id}`);
    return response.data.status || response.data;
  }
};

export const createStatus = async (status, projectId) => {
  if (projectId) {
    const response = await protectedApi.post(`/${projectId}/status`, status);
    return response.data.status || response.data;
  } else {
    const response = await protectedApi.post("/statuses", status);
    return response.data.status || response.data;
  }
};

export const updateStatus = async (id, updates, projectId) => {
  if (projectId) {
    const response = await protectedApi.patch(`/${projectId}/status`, updates);
    return response.data.status || response.data;
  } else {
    const response = await protectedApi.patch(`/statuses/${id}`, updates);
    return response.data.status || response.data;
  }
};

export const deleteStatus = async (id, projectId) => {
  if (projectId) {
    await protectedApi.delete(`/${projectId}/status/${id}`);
  } else {
    await protectedApi.delete(`/statuses/${id}`);
  }
};