import api from "./api";

// Register
export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data; // returns { user, token }
};

// Login
export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data; // returns { user, token }
};

// Get current user
export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Update profile image
export const updateProfileImage = async (formData) => {
  const response = await api.put("/auth/update-profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
