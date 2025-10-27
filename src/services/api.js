import axios from 'axios';

// This logic is perfectly correct!
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_BASE_URL_SUFFIX || ''}`
    : 'http://localhost:8000/api';

// Good for debugging!
console.log("Using API Base URL:", apiBaseUrl);

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  // headers: { 'Content-Type': 'application/json', }, // <-- Not necessary, Axios does this automatically
});

apiClient.interceptors.request.use(
  (config) => {
    // --- vvvv THIS IS THE FIX vvvv ---
    // Change 'token' to 'authToken' to match AuthContext.jsx
    const token = localStorage.getItem('authToken'); 
    // --- ^^^^ THIS WAS THE FIX ^^^^ ---
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
