# 🚀 Configuración del Sistema de Notificaciones por Correo

## 📋 Requisitos del Backend

### 1. Dependencias Necesarias
```bash
npm install nodemailer express cors dotenv
```

### 2. Variables de Entorno
Crear archivo `.env` en el backend:
```env
# Configuración de Correo
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicacion
EMAIL_FROM=Sistema Asistencia <tu-correo@gmail.com>

# Configuración del Servidor
PORT=8080
CORS_ORIGIN=http://localhost:5173
```

### 3. Estructura del Backend
```
backend/
├── src/
│   ├── controllers/
│   │   └── emailController.js
│   ├── routes/
│   │   └── notifications.js
│   ├── services/
│   │   └── emailService.js
│   └── utils/
│       └── emailTemplates.js
├── .env
└── server.js
```

## 🔧 Implementación

### 1. Servicio de Email (`src/services/emailService.js`)
```javascript
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(to, subject, html) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error enviando email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
```

### 2. Controlador de Notificaciones (`src/controllers/emailController.js`)
```javascript
const emailService = require('../services/emailService');

exports.sendEmailNotification = async (req, res) => {
  try {
    const { to, subject, html, cc } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: to, subject, html'
      });
    }

    const mailOptions = {
      to,
      subject,
      html
    };

    if (cc) {
      mailOptions.cc = cc;
    }

    await emailService.sendEmail(mailOptions.to, mailOptions.subject, mailOptions.html);

    res.status(200).json({
      success: true,
      message: 'Notificación enviada exitosamente'
    });
  } catch (error) {
    console.error('Error en controlador de email:', error);
    res.status(500).json({
      error: 'Error al enviar notificación',
      details: error.message
    });
  }
};
```

### 3. Rutas de Notificaciones (`src/routes/notifications.js`)
```javascript
const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/send-email', emailController.sendEmailNotification);

module.exports = router;
```

### 4. Servidor Principal (`server.js`)
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const notificationRoutes = require('./src/routes/notifications');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/notifications', notificationRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

## 🔄 Verificación Diaria de Ausencias

### 1. Servicio de Verificación (`src/services/ausenciaService.js`)
```javascript
const db = require('../config/database');

class AusenciaService {
  async verificarAusenciasDiarias() {
    try {
      // Obtener fecha de ayer
      const ayer = new Date();
      ayer.setDate(ayer.getDate() - 1);
      const fechaAyer = ayer.toISOString().split('T')[0];

      // Obtener todos los ayudantes
      const ayudantes = await db.query(`
        SELECT p.id, p.nombre, p.correo, pr.nombre as proyecto_nombre, 
               d.nombre as director_nombre, d.correo as director_correo
        FROM personal p
        JOIN proyectos pr ON p.id = pr.director_id
        JOIN usuarios d ON pr.director_id = d.id
        WHERE p.rol = 'AYUDANTE'
      `);

      const ausencias = [];

      for (const ayudante of ayudantes) {
        // Verificar si registró asistencia ayer
        const asistencia = await db.query(`
          SELECT * FROM asistencias 
          WHERE personal_id = ? AND DATE(fecha_hora) = ?
        `, [ayudante.id, fechaAyer]);

        if (asistencia.length === 0) {
          ausencias.push({
            ayudanteId: ayudante.id,
            ayudanteNombre: ayudante.nombre,
            ayudanteEmail: ayudante.correo,
            directorNombre: ayudante.director_nombre,
            directorEmail: ayudante.director_correo,
            fecha: fechaAyer,
            proyectoNombre: ayudante.proyecto_nombre
          });
        }
      }

      return ausencias;
    } catch (error) {
      console.error('Error verificando ausencias:', error);
      throw error;
    }
  }
}

module.exports = new AusenciaService();
```

