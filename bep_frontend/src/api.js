import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001', // Backend server URL
});

// Attach the token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  if (token) {
    config.headers['x-auth-token'] = token; // Add token to headers
  }
  return config;
});

export default api;

