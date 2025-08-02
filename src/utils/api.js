import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://your-backend-url.com/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
};

export const userAPI = {
  updatePassword: (passwordData) => api.put('/user/password', passwordData),
  getStores: () => api.get('/user/stores'),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getStores: (params) => api.get('/admin/stores', { params }),
  addUser: (userData) => api.post('/admin/users', userData),
  addStore: (storeData) => api.post('/admin/stores', storeData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  deleteStore: (storeId) => api.delete(`/admin/stores/${storeId}`),
};

export const storeOwnerAPI = {
  getDashboard: () => api.get('/store-owner/dashboard'),
};

export const storesAPI = {
  getAll: (params) => api.get('/stores', { params }),
};

export const ratingsAPI = {
  submit: (ratingData) => api.post('/ratings', ratingData),
};

export default api; 