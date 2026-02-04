import api from "./axios";
import emailNotifications from "../services/emailNotifications.js";

// Subir avance de proyecto
export const subirAvance = async (proyectoId, avanceData) => {
  try {
    const response = await api.post(`/proyectos/${proyectoId}/avances`, avanceData);
    
    // Enviar notificaciones
    await emailNotifications.notificarAvanceSubido({
      jefaturaEmail: avanceData.jefaturaEmail,
      jefaturaNombre: avanceData.jefaturaNombre,
      directorEmail: avanceData.directorEmail,
      directorNombre: avanceData.directorNombre,
      proyectoNombre: avanceData.proyectoNombre,
      fechaSubida: new Date().toLocaleDateString(),
      descripcion: avanceData.descripcion
    });
    
    return response;
  } catch (error) {
    console.error('Error al subir avance:', error);
    throw error;
  }
};

// Aprobar avance
export const aprobarAvance = async (proyectoId, avanceId, datosAprobacion) => {
  try {
    const response = await api.patch(`/proyectos/${proyectoId}/avances/${avanceId}/aprobar`, datosAprobacion);
    
    // Enviar notificación de aprobación
    await emailNotifications.notificarAvanceAprobado({
      directorEmail: datosAprobacion.directorEmail,
      directorNombre: datosAprobacion.directorNombre,
      proyectoNombre: datosAprobacion.proyectoNombre,
      fechaAprobacion: new Date().toLocaleDateString(),
      jefaturaNombre: datosAprobacion.jefaturaNombre,
      comentarios: datosAprobacion.comentarios
    });
    
    return response;
  } catch (error) {
    console.error('Error al aprobar avance:', error);
    throw error;
  }
};

// Rechazar avance
export const rechazarAvance = async (proyectoId, avanceId, datosRechazo) => {
  try {
    const response = await api.patch(`/proyectos/${proyectoId}/avances/${avanceId}/rechazar`, datosRechazo);
    
    // Enviar notificación de rechazo
    await emailNotifications.notificarAvanceRechazado({
      directorEmail: datosRechazo.directorEmail,
      directorNombre: datosRechazo.directorNombre,
      proyectoNombre: datosRechazo.proyectoNombre,
      fechaRevision: new Date().toLocaleDateString(),
      jefaturaNombre: datosRechazo.jefaturaNombre,
      motivoRechazo: datosRechazo.motivoRechazo,
      observaciones: datosRechazo.observaciones
    });
    
    return response;
  } catch (error) {
    console.error('Error al rechazar avance:', error);
    throw error;
  }
};

export const crearProyecto = (proyecto) => api.post("/proyectos", proyecto);
export const modificarProyecto = (id, proyecto) => api.put(`/proyectos/${id}`, proyecto);
export const asignarPersonal = (proyectoId, personalId, rol) =>
  api.post(`/proyectos/${proyectoId}/asignar/${personalId}?rol=${rol}`);
export const listarProyectos = () => api.get("/proyectos");
export const listarProyectosActivos = () => api.get("/proyectos/activos");
export const cambiarEstadoProyecto = (id, estado) =>
  api.patch(`/proyectos/${id}/estado?estado=${estado}`);
export const buscarProyectoPorId = (id) => api.get(`/proyectos/${id}`);
export const buscarProyectoPorCodigo = (codigo) => api.get(`/proyectos/codigo/${codigo}`);
export const buscarProyectosPorEstado = (estado) => api.get(`/proyectos/estado/${estado}`);
export const eliminarProyecto = (id) => api.delete(`/proyectos/${id}`);
