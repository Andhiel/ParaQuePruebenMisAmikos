import axios from "axios";
import { API_URLS } from "../config/api.js";

const api = axios.create({
  baseURL: API_URLS.baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.code === 'ECONNREFUSED') {
      console.error('No se puede conectar al backend. Verifica que el servidor esté corriendo.');
    }
    return Promise.reject(error);
  }
);

export default api;