### 2. Endpoint para Verificación (`src/routes/notifications.js`)
```javascript
const ausenciaService = require('../services/ausenciaService');
const emailNotifications = require('../services/emailNotifications');

// Agregar esta ruta
router.post('/verificar-diarias', async (req, res) => {
  try {
    const ausencias = await ausenciaService.verificarAusenciasDiarias();
    
    // Enviar notificaciones por cada ausencia
    for (const ausencia of ausencias) {
      await emailNotifications.notificarAusenciaAyudante(ausencia);
    }

    res.json({
      success: true,
      ausenciasDetectadas: ausencias.length,
      ausencias
    });
  } catch (error) {
    console.error('Error en verificación diaria:', error);
    res.status(500).json({
      error: 'Error en verificación diaria',
      details: error.message
    });
  }
});
```

## ⏰ Programación de Tareas (Cron Job)

### 1. Usando node-cron
```bash
npm install node-cron
```

### 2. Programador (`src/scheduler/cronScheduler.js`)
```javascript
const cron = require('node-cron');
const ausenciaService = require('../services/ausenciaService');
const emailNotifications = require('../services/emailNotifications');

class CronScheduler {
  start() {
    // Ejecutar todos los días a las 8:00 AM
    cron.schedule('0 8 * * *', async () => {
      console.log('Iniciando verificación diaria de ausencias...');
      
      try {
        const ausencias = await ausenciaService.verificarAusenciasDiarias();
        
        for (const ausencia of ausencias) {
          await emailNotifications.notificarAusenciaAyudante(ausencia);
        }
        
        console.log(`Se procesaron ${ausencias.length} ausencias`);
      } catch (error) {
        console.error('Error en verificación diaria:', error);
      }
    });

    console.log('Programador de tareas iniciado');
  }
}

module.exports = new CronScheduler();
```

### 3. Iniciar Programador en `server.js`
```javascript
// Agregar después de las rutas
const cronScheduler = require('./src/scheduler/cronScheduler');
cronScheduler.start();
```

## 🧪 Pruebas

### 1. Endpoint de Prueba
```javascript
// Agregar en src/routes/notifications.js
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    await emailService.sendEmail(
      email,
      '🧪 Correo de Prueba',
      '<h1>Este es un correo de prueba</h1><p>El sistema está funcionando correctamente.</p>'
    );

    res.json({ success: true, message: 'Correo de prueba enviado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 2. Probar con curl
```bash
curl -X POST http://localhost:8080/api/notifications/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "tu-correo@ejemplo.com"}'
```

## 🔐 Configuración de Gmail

### 1. Habilitar 2FA
1. Ve a la configuración de tu cuenta Google
2. Activa la verificación en dos pasos

### 2. Contraseña de Aplicación
1. Ve a: https://myaccount.google.com/apppasswords
2. Selecciona "Otra (nombre personalizado)"
3. Escribe "Sistema Asistencia"
4. Copia la contraseña generada (16 caracteres)

### 3. Usar en .env
```env
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASS=la-contraseña-de-16-caracteres-generada
```

## 📱 Alternativas de Email

### 1. SendGrid
```bash
npm install @sendgrid/mail
```

### 2. Mailgun
```bash
npm install mailgun-js
```

### 3. AWS SES
```bash
npm install aws-sdk
```

## 🚀 Despliegue

### 1. Variables de Entorno en Producción
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-correo@dominio.com
EMAIL_PASS=contraseña-segura
EMAIL_FROM=noreply@dominio.com
CORS_ORIGIN=https://tu-dominio.com
```

### 2. Consideraciones de Seguridad
- Nunca exponer credenciales en el código
- Usar variables de entorno
- Configurar CORS correctamente
- Validar todos los inputs
- Implementar rate limiting

## 🔄 Flujo Completo

1. **Registro de Usuario** → Envío de credenciales
2. **Subida de Avance** → Notificación a jefatura + confirmación
3. **Aprobación/Rechazo** → Notificación al director
4. **Verificación Diaria** → Detección de ausencias
5. **Notificaciones Automáticas** → Correos personalizados

¡Listo! Tu sistema de notificaciones está completamente configurado. 🎉
