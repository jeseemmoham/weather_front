import axios from 'axios';

const getApiUrl = () => {
  let url = 'https://weather-back-rpdv.onrender.com';
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    url = process.env.REACT_APP_API_URL;
  } else if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    url = import.meta.env.VITE_API_URL;
  }
  
  // Ensure the backend URL cleanly maps to the /api route schema
  if (url && !url.endsWith('/api')) {
    url = url.replace(/\/$/, '') + '/api';
  }
  return url;
};

const API_BASE_URL = getApiUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
};

// ─── User API ──────────────────────────────────────────────
export const userAPI = {
  updateZipCode: (zipCode) => api.put('/users/zipcode', { zipCode }),
  updateProfile: (data) => api.put('/users/profile', data),
};

// ─── Alert API ─────────────────────────────────────────────
export const alertAPI = {
  getMyAlerts: (params) => api.get('/alerts', { params }),
  getAllAlerts: (params) => api.get('/alerts/all', { params }),
  getAlert: (id) => api.get(`/alerts/${id}`),
};

// ─── Admin API ─────────────────────────────────────────────
export const adminAPI = {
  createAlert: (data) => api.post('/admin/alerts', data),
  updateAlert: (id, data) => api.put(`/admin/alerts/${id}`, data),
  deleteAlert: (id) => api.delete(`/admin/alerts/${id}`),
  getUsers: () => api.get('/admin/users'),
};

export default api;
