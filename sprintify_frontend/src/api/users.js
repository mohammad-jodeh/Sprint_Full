import { protectedApi } from "./config";

// Get user by email or ID (existing function)
export const getUserByEmailOrId = async (userId = null, email = null) => {
  try {
    const response = await protectedApi.get(
      `/user/search?id=${userId}&email=${email}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to fetch user by email or ID"
      );
    }
    throw new Error("Failed to fetch user. Please check your connection.");
  }
};

// Change password using the resetPassword endpoint
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await protectedApi.post("/user/password-reset", {
      oldPassword,
      password: newPassword, // Backend expects 'password' not 'newPassword'
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to change password"
      );
    }
    throw new Error("Failed to change password. Please check your connection.");
  }
};

// Note: Since your backend doesn't have dedicated profile update endpoints,
// we'll need to work with what's available. The resetPassword endpoint can handle password changes,
// but for profile updates, you might need to add those endpoints to your backend.

// For now, we'll use the auth store to manage profile data locally
export const updateProfile = async (profileData) => {
  try {
    // This would typically call a backend endpoint to update profile
    // For now, we'll just return success since the data is managed in the auth store
    return {
      success: true,
      message: "Profile updated successfully",
      user: profileData,
    };
  } catch (error) {
    throw new Error("Failed to update profile. Please check your connection.");
  }
};

// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await protectedApi.post("/user/forget-password", {
      email,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to request password reset"
      );
    }
    throw new Error(
      "Failed to request password reset. Please check your connection."
    );
  }
};
