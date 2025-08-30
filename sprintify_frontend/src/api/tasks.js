import { protectedApi } from "./config";

// Fetch tasks (which are issues in the backend) for a project
export const fetchTasks = async (projectId, params = {}) => {
  try {
    const response = await protectedApi.get(`/${projectId}/issues`, { params });
    return response.data.data?.issues || response.data.issues || response.data;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw error;
  }
};

// Fetch task by ID
export const fetchTaskById = async (projectId, taskId) => {
  try {
    const response = await protectedApi.get(`/${projectId}/issues/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch task:', error);
    throw error;
  }
};

// Create new task
export const createTask = async (projectId, taskData) => {
  try {
    const response = await protectedApi.post(`/${projectId}/issues`, taskData);
    return response.data;
  } catch (error) {
    console.error('Failed to create task:', error);
    throw error;
  }
};

// Update task
export const updateTask = async (projectId, taskId, updates) => {
  try {
    const response = await protectedApi.patch(`/${projectId}/issues/${taskId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Failed to update task:', error);
    throw error;
  }
};

// Delete task
export const deleteTask = async (projectId, taskId) => {
  try {
    const response = await protectedApi.delete(`/${projectId}/issues/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete task:', error);
    throw error;
  }
};

// Fetch project task statistics
export const fetchProjectTaskStatistics = async (projectId) => {
  try {
    const tasks = await fetchTasks(projectId);
    
    // Calculate statistics based on task status
    const statistics = {
      total: tasks.length,
      todo: tasks.filter(task => task.status === 'TODO' || task.status === 'BACKLOG').length,
      in_progress: tasks.filter(task => task.status === 'IN_PROGRESS' || task.status === 'IN PROGRESS').length,
      done: tasks.filter(task => task.status === 'DONE' || task.status === 'COMPLETED').length,
    };
    
    return statistics;
  } catch (error) {
    console.error('Failed to fetch project task statistics:', error);
    throw error;
  }
};

// Get tasks assigned to current user
export const fetchMyTasks = async (projectId) => {
  try {
    const response = await protectedApi.get(`/${projectId}/issues?assignedToMe=true`);
    return response.data.data?.issues || response.data.issues || response.data;
  } catch (error) {
    console.error('Failed to fetch my tasks:', error);
    throw error;
  }
};