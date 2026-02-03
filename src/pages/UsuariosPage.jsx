import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Fab,
  Badge,
} from "@mui/material";
import {
  listarUsuarios,
  registro,
  eliminarUsuario,
} from "../api/usuariosService";
import AppLayout from "../components/layout/AppLayout";
import LiquidCard from "../components/effects/LiquidCard";
import MagneticButton from "../components/effects/MagneticButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BadgeIcon from "@mui/icons-material/Badge";

const ROLES = [
  { value: "ADMINISTRADOR", label: "Administrador", color: "error", icon: AdminPanelSettingsIcon },
  { value: "JEFATURA", label: "Jefatura", color: "warning", icon: AdminPanelSettingsIcon },
  { value: "DIRECTOR_DE_PROYECTO", label: "Director de Proyecto", color: "info", icon: AdminPanelSettingsIcon },
  { value: "AYUDANTE", label: "Ayudante", color: "success", icon: PersonIcon }
];

export default function UsuariosPage({ modo }) {
  const [usuarios, setUsuarios] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("");
  const [codigo, setCodigo] = useState("");

  const cargarUsuarios = () => {
    listarUsuarios()
      .then((res) => setUsuarios(res.data || []))
      .catch(() => setUsuarios([]));
  };

  useEffect(() => {
    if (modo === "Listar" || modo === "Modificar/Eliminar" || modo === "Registrar") {
      cargarUsuarios();
    }
  }, [modo]);

  const handleRegistrar = async () => {
    try {
      await registro({ nombre, correo, contrasena, rol, codigo });
      cargarUsuarios();
      setOpenForm(false);
      setNombre("");
      setCorreo("");
      setContrasena("");
      setRol("");
      setCodigo("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarUsuario(id);
      cargarUsuarios();
    } catch (e) {
      console.error(e);
    }
  };

  const getRolConfig = (rol) => {
    return ROLES.find(r => r.value === rol) || ROLES[0];
  };

  const getRoleIcon = (rol) => {
    const config = getRolConfig(rol);
    const IconComponent = config.icon;
    return <IconComponent fontSize="small" />;
  };

  return (
    <AppLayout title={`Usuarios - ${modo}`}>
      <Grid container spacing={3}>
        {/* Vista de Tarjetas de Usuarios */}
        {(modo === "Listar" || modo === "Modificar/Eliminar" || modo === "Buscar por rol") && (
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Grid container spacing={3}>
                {usuarios.map((usuario, index) => {
                  const rolConfig = getRolConfig(usuario.rol);
                  return (
                    <Grid item xs={12} md={6} lg={4} key={usuario.id}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ 
                          y: -10, 
                          rotateY: 5,
                          transition: { duration: 0.3 }
                        }}
                      >
                        <LiquidCard>
                          <CardContent sx={{ p: 3 }}>
                            {/* Avatar y nombre */}
                            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                              <motion.div
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                              >
                                <Avatar
                                  sx={{
                                    width: 60,
                                    height: 60,
                                    background: `linear-gradient(135deg, 
                                      ${rolConfig.color === 'error' ? '#f44336' : 
                                       rolConfig.color === 'warning' ? '#ff9800' :
                                       rolConfig.color === 'info' ? '#2196f3' : '#4caf50'} 0%, 
                                      ${rolConfig.color === 'error' ? '#e91e63' :
                                       rolConfig.color === 'warning' ? '#ff5722' :
                                       rolConfig.color === 'info' ? '#03a9f4' : '#8bc34a'} 100%)`,
                                    boxShadow: `0 4px 15px ${rolConfig.color === 'error' ? 'rgba(244, 67, 54, 0.4)' :
                                                   rolConfig.color === 'warning' ? 'rgba(255, 152, 0, 0.4)' :
                                                   rolConfig.color === 'info' ? 'rgba(33, 150, 243, 0.4)' :
                                                   'rgba(76, 175, 80, 0.4)'}`,
                                    mr: 2
                                  }}
                                >
                                  {getRoleIcon(usuario.rol)}
                                </Avatar>
                              </motion.div>
                              <Box sx={{ flex: 1 }}>
                                <Typography 
                                  variant="h6" 
                                  sx={{ 
                                    fontWeight: 600,
                                    background: "linear-gradient(90deg, #667eea, #764ba2)",
                                    backgroundClip: "text",
                                    color: "transparent",
                                    mb: 0.5
                                  }}
                                >
                                  {usuario.nombre}
                                </Typography>
                                <Chip
                                  icon={getRoleIcon(usuario.rol)}
                                  label={rolConfig.label}
                                  color={rolConfig.color}
                                  size="small"
                                  sx={{ fontWeight: 600 }}
                                />
                              </Box>
                            </Box>
                            
                            {/* Información del usuario */}
                            <Box sx={{ mb: 3 }}>
                              <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                <EmailIcon sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {usuario.correo}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <BadgeIcon sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {usuario.codigo}
                                </Typography>
                              </Box>
                            </Box>
                            
                            {/* Acciones */}
                            {(modo === "Modificar/Eliminar") && (
                              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                                <Tooltip title="Editar usuario">
                                  <IconButton 
                                    size="small"
                                    sx={{
                                      background: "rgba(25, 118, 210, 0.1)",
                                      "&:hover": {
                                        background: "rgba(25, 118, 210, 0.2)",
                                        color: "info.main",
                                        transform: "scale(1.1)"
                                      }
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                
                                <Tooltip title="Eliminar usuario">
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <IconButton 
                                      size="small"
                                      onClick={() => handleEliminar(usuario.id)}
                                      sx={{
                                        background: "rgba(211, 47, 47, 0.1)",
                                        "&:hover": {
                                          background: "rgba(211, 47, 47, 0.2)",
                                          color: "error.main"
                                        }
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </motion.div>
                                </Tooltip>
                              </Box>
                            )}
                          </CardContent>
                        </LiquidCard>
                      </motion.div>
                    </Grid>
                  );
                })}
              </Grid>
            </motion.div>
          </Grid>
        )}
      </Grid>

      {/* Botón flotante para registrar */}
      {modo === "Registrar" && (
        <Fab
          component={motion.div}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          color="primary"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            "&:hover": {
              background: "linear-gradient(135deg, #764ba2, #f093fb)"
            }
          }}
          onClick={() => setOpenForm(true)}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Dialog mejorado */}
      <AnimatePresence>
        {openForm && (
          <Dialog
            open={openForm}
            onClose={() => setOpenForm(false)}
            maxWidth="sm"
            fullWidth
            component={motion.div}
            initial={{ opacity: 0, scale: 0.8, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 15 }}
            transition={{ duration: 0.4 }}
            PaperProps={{
              sx: {
                background: "rgba(255,255,255,0.98)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 4,
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
              }
            }}
          >
            <DialogTitle
              sx={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white",
                fontWeight: 600,
                fontSize: "1.5rem"
              }}
            >
              Registrar Nuevo Usuario
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <TextField 
                fullWidth 
                label="Nombre Completo" 
                margin="normal" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                    },
                  }
                }}
              />
              <TextField 
                fullWidth 
                label="Correo Electrónico" 
                type="email" 
                margin="normal" 
                value={correo} 
                onChange={(e) => setCorreo(e.target.value)}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                    },
                  }
                }}
              />
              <TextField 
                fullWidth 
                label="Contraseña" 
                type="password" 
                margin="normal" 
                value={contrasena} 
                onChange={(e) => setContrasena(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                    },
                  }
                }}
              />
              <TextField 
                fullWidth 
                label="Código de Usuario" 
                margin="normal" 
                value={codigo} 
                onChange={(e) => setCodigo(e.target.value)}
                InputProps={{
                  startAdornment: <BadgeIcon sx={{ mr: 1, color: "text.secondary" }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                    },
                  }
                }}
              />
              <Select 
                fullWidth 
                value={rol} 
                onChange={(e) => setRol(e.target.value)} 
                displayEmpty 
                sx={{ 
                  mt: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  }
                }}
              >
                <MenuItem value="" disabled>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AdminPanelSettingsIcon fontSize="small" />
                    Selecciona un rol
                  </Box>
                </MenuItem>
                {ROLES.map((r) => {
                  const IconComponent = r.icon;
                  return (
                    <MenuItem key={r.value} value={r.value}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconComponent fontSize="small" />
                        {r.label}
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button 
                onClick={() => setOpenForm(false)}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 600
                }}
              >
                Cancelar
              </Button>
              <MagneticButton onClick={handleRegistrar}>
                Guardar Usuario
              </MagneticButton>
            </DialogActions>
          </Dialog>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
