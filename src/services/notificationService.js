import { API_URLS } from '../config/api.js';
import mockEmailService from './mockEmailService.js';

class NotificationService {
  constructor() {
    this.baseURL = API_URLS.baseURL;
    this.useMock = false;
  }

  // Enviar notificación por correo
  async sendEmailNotification(notificationData) {
    // Si estamos en modo mock o no hay backend, usar mock
    if (this.useMock || !this.isBackendAvailable()) {
      console.log('🔧 Usando MOCK email service');
      return await mockEmailService.sendEmailNotification(notificationData);
    }

    try {
      const response = await fetch(`${this.baseURL}/api/notifications/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData)
      });

      if (!response.ok) {
        throw new Error('Error al enviar notificación');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en sendEmailNotification, usando mock:', error);
      // Fallback a mock si falla el backend
      return await mockEmailService.sendEmailNotification(notificationData);
    }
  }

  // Verificar si el backend está disponible
  isBackendAvailable() {
    // En desarrollo, podemos verificar si el backend está corriendo
    try {
      // Simple check - si estamos en localhost y el puerto está disponible
      return !window.location.hostname.includes('localhost') || this.baseURL.includes('localhost');
    } catch {
      return false;
    }
  }

  // Activar/desactivar modo mock
  enableMock() {
    this.useMock = true;
    mockEmailService.enableMock();
  }

  disableMock() {
    this.useMock = false;
    mockEmailService.disableMock();
  }

  // Obtener emails enviados (solo en modo mock)
  getSentEmails() {
    return mockEmailService.getSentEmails();
  }

  // Limpiar emails (solo en modo mock)
  clearEmails() {
    mockEmailService.clearEmails();
  }

  // Plantilla HTML para correos
  getEmailTemplate(type, data) {
    const templates = {
      ausencia_ayudante: this.getAusenciaTemplate(data),
      avance_subido: this.getAvanceSubidoTemplate(data),
      avance_aprobado: this.getAvanceAprobadoTemplate(data),
      avance_rechazado: this.getAvanceRechazadoTemplate(data),
      credenciales_director: this.getCredencialesDirectorTemplate(data),
      credenciales_personal: this.getCredencialesPersonalTemplate(data)
    };

    return templates[type] || this.getDefaultTemplate(data);
  }

  // Plantilla para notificación de ausencia
  getAusenciaTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Notificación de Inasistencia</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .info-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
          .btn { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Notificación de Inasistencia</h1>
            <p>Sistema de Asistencia Universitaria</p>
          </div>
          <div class="content">
            <h2>Estimado/a ${data.directorNombre},</h2>
            <p>Le informamos que se ha detectado una inasistencia:</p>
            
            <div class="info-box">
              <h3>📋 Detalles de la Inasistencia:</h3>
              <p><strong>Ayudante:</strong> ${data.ayudanteNombre}</p>
              <p><strong>ID Ayudante:</strong> ${data.ayudanteId}</p>
              <p><strong>Fecha:</strong> ${data.fecha}</p>
              <p><strong>Proyecto:</strong> ${data.proyectoNombre}</p>
            </div>

            <p>Se recomienda contactar al ayudante para conocer el motivo de la inasistencia y tomar las acciones correspondientes.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.sistemaUrl}" class="btn">Ir al Sistema de Asistencia</a>
            </div>
          </div>
          <div class="footer">
            <p>Este es un mensaje automático del Sistema de Asistencia Universitaria</p>
            <p>Por favor no responda a este correo</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Plantilla para avance subido
  getAvanceSubidoTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nuevo Avance Subido</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .success-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
          .btn { display: inline-block; padding: 12px 24px; background: #4facfe; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📈 Nuevo Avance de Proyecto</h1>
            <p>Sistema de Gestión de Proyectos</p>
          </div>
          <div class="content">
            <h2>Estimado/a ${data.jefaturaNombre},</h2>
            <p>Le informamos que se ha subido un nuevo avance de proyecto:</p>
            
            <div class="success-box">
              <h3>📋 Detalles del Avance:</h3>
              <p><strong>Director de Proyecto:</strong> ${data.directorNombre}</p>
              <p><strong>Proyecto:</strong> ${data.proyectoNombre}</p>
              <p><strong>Fecha de subida:</strong> ${data.fechaSubida}</p>
              <p><strong>Descripción:</strong> ${data.descripcion}</p>
            </div>

            <p>Por favor revise el avance y proceda con la aprobación o rechazo según corresponda.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.sistemaUrl}" class="btn">Revisar Avance</a>
            </div>
          </div>
          <div class="footer">
            <p>Este es un mensaje automático del Sistema de Gestión de Proyectos</p>
            <p>Por favor no responda a este correo</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Plantilla para avance aprobado
  getAvanceAprobadoTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Avance Aprobado</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .success-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
          .btn { display: inline-block; padding: 12px 24px; background: #11998e; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Avance Aprobado</h1>
            <p>Sistema de Gestión de Proyectos</p>
          </div>
          <div class="content">
            <h2>¡Felicitaciones ${data.directorNombre}!</h2>
            <p>Su avance ha sido aprobado por la jefatura:</p>
            
            <div class="success-box">
              <h3>📋 Detalles:</h3>
              <p><strong>Proyecto:</strong> ${data.proyectoNombre}</p>
              <p><strong>Fecha de aprobación:</strong> ${data.fechaAprobacion}</p>
              <p><strong>Aprobado por:</strong> ${data.jefaturaNombre}</p>
              <p><strong>Comentarios:</strong> ${data.comentarios}</p>
            </div>

            <p>Puede continuar con el siguiente fase del proyecto. ¡Excelente trabajo!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.sistemaUrl}" class="btn">Ver Proyecto</a>
            </div>
          </div>
          <div class="footer">
            <p>Este es un mensaje automático del Sistema de Gestión de Proyectos</p>
            <p>Por favor no responda a este correo</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Plantilla para avance rechazado
  getAvanceRechazadoTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Avance Requiere Revisión</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .warning-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
          .btn { display: inline-block; padding: 12px 24px; background: #eb3349; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔄 Avance Requiere Revisión</h1>
            <p>Sistema de Gestión de Proyectos</p>
          </div>
          <div class="content">
            <h2>Estimado/a ${data.directorNombre},</h2>
            <p>Su avance ha sido revisado y requiere algunos ajustes:</p>
            
            <div class="warning-box">
              <h3>📋 Detalles de la Revisión:</h3>
              <p><strong>Proyecto:</strong> ${data.proyectoNombre}</p>
              <p><strong>Fecha de revisión:</strong> ${data.fechaRevision}</p>
              <p><strong>Revisado por:</strong> ${data.jefaturaNombre}</p>
              <p><strong>Motivo del rechazo:</strong> ${data.motivoRechazo}</p>
              <p><strong>Observaciones:</strong> ${data.observaciones}</p>
            </div>

            <p>Por favor realice las correcciones necesarias y vuelva a subir el avance.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.sistemaUrl}" class="btn">Corregir Avance</a>
            </div>
          </div>
          <div class="footer">
            <p>Este es un mensaje automático del Sistema de Gestión de Proyectos</p>
            <p>Por favor no responda a este correo</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Plantilla para credenciales de director
  getCredencialesDirectorTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Bienvenido Director de Proyecto</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .credentials-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
          .btn { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bienvenido Director de Proyecto</h1>
            <p>Sistema de Asistencia Universitaria</p>
          </div>
          <div class="content">
            <h2>Estimado/a ${data.nombre},</h2>
            <p>Le damos la bienvenida al Sistema de Asistencia Universitaria. Sus credenciales de acceso son:</p>
            
            <div class="credentials-box">
              <h3>🔐 Credenciales de Acceso:</h3>
              <p><strong>Usuario:</strong> ${data.usuario}</p>
              <p><strong>Contraseña temporal:</strong> ${data.contrasena}</p>
              <p><strong>Rol:</strong> Director de Proyecto</p>
              <p><strong>Código:</strong> ${data.codigo}</p>
            </div>

            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p><strong>⚠️ Importante:</strong> Por seguridad, le recomendamos cambiar su contraseña temporal en su primer inicio de sesión.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.sistemaUrl}" class="btn">Iniciar Sesión</a>
            </div>
          </div>
          <div class="footer">
            <p>Este es un mensaje automático del Sistema de Asistencia Universitaria</p>
            <p>Por favor no responda a este correo</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Plantilla para credenciales de personal
  getCredencialesPersonalTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Bienvenido Personal</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .credentials-box { background: #e8f5e8; border-left: 4px solid #4caf50; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
          .btn { display: inline-block; padding: 12px 24px; background: #11998e; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👋 Bienvenido al Sistema</h1>
            <p>Sistema de Asistencia Universitaria</p>
          </div>
          <div class="content">
            <h2>Estimado/a ${data.nombre},</h2>
            <p>Ha sido registrado en el Sistema de Asistencia Universitaria. Sus credenciales de acceso son:</p>
            
            <div class="credentials-box">
              <h3>🔐 Credenciales de Acceso:</h3>
              <p><strong>Usuario:</strong> ${data.usuario}</p>
              <p><strong>Contraseña temporal:</strong> ${data.contrasena}</p>
              <p><strong>Rol:</strong> ${data.rol}</p>
              <p><strong>Código:</strong> ${data.codigo}</p>
            </div>

            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p><strong>⚠️ Importante:</strong> Por seguridad, le recomendamos cambiar su contraseña temporal en su primer inicio de sesión.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.sistemaUrl}" class="btn">Iniciar Sesión</a>
            </div>
          </div>
          <div class="footer">
            <p>Este es un mensaje automático del Sistema de Asistencia Universitaria</p>
            <p>Por favor no responda a este correo</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Plantilla por defecto
  getDefaultTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Notificación del Sistema</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Notificación del Sistema</h1>
          </div>
          <div class="content">
            <p>${data.mensaje || 'Tiene una nueva notificación en el sistema.'}</p>
          </div>
          <div class="footer">
            <p>Este es un mensaje automático del Sistema de Asistencia Universitaria</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new NotificationService();
