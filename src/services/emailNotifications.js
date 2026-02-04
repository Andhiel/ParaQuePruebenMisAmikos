import notificationService from './notificationService.js';

class EmailNotifications {
  
  // 1. Notificación de ausencia de ayudante
  async notificarAusenciaAyudante(datos) {
    const notificationData = {
      type: 'ausencia_ayudante',
      to: datos.directorEmail,
      subject: `🔔 Inasistencia Detectada - ${datos.ayudanteNombre}`,
      html: notificationService.getEmailTemplate('ausencia_ayudante', {
        directorNombre: datos.directorNombre,
        ayudanteNombre: datos.ayudanteNombre,
        ayudanteId: datos.ayudanteId,
        fecha: datos.fecha,
        proyectoNombre: datos.proyectoNombre,
        sistemaUrl: datos.sistemaUrl || 'https://tu-sistema.com'
      }),
      // También enviar al ayudante
      cc: datos.ayudanteEmail
    };

    try {
      await notificationService.sendEmailNotification(notificationData);
      console.log('✅ Notificación de ausencia enviada exitosamente');
    } catch (error) {
      console.error('❌ Error al enviar notificación de ausencia:', error);
      throw error;
    }
  }

  // 2. Notificación de avance subido (a jefatura y confirmación al director)
  async notificarAvanceSubido(datos) {
    // Notificación a jefatura
    const notificacionJefatura = {
      type: 'avance_subido',
      to: datos.jefaturaEmail,
      subject: `📈 Nuevo Avance - ${datos.proyectoNombre}`,
      html: notificationService.getEmailTemplate('avance_subido', {
        jefaturaNombre: datos.jefaturaNombre,
        directorNombre: datos.directorNombre,
        proyectoNombre: datos.proyectoNombre,
        fechaSubida: datos.fechaSubida,
        descripcion: datos.descripcion,
        sistemaUrl: datos.sistemaUrl || 'https://tu-sistema.com'
      })
    };

    // Confirmación al director
    const confirmacionDirector = {
      type: 'avance_subido_confirmacion',
      to: datos.directorEmail,
      subject: `✅ Avance Subido Exitosamente - ${datos.proyectoNombre}`,
      html: notificationService.getEmailTemplate('avance_subido', {
        jefaturaNombre: 'Usted',
        directorNombre: datos.directorNombre,
        proyectoNombre: datos.proyectoNombre,
        fechaSubida: datos.fechaSubida,
        descripcion: datos.descripcion,
        sistemaUrl: datos.sistemaUrl || 'https://tu-sistema.com'
      })
    };

    try {
      await Promise.all([
        notificationService.sendEmailNotification(notificacionJefatura),
        notificationService.sendEmailNotification(confirmacionDirector)
      ]);
      console.log('✅ Notificaciones de avance subido enviadas exitosamente');
    } catch (error) {
      console.error('❌ Error al enviar notificaciones de avance:', error);
      throw error;
    }
  }

  // 3. Notificación de avance aprobado
  async notificarAvanceAprobado(datos) {
    const notificationData = {
      type: 'avance_aprobado',
      to: datos.directorEmail,
      subject: `🎉 Avance Aprobado - ${datos.proyectoNombre}`,
      html: notificationService.getEmailTemplate('avance_aprobado', {
        directorNombre: datos.directorNombre,
        proyectoNombre: datos.proyectoNombre,
        fechaAprobacion: datos.fechaAprobacion,
        jefaturaNombre: datos.jefaturaNombre,
        comentarios: datos.comentarios || 'Avance revisado y aprobado exitosamente',
        sistemaUrl: datos.sistemaUrl || 'https://tu-sistema.com'
      })
    };

    try {
      await notificationService.sendEmailNotification(notificationData);
      console.log('✅ Notificación de avance aprobado enviada exitosamente');
    } catch (error) {
      console.error('❌ Error al enviar notificación de aprobación:', error);
      throw error;
    }
  }

