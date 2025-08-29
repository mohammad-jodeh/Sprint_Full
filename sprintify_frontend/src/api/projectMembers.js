import { protectedApi, baseUrl } from "./config";

// Helper function to determine if we're using json-server
const isJsonServer = () => baseUrl.includes('3001');

// 🔹 Get all members of a specific project with user data
export const getProjectMembers = async (projectId) => {
  try {
    if (isJsonServer()) {
      // Get project members from json-server
      const [membersResponse, usersResponse] = await Promise.all([
        protectedApi.get("/project_members"),
        protectedApi.get("/users")
      ]);
      
      const allMembers = membersResponse.data;
      const allUsers = usersResponse.data;
      
      // Filter members by projectId and populate user data
      const projectMembers = allMembers
        .filter(member => member.projectId === projectId)
        .map(member => {
          const user = allUsers.find(u => u.id === member.userId);
          return {
            ...member,
            user: user || null,
            // Map permission string to number for consistency
            permission: typeof member.permission === 'string' ? 
              (member.permission === 'ADMINISTRATOR' ? 2 : 
               member.permission === 'MODERATOR' ? 1 : 0) : 
              member.permission
          };
        });
      
      return { members: projectMembers };
    } else {
      const response = await protectedApi.get(`/${projectId}/members`);
      return response.data;
    }
  } catch (error) {
    console.error("Failed to fetch project members:", error);
    throw error;
  }
};

// 🔹 Add a member to a project
export const addProjectMember = async (
  projectId,
  memberData = {
    userId: null,
    permission: 0, // 0 = member, 1 = moderator, 2 = admin
  }
) => {
  console.log("Adding project member:", projectId, memberData);
  try {
    const response = await protectedApi.post(
      `/${projectId}/members`,
      memberData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to add project member:", error);
    throw error;
  }
};

// 🔹 Remove a member by projectId + membershipId
export const removeProjectMember = async (projectId, membershipId) => {
  try {
    const response = await protectedApi.delete(
      `/${projectId}/members/${membershipId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to remove project member:", error);
    throw error;
  }
};

// 🔹 Update member permissions
export const updateProjectMember = async (projectId, memberData) => {
  try {
    const response = await protectedApi.patch(
      `/${projectId}/members`,
      memberData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update project member:", error);
    throw error;
  }
};
