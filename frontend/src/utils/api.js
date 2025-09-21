// API configuration for different environments
const API_BASE_URL = import.meta.env.PROD 
  ? "https://uni-connect-backend.onrender.com" 
  : "";

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

// Export the base URL for Socket.IO connections
export const SOCKET_URL = import.meta.env.PROD 
  ? "https://uni-connect-backend.onrender.com" 
  : "";

export default API_BASE_URL;
