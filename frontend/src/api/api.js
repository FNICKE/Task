// src/api/api.js
import axios from 'axios';

// Direct backend URL - no env variable, always connects to your deployed backend
const API_BASE_URL = 'https://backend-39pc.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // Check both localStorage and sessionStorage for token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

// Tasks
export const getTasks = async () => {
  const response = await api.get('/api/tasks');
  return response.data;
};

export const getTaskById = async (taskId) => {
  const response = await api.get(`/api/tasks/${taskId}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/api/tasks', taskData);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/api/tasks/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/api/tasks/${taskId}`);
  return response.data;
};

// Admin
export const getAllUsers = async () => {
  const response = await api.get('/api/admin/users');
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/api/admin/users/${userId}/role`, { role });
  return response.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  window.location.href = '/login';
};

export default api;