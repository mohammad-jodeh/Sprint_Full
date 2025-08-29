import { protectedApi } from "./config";

export const fetchProjects = async () => {
  try {
    const response = await protectedApi.get("/project");
    return response.data;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw error;
  }
};

export const fetchProjectById = async (id) => {
  try {
    const response = await protectedApi.get(`/project/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch project:', error);
    throw error;
  }
};

export const createProject = async (project) => {
  try {
    const response = await protectedApi.post("/project", project);
    return response.data;
  } catch (error) {
    console.error('Failed to create project:', error);
    throw error;
  }
};

export const updateProject = async (updates) => {
  try {
    console.log('Updating project with data:', updates);
    const response = await protectedApi.patch("/project", updates);
    return response.data;
  } catch (error) {
    console.error('Failed to update project:', error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    const response = await protectedApi.delete(`/project/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete project:', error);
    throw error;
  }
};

export const fetchProjectWithDetails = async (id) => {
  try {
    const projectData = await fetchProjectById(id);
    // Since the backend might return project with members, we'll adapt accordingly
    return projectData;
  } catch (error) {
    console.error('Failed to fetch project with details:', error);
    throw error;
  }
};