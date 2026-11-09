import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('emilo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Notify the auth provider only when an authenticated request is unauthorized.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isAuthSubmission = /\/auth\/(login|register)(?:\?|$)/.test(requestUrl);
    if (error.response?.status === 401 && !isAuthSubmission && localStorage.getItem('emilo_token')) {
      window.dispatchEvent(new Event('emilo:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;