  // 4. Notificación de avance rechazado
  async notificarAvanceRechazado(datos) {
    const notificationData = {
      type: 'avance_rechazado',
      to: datos.directorEmail,
      subject: `🔄 Avance Requiere Revisión - ${datos.proyectoNombre}`,
      html: notificationService.getEmailTemplate('avance_rechazado', {
        directorNombre: datos.directorNombre,
        proyectoNombre: datos.proyectoNombre,
        fechaRevision: datos.fechaRevision,
        jefaturaNombre: datos.jefaturaNombre,
        motivoRechazo: datos.motivoRechazo,
        observaciones: datos.observaciones,
        sistemaUrl: datos.sistemaUrl || 'https://tu-sistema.com'
      })
    };

    try {
      await notificationService.sendEmailNotification(notificationData);
      console.log('✅ Notificación de avance rechazado enviada exitosamente');
    } catch (error) {
      console.error('❌ Error al enviar notificación de rechazo:', error);
      throw error;
    }
  }

  // 5. Notificación de credenciales para director
  async notificarCredencialesDirector(datos) {
    const notificationData = {
      type: 'credenciales_director',
      to: datos.email,
      subject: `🎉 Bienvenido Director de Proyecto - ${datos.nombre}`,
      html: notificationService.getEmailTemplate('credenciales_director', {
        nombre: datos.nombre,
        usuario: datos.usuario,
        contrasena: datos.contrasena,
        codigo: datos.codigo,
        sistemaUrl: datos.sistemaUrl || 'https://tu-sistema.com'
      })
    };

    try {
      await notificationService.sendEmailNotification(notificationData);
      console.log('✅ Credenciales de director enviadas exitosamente');
    } catch (error) {
      console.error('❌ Error al enviar credenciales de director:', error);
      throw error;
    }
  }

  // 6. Notificación de credenciales para personal
  async notificarCredencialesPersonal(datos) {
    const notificationData = {
      type: 'credenciales_personal',
      to: datos.email,
      subject: `👋 Bienvenido al Sistema - ${datos.nombre}`,
      html: notificationService.getEmailTemplate('credenciales_personal', {
        nombre: datos.nombre,
        usuario: datos.usuario,
        contrasena: datos.contrasena,
        rol: datos.rol,
        codigo: datos.codigo,
        sistemaUrl: datos.sistemaUrl || 'https://tu-sistema.com'
      })
    };

    try {
      await notificationService.sendEmailNotification(notificationData);
      console.log('✅ Credenciales de personal enviadas exitosamente');
    } catch (error) {
      console.error('❌ Error al enviar credenciales de personal:', error);
      throw error;
    }
  }

  // Método para verificar ausencias diarias (se ejecuta automáticamente)
  async verificarAusenciasDiarias() {
    try {
      // Esta función debería llamarse desde un cron job o scheduler
      // Verifica ayudantes que no registraron asistencia ayer
      
      const response = await fetch('/api/ausencias/verificar-diarias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const ausenciasDetectadas = await response.json();

      // Enviar notificaciones por cada ausencia detectada
      for (const ausencia of ausenciasDetectadas) {
        await this.notificarAusenciaAyudante({
          directorNombre: ausencia.directorNombre,
          directorEmail: ausencia.directorEmail,
          ayudanteNombre: ausencia.ayudanteNombre,
          ayudanteEmail: ausencia.ayudanteEmail,
          ayudanteId: ausencia.ayudanteId,
          fecha: ausencia.fecha,
          proyectoNombre: ausencia.proyectoNombre,
          sistemaUrl: 'https://tu-sistema.com'
        });
      }

      console.log(`✅ Se procesaron ${ausenciasDetectadas.length} ausencias diarias`);
    } catch (error) {
      console.error('❌ Error en verificación diaria de ausencias:', error);
      throw error;
    }
  }

  // Método de prueba para enviar notificaciones
  async enviarNotificacionPrueba(emailDestino) {
    const notificationData = {
      type: 'test',
      to: emailDestino,
      subject: '🧪 Notificación de Prueba',
      html: notificationService.getEmailTemplate('default', {
        mensaje: 'Esta es una notificación de prueba del Sistema de Asistencia Universitaria.'
      })
    };

    try {
      await notificationService.sendEmailNotification(notificationData);
      console.log('✅ Notificación de prueba enviada exitosamente');
    } catch (error) {
      console.error('❌ Error al enviar notificación de prueba:', error);
      throw error;
    }
  }
}

export default new EmailNotifications();
