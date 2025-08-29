import api from "./config";

export const fetchColumns = async (params = {}) => {
  try {
    const response = await api.get("/columns", { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch columns:", error);
    return [];
  }
};

export const fetchColumnById = async (id) => {
  try {
    const response = await api.get(`/columns/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch column:", error);
    return null;
  }
};

export const createColumn = async (column) => {
  try {
    const response = await api.post("/columns", column);
    return response.data;
  } catch (error) {
    console.error("Failed to create column:", error);
    throw error;
  }
};

export const updateColumn = async (id, updates) => {
  try {
    const response = await api.patch(`/columns/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error("Failed to update column:", error);
    throw error;
  }
};

export const deleteColumn = async (id) => {
  try {
    const response = await api.delete(`/columns/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete column:", error);
    throw error;
  }
};
