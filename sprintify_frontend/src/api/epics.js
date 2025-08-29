import { protectedApi } from "./config";

// Fetch all epics for a project
export const fetchEpics = async (projectId, params = {}) => {
  try {
    const response = await protectedApi.get(`/${projectId}/epic`, { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch epics:', error);
    throw error;
  }
};

// Fetch epic by ID
export const fetchEpicById = async (projectId, epicId) => {
  try {
    const response = await protectedApi.get(`/${projectId}/epic/${epicId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch epic:', error);
    throw error;
  }
};

// Fetch epic by key
export const fetchEpicByKey = async (projectId, key) => {
  try {
    const response = await protectedApi.get(`/${projectId}/epic/key/${key}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch epic by key:', error);
    throw error;
  }
};

// Create new epic
export const createEpic = async (projectId, epic) => {
  try {
    const response = await protectedApi.post(`/${projectId}/epic`, epic);
    return response.data;
  } catch (error) {
    console.error('Failed to create epic:', error);
    throw error;
  }
};

// Update epic
export const updateEpic = async (projectId, epicId, updates) => {
  try {
    const response = await protectedApi.patch(`/${projectId}/epic/${epicId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Failed to update epic:', error);
    throw error;
  }
};

// Delete epic
export const deleteEpic = async (projectId, epicId) => {
  try {
    const response = await protectedApi.delete(`/${projectId}/epic/${epicId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete epic:', error);
    throw error;
  }
};