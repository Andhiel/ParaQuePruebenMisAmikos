# 📧 Sistema de Notificaciones por Correo

## 🎯 Overview

Este sistema implementa notificaciones automáticas por correo electrónico para el Sistema de Asistencia Universitaria. Permite enviar diferentes tipos de notificaciones profesionales con plantillas HTML personalizadas y soporte completo para pruebas sin necesidad de backend.

## 🚀 Quick Start

### 1. Acceso al Sistema de Pruebas
```bash
npm run dev
# Visitar: http://localhost:5173/test-notificaciones
```

### 2. Probar Notificaciones
1. Ingresa tu correo electrónico
2. Activa el modo Mock (recomendado para pruebas)
3. Selecciona el tipo de notificación
4. Haz clic en el botón correspondiente
5. Observa los resultados en la interfaz y consola

## 📋 Tipos de Notificaciones

### 🔔 1. Ausencia de Ayudante
**Cuándo se envía:** Cuando un ayudante no registra asistencia un día

**Destinatarios:**
- Director de proyecto (notificación principal)
- Ayudante (notificación de inasistencia)

**Contenido:**
- Nombre del ayudante
- Fecha de la ausencia
- Proyecto asignado
- Instrucciones para el director

### 📈 2. Avance de Proyecto Subido
**Cuándo se envía:** Cuando un director sube un nuevo avance

**Destinatarios:**
- Jefatura (notificación principal)
- Director (confirmación de subida)

**Contenido:**
- Nombre del director
- Nombre del proyecto
- Descripción del avance
- Fecha de subida

### ✅ 3. Avance Aprobado
**Cuándo se envía:** Cuando jefatura aprueba un avance

**Destinatarios:**
- Director de proyecto

**Contenido:**
- Confirmación de aprobación
- Comentarios de jefatura
- Fecha de aprobación
- Próximos pasos

### ❌ 4. Avance Rechazado
**Cuándo se envía:** Cuando jefatura rechaza un avance

**Destinatarios:**
- Director de proyecto

**Contenido:**
- Motivo del rechazo
- Observaciones y correcciones
- Fecha de revisión
- Instrucciones para corregir

### 👋 5. Credenciales de Acceso
**Cuándo se envía:** Cuando se crea un nuevo usuario

**Destinatarios:**
- Nuevo usuario (director o personal)

**Contenido:**
- Credenciales de acceso
- Instrucciones de seguridad
- Enlace al sistema
- Rol asignado

## 🎨 Plantillas de Correo

### Diseño y Estilo
- **Responsive:** Se adaptan a cualquier dispositivo
- **Modernas:** Gradientes vibrantes y glassmorphism
- **Profesionales:** Branding consistente del sistema
- **Accesibles:** Buen contraste y estructura clara

### Colores por Tipo
- **Ausencias:** Amarillo (advertencia)
- **Avances:** Azul (información)
- **Aprobaciones:** Verde (éxito)
- **Rechazos:** Rojo (corrección)
- **Credenciales:** Púrpur/Azul (seguridad)

## 🔧 Arquitectura del Sistema

### Frontend Components
```
src/
├── services/
│   ├── notificationService.js     # Motor principal de notificaciones
│   ├── emailNotifications.js      # Tipos específicos de notificaciones
│   └── mockEmailService.js        # Servicio de pruebas sin backend
├── components/
│   └── NotificationTester.jsx     # UI de pruebas y visualización
└── config/
    └── api.js                    # Configuración de APIs
```

### Flujo de Datos
1. **Usuario** realiza acción (registro, subida, etc.)
2. **Frontend** llama al servicio correspondiente
3. **Servicio** prepara datos y plantilla
4. **Email Service** envía notificación
5. **Mock/Real** según configuración

## 🧪 Modo de Pruebas

### Características del Modo Mock
- **Sin backend:** Funciona completamente local
- **Visualización inmediata:** Emails aparecen en tiempo real
- **Historial completo:** Todos los emails guardados
- **Consola logging:** Detalles completos para debugging
- **Simulación de errores:** 10% de probabilidad de fallo

### Uso del Modo Mock
1. Activa el interruptor ⚙️ en el probador
2. Envía cualquier notificación
3. Observa resultados en la lista
4. Revisa consola para detalles HTML

### Ventajas del Modo Mock
- **Rápido:** Sin dependencias externas
- **Seguro:** Sin envío real de correos
- **Completo:** Todas las funcionalidades disponibles
- **Debug:** Información detallada en consola

## 🌐 Configuración de Backend

### Requisitos Mínimos
```bash
npm install nodemailer express cors dotenv
```

### Variables de Entorno
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicacion
EMAIL_FROM=Sistema Asistencia <tu-correo@gmail.com>
```

### Endpoints Requeridos
```
POST /api/notifications/send-email
POST /api/notifications/verificar-diarias
```

### Guía Completa
Ver `BACKEND_EMAIL_SETUP.md` para implementación completa del backend.

## 🔄 Integración con Servicios Existentes

### Usuarios Service
```javascript
import { registro } from '../api/usuariosService.js';

// Al registrar usuario, envía automáticamente credenciales
await registro({
  nombre: 'Juan Pérez',
  correo: 'juan@ejemplo.com',
  rol: 'DIRECTOR_DE_PROYECTO',
  contrasena: 'Temp123456'
});
```

### Proyectos Service
```javascript
import { subirAvance } from '../api/proyectosService.js';

// Al subir avance, notifica a jefatura
await subirAvance(proyectoId, {
  descripcion: 'Módulo de autenticación completado',
  jefaturaEmail: 'jefatura@ejemplo.com',
  directorEmail: 'director@ejemplo.com'
});
```

## 📊 Monitoreo y Debugging

### Visualización de Emails
- **Interfaz:** Lista animada con detalles básicos
- **Consola:** HTML completo y metadata
- **Historial:** Todos los emails persisten en sesión
- **Estados:** Enviado, Error, Pendiente

### Logs en Consola
```javascript
// Ejemplo de log
📧 Email enviado (MOCK): {
  timestamp: "2026-02-04T16:30:00.000Z",
  to: "usuario@ejemplo.com",
  subject: "🔔 Inasistencia Detectada - María García",
  html: "<!DOCTYPE html>...</html>",
  status: "sent"
}
```

### Manejo de Errores
- **Fallback automático** a mock si falla backend
- **Logging detallado** de errores
- **Notificaciones toast** para usuario
- **Reintentos** configurables

## 🎯 Casos de Uso

### Flujo Completo de Ausencias
1. **Sistema** verifica ausencias diarias (cron job)
2. **Detecta** ayudante sin registro ayer
3. **Prepara** notificación con plantilla
4. **Envía** email al director y ayudante
5. **Registra** acción en logs

### Flujo de Avances
1. **Director** sube nuevo avance
2. **Sistema** notifica a jefatura
3. **Jefatura** revisa y aprueba/rechaza
4. **Sistema** notifica resultado al director
5. **Director** recibe feedback y continúa

## 🚀 Despliegue

### Producción
1. **Configurar** variables de entorno
2. **Implementar** backend según guía
3. **Desactivar** modo mock
4. **Configurar** dominio y SSL
5. **Probar** flujo completo

### Desarrollo
1. **Usar** modo mock para pruebas
2. **Activar** logs detallados
3. **Probar** todos los tipos de notificaciones
4. **Verificar** plantillas HTML
5. **Validar** integración con servicios

## 🔧 Personalización

### Modificar Plantillas
Editar `src/services/notificationService.js`:
```javascript
getAusenciaTemplate(data) {
  return `<!-- Tu HTML personalizado -->`;
}
```

### Agregar Nuevos Tipos
1. Crear método en `emailNotifications.js`
2. Agregar plantilla en `notificationService.js`
3. Integrar en servicio correspondiente
4. Agregar botón en `NotificationTester.jsx`

### Cambiar Colores y Estilos
Modificar CSS en plantillas HTML:
```css
.header { background: linear-gradient(135deg, #tu-color, #tu-color-2); }
```

## 📈 Métricas y Estadísticas

### Datos Disponibles
- **Cantidad de emails** enviados por tipo
- **Tasa de éxito** de envíos
- **Tiempo de respuesta** del servicio
- **Errores comunes** y frecuencia

### Monitoreo Sugerido
- **Alertas** por tasa de error > 5%
- **Reportes** diarios de envíos
- **Dashboard** de métricas en tiempo real
- **Logs** archivados para auditoría

## 🆘 Soporte y Troubleshooting

### Problemas Comunes
1. **Emails no llegan:** Verificar configuración SMTP
2. **Plantillas rotas:** Validar HTML y CSS
3. **Modo mock no funciona:** Revisar imports
4. **Backend no responde:** Verificar CORS y endpoints

### Soluciones Rápidas
- **Reiniciar** servidor de desarrollo
- **Limpiar** caché del navegador
- **Verificar** variables de entorno
- **Probar** con diferentes correos

### Contacto de Soporte
- **Documentación:** `BACKEND_EMAIL_SETUP.md`
- **Issues:** GitHub repository
- **Logs:** Consola del navegador y servidor

---

## 🎉 ¡Listo para Usar!

El sistema de notificaciones está completamente funcional y listo para producción. Puedes probarlo inmediatamente en modo mock y configurar el backend cuando estés listo para enviar correos reales.

**Acceso rápido:** `http://localhost:5173/test-notificaciones`

¡Disfruta de un sistema de notificaciones profesional y moderno! 🚀✨
