import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = 'http://10.0.2.2:5000/api'; // Android Emulator localhost

const api = axios.create({
  baseURL: API_URL,
});

// Intercept requests to attach the auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
