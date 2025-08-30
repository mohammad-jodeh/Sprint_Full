import { protectedApi, baseUrl } from "./config";

// Helper function to determine if we're using json-server
const isJsonServer = () => baseUrl.includes('3001');

// Get board columns for a project
export const fetchBoardColumns = async (projectId) => {
  try {
    if (isJsonServer()) {
      const response = await protectedApi.get(`/columns`);
      const projectColumns = response.data.filter(column => column.projectId === projectId);
      return projectColumns;
    } else {
      const response = await protectedApi.get(`/${projectId}/board-columns`);
      return response.data.columns; // Extract columns array from response
    }
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to fetch board columns"
      );
    }
    throw new Error(
      "Failed to fetch board columns. Please check your connection."
    );
  }
};

// Create board column
export const createBoardColumn = async (projectId, columnData) => {
  try {
    const response = await protectedApi.post(`/${projectId}/board-columns`, columnData);
    return response.data; // Return the column data directly
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to create board column"
      );
    }
    throw new Error(
      "Failed to create board column. Please check your connection."
    );
  }
};

// Update board column
export const updateBoardColumn = async (projectId, columnId, columnData) => {
  try {
    const response = await protectedApi.patch(
      `/${projectId}/board-columns`,
      {
        id: columnId,
        ...columnData
      }
    );
    return response.data; // Return the column data directly
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to update board column"
      );
    }
    throw new Error(
      "Failed to update board column. Please check your connection."
    );
  }
};

// Delete board column
export const deleteBoardColumn = async (projectId, columnId) => {
  try {
    const response = await protectedApi.delete(`/${projectId}/board-columns/${columnId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to delete board column"
      );
    }
    throw new Error(
      "Failed to delete board column. Please check your connection."
    );
  }
};

// Bulk update column orders (for drag and drop reordering)
export const updateColumnOrders = async (projectId, columnUpdates) => {
  try {
    const updatePromises = columnUpdates.map(({ id, order }) =>
      protectedApi.patch(`/${projectId}/board-columns`, { id, order })
    );
    
    const responses = await Promise.all(updatePromises);
    return responses.map(response => response.data);
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to update column orders"
      );
    }
    throw new Error(
      "Failed to update column orders. Please check your connection."
    );
  }
};
