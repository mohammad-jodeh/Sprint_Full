import { protectedApi } from "./config";

export const fetchStatuses = async (params = {}) => {
  const { projectId, ...otherParams } = params;
  
  if (projectId) {
    // Use the project-specific endpoint
    console.log("🔍 [FETCH-STATUSES] Fetching statuses for projectId:", projectId, "with params:", otherParams);
    const response = await protectedApi.get(`/${projectId}/status`, { params: otherParams });
    console.log("📦 [FETCH-STATUSES] Full response:", response.data);
    
    const statuses = response.data.data?.statuses || response.data.statuses || response.data;
    console.log("✅ [FETCH-STATUSES] Extracted statuses:", statuses, "Count:", Array.isArray(statuses) ? statuses.length : 0);
    return statuses;
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
    console.log("📝 [CREATE-STATUS] Sending status creation request:", { projectId, statusData: status });
    try {
      const response = await protectedApi.post(`/${projectId}/status`, status);
      console.log("📝 [CREATE-STATUS] Full response received:", response.data);
      const result = response.data.data?.status || response.data.status || response.data;
      console.log("✅ [CREATE-STATUS] Extracted result:", result);
      return result;
    } catch (error) {
      console.error("❌ [CREATE-STATUS] Error:", error.message);
      if (error.response?.data) {
        console.error("❌ [CREATE-STATUS] Error response data:", error.response.data);
      }
      throw error;
    }
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