import axios from "axios";

// Create a reusable axios instance
const api = axios.create({
  baseURL: "http://localhost:5001", // backend base url
});

// Register user
export const registerUser = async (formData) => {
  try {
    const res = await api.post("/auth/register", formData);
    return res.data;
  } catch (err) {
    // If backend sends error response
    if (err.response) {
      return err.response.data;
    }
    // If server is down
    return { success: false, message: "Server error" };
  }
};

export default api;
