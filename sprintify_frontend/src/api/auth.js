import api, { baseUrl } from "./config";

// Helper function to determine if we're using json-server
const isJsonServer = () => baseUrl.includes('3001');

export const login = async (email, password) => {
  try {
    if (isJsonServer()) {
      // Mock login for json-server development
      const response = await api.get("/users");
      const users = response.data;
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Create a simple mock token
      const mockToken = btoa(JSON.stringify({ 
        userId: user.id, 
        email: user.email, 
        fullName: user.fullName,
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      }));

      return {
        success: true,
        token: mockToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          image: user.image,
          isEmailVerified: user.isEmailVerified
        },
        message: "Login successful",
      };
    } else {
      const response = await api.post("/user/login", {
        email,
        password,
      });

      const { user, token, success } = response.data;

      if (!success || !token) {
        throw new Error("Login failed");
      }

      return {
        success: true,
        token: token,
        user: user,
        message: "Login successful",
      };
    }
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Login failed");
    }
    throw new Error("Login failed. Please check your connection.");
  }
};
export const register = async (userData) => {
  try {
    const response = await api.post("/user/register", {
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName,
    });

    const { user, token, success } = response.data;

    if (!success || !token) {
      throw new Error("Registration failed");
    }

    return {
      success: true,
      token: token,
      user: user,
      message: "Registration successful",
    };
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Registration failed");
    }
    throw new Error("Registration failed. Please check your connection.");
  }
};
export const verifyEmail = async (token) => {
  try {
    const response = await api.post(
      "/user/verify-email",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Email verification failed"
      );
    }
    throw new Error("Email verification failed");
  }
};
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/user/forget-password", {
      email,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Password reset request failed"
      );
    }
    throw new Error("Password reset request failed");
  }
};
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post(
      "/user/password-reset",
      { newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Password reset failed");
    }
    throw new Error("Password reset failed");
  }
};
