// Configuración de APIs para producción y desarrollo
const API_CONFIG = {
  // Desarrollo local
  development: {
    baseURL: 'http://localhost:8080', // Cambia esto por la IP del backend
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      personal: '/api/personal',
      proyectos: '/api/proyectos',
      ausencias: '/api/ausencias',
      contratos: '/api/contratos',
      biometria: '/api/biometria'
    }
  },
  
  // Producción (desplegado en web)
  production: {
    baseURL: 'https://tu-backend-api.com', // URL real del backend
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      personal: '/api/personal',
      proyectos: '/api/proyectos',
      ausencias: '/api/ausencias',
      contratos: '/api/contratos',
      biometria: '/api/biometria'
    }
  }
};

// Obtener configuración actual
const getCurrentConfig = () => {
  const env = import.meta.env.MODE || 'development';
  return API_CONFIG[env];
};

// URLs completas de las APIs
export const API_URLS = getCurrentConfig();

// Para desarrollo con IP específica
export const setDevelopmentAPI = (ip) => {
  API_CONFIG.development.baseURL = `http://${ip}:8080`;
};

export default API_URLS;
