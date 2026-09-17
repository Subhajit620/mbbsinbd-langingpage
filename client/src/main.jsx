import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';

// Configure Axios defaults globally for API connection
// In production or on VPS, relative path '' allows requests to hit the server directly, or use VITE_API_URL if provided
const apiBase = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? 'http://localhost:5000' : '');

axios.defaults.baseURL = apiBase;
axios.defaults.withCredentials = true;

// Attach the stored admin token (if any) to every outgoing request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
