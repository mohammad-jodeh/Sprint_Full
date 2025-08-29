import { protectedApi } from "./config";

export const getUserByEmailOrId = async (userId =null , email = null) => {
  try {
    const response = await protectedApi.get(`/user/search?id=${userId}&email=${email}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to fetch user by email or ID"
      );
    }
    throw new Error("Failed to fetch user. Please check your connection.");
  }
}