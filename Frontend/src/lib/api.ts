import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://chota-beta.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('chota_beta_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
