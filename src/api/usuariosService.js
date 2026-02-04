import api from "./axios";
import emailNotifications from "../services/emailNotifications.js";

export const registro = async (usuario) => {
  try {
    const response = await api.post("/usuarios", usuario);
    
    // Enviar notificación por correo según el rol
    if (usuario.rol === 'DIRECTOR_DE_PROYECTO') {
      await emailNotifications.notificarCredencialesDirector({
        nombre: usuario.nombre,
        email: usuario.correo,
        usuario: usuario.correo, // o el usuario que se genere
        contrasena: usuario.contrasena,
        codigo: usuario.codigo
      });
    } else if (usuario.rol === 'AYUDANTE') {
      await emailNotifications.notificarCredencialesPersonal({
        nombre: usuario.nombre,
        email: usuario.correo,
        usuario: usuario.correo,
        contrasena: usuario.contrasena,
        rol: usuario.rol,
        codigo: usuario.codigo
      });
    }
    
    return response;
  } catch (error) {
    console.error('Error en registro con notificación:', error);
    throw error;
  }
};
export const login = (credenciales) =>
  api.post("/usuarios/autenticar", credenciales);
export const modificarUsuario = (id, usuario) => api.put(`/usuarios/${id}`, usuario);
export const buscarPorId = (id) => api.get(`/usuarios/${id}`);
export const buscarPorCorreo = (correo) => api.get(`/usuarios/correo/${correo}`);
export const buscarPorCodigo = (codigo) => api.get(`/usuarios/codigo/${codigo}`);
export const buscarPorRol = (rol) => api.get(`/usuarios/rol/${rol}`);
export const listarUsuarios = () => api.get("/usuarios");
export const eliminarUsuario = (id) => api.delete(`/usuarios/${id}`);
