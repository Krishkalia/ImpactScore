import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://impactscore.onrender.com/api'),
  withCredentials: true,
});

// Response interceptor for handling token refresh could go here

export default api;
