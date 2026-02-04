import { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Alert, Snackbar, Chip, IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import emailNotifications from '../services/emailNotifications.js';
import notificationService from '../services/notificationService.js';
import LiquidCard from './effects/LiquidCard.jsx';
import MagneticButton from './effects/MagneticButton.jsx';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import SettingsIcon from '@mui/icons-material/Settings';

export default function NotificationTester() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [sentEmails, setSentEmails] = useState([]);
  const [showEmails, setShowEmails] = useState(false);
  const [mockEnabled, setMockEnabled] = useState(false);

  const showNotification = (msg, sev = 'success') => {
    setMessage(msg);
    setSeverity(sev);
  };

  const refreshEmails = () => {
    const emails = notificationService.getSentEmails();
    setSentEmails(emails);
  };

  const toggleMock = () => {
    if (mockEnabled) {
      notificationService.disableMock();
      setMockEnabled(false);
      showNotification('🔧 Modo Mock desactivado', 'info');
    } else {
      notificationService.enableMock();
      setMockEnabled(true);
      showNotification('🔧 Modo Mock activado', 'info');
    }
  };

  const clearEmails = () => {
    notificationService.clearEmails();
    setSentEmails([]);
    showNotification('📧 Emails limpiados', 'info');
  };

  const showEmailsInConsole = () => {
    notificationService.getSentEmails().forEach((email, index) => {
      console.log(`\n${index + 1}. Para: ${email.to}`);
      console.log(`   Asunto: ${email.subject}`);
      console.log(`   Fecha: ${new Date(email.timestamp).toLocaleString()}`);
      console.log(`   Estado: ${email.status}`);
    });
    showNotification('📧 Emails mostrados en consola', 'info');
  };

  const handleTestEmail = async () => {
    if (!email) {
      showNotification('Por favor ingresa un correo electrónico', 'warning');
      return;
    }

    setLoading(true);
    try {
      await emailNotifications.enviarNotificacionPrueba(email);
      showNotification('✅ Notificación de prueba enviada exitosamente', 'success');
    } catch (error) {
      console.error('Error:', error);
      showNotification('❌ Error al enviar notificación de prueba', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTestAusencia = async () => {
    if (!email) {
      showNotification('Por favor ingresa un correo electrónico', 'warning');
      return;
    }

    setLoading(true);
    try {
      await emailNotifications.notificarAusenciaAyudante({
        directorNombre: 'Juan Pérez',
        directorEmail: email,
        ayudanteNombre: 'María García',
        ayudanteEmail: email,
        ayudanteId: 'A001',
        fecha: new Date().toLocaleDateString(),
        proyectoNombre: 'Sistema Web Académico'
      });
      showNotification('✅ Notificación de ausencia enviada', 'success');
    } catch (error) {
      console.error('Error:', error);
      showNotification('❌ Error al enviar notificación de ausencia', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTestAvance = async () => {
    if (!email) {
      showNotification('Por favor ingresa un correo electrónico', 'warning');
      return;
    }

    setLoading(true);
    try {
      await emailNotifications.notificarAvanceSubido({
        jefaturaEmail: email,
        jefaturaNombre: 'Dr. Carlos Rodríguez',
        directorEmail: email,
        directorNombre: 'Ing. Ana López',
        proyectoNombre: 'Sistema Web Académico',
        descripcion: 'Se ha completado el módulo de autenticación y se está trabajando en el dashboard principal.'
      });
      showNotification('✅ Notificación de avance enviado', 'success');
    } catch (error) {
      console.error('Error:', error);
      showNotification('❌ Error al enviar notificación de avance', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTestCredenciales = async () => {
    if (!email) {
      showNotification('Por favor ingresa un correo electrónico', 'warning');
      return;
    }

    setLoading(true);
    try {
      await emailNotifications.notificarCredencialesDirector({
        nombre: 'Roberto Sánchez',
        email: email,
        usuario: 'roberto.sanchez',
        contrasena: 'Temp123456',
        codigo: 'D001'
      });
      showNotification('✅ Credenciales de director enviadas', 'success');
    } catch (error) {
      console.error('Error:', error);
      showNotification('❌ Error al enviar credenciales', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <LiquidCard>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h4" sx={{ 
                  fontWeight: 600,
                  background: "linear-gradient(90deg, #667eea, #764ba2)",
                  backgroundClip: "text",
                  color: "transparent"
                }}>
                  Probador de Notificaciones
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title={mockEnabled ? 'Desactivar Mock' : 'Activar Mock'}>
                  <IconButton 
                    onClick={toggleMock}
                    color={mockEnabled ? 'primary' : 'default'}
                    sx={{ 
                      background: mockEnabled ? 'rgba(102, 126, 234, 0.1)' : 'rgba(0,0,0,0.05)',
                      '&:hover': {
                        background: mockEnabled ? 'rgba(102, 126, 234, 0.2)' : 'rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Ver Emails Enviados">
                  <IconButton 
                    onClick={() => {
                      refreshEmails();
                      setShowEmails(!showEmails);
                    }}
                    color="primary"
                    sx={{ 
                      background: 'rgba(102, 126, 234, 0.1)',
                      '&:hover': {
                        background: 'rgba(102, 126, 234, 0.2)'
                      }
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={mockEnabled ? '🔧 MODO MOCK ACTIVADO' : '🌐 BACKEND REAL'} 
                color={mockEnabled ? 'warning' : 'success'}
                size="small"
              />
              <Chip 
                label={`📧 ${sentEmails.length} emails enviados`} 
                color="info" 
                size="small"
              />
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Prueba el sistema de notificaciones por correo electrónico. Ingresa tu correo y selecciona el tipo de notificación que deseas probar.
            </Typography>

            <TextField
              fullWidth
              label="Correo electrónico de prueba"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
              placeholder="tu-correo@ejemplo.com"
            />

            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
              <MagneticButton
                onClick={handleTestEmail}
                disabled={loading}
                sx={{ width: '100%' }}
              >
                <SendIcon sx={{ mr: 1 }} />
                {loading ? 'Enviando...' : '🧪 Notificación de Prueba'}
              </MagneticButton>

              <MagneticButton
                onClick={handleTestAusencia}
                disabled={loading}
                sx={{ width: '100%' }}
              >
                <SendIcon sx={{ mr: 1 }} />
                {loading ? 'Enviando...' : '🔔 Notificar Ausencia'}
              </MagneticButton>

              <MagneticButton
                onClick={handleTestAvance}
                disabled={loading}
                sx={{ width: '100%' }}
              >
                <SendIcon sx={{ mr: 1 }} />
                {loading ? 'Enviando...' : '📈 Notificar Avance'}
              </MagneticButton>

              <MagneticButton
                onClick={handleTestCredenciales}
                disabled={loading}
                sx={{ width: '100%' }}
              >
                <SendIcon sx={{ mr: 1 }} />
                {loading ? 'Enviando...' : '👋 Enviar Credenciales'}
              </MagneticButton>
            </Box>

            <Box sx={{ mt: 4, p: 2, bgcolor: 'info.50', borderRadius: 2 }}>
              <Typography variant="body2" color="info.dark">
                <strong>Nota:</strong> {mockEnabled 
                  ? 'Usando modo MOCK - los emails se simulan localmente. Revisa la consola para ver los detalles.'
                  : 'Las notificaciones se enviarán al backend configurado. Asegúrate de que el servicio de correos esté funcionando.'}
              </Typography>
            </Box>

            {sentEmails.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" color="primary.main">
                    📧 Emails Enviados ({sentEmails.length})
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Mostrar en Consola">
                      <IconButton size="small" onClick={showEmailsInConsole}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Limpiar Todos">
                      <IconButton size="small" onClick={clearEmails}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                
                <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                  {sentEmails.map((email, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card sx={{ mb: 1, p: 2, background: 'rgba(102, 126, 234, 0.05)' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Para: {email.to}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Asunto: {email.subject}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(email.timestamp).toLocaleString()}
                        </Typography>
                      </Card>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </LiquidCard>
      </motion.div>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setMessage('')} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
