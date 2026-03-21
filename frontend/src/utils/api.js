// API configuration for different environments
const REMOTE_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://uni-connect-backend.onrender.com";

const API_BASE_URL = import.meta.env.PROD ? REMOTE_BACKEND_URL : "";

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  return response;
};

// Socket.IO uses a dedicated URL so local frontend dev can still target a remote backend.
// Override with VITE_SOCKET_URL=http://localhost:7000 if you want to use a local backend.
export const SOCKET_URL = import.meta.env.PROD
  ? REMOTE_BACKEND_URL
  : import.meta.env.VITE_SOCKET_URL || REMOTE_BACKEND_URL;

export default API_BASE_URL;
