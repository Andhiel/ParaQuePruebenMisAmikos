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
  IconButton,
  Tooltip,
  Fab,
} from "@mui/material";
import {
  listarProyectos,
  listarProyectosActivos,
  crearProyecto,
  eliminarProyecto,
} from "../api/proyectosService";
import AppLayout from "../components/layout/AppLayout";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ESTADOS = [
  { value: "ACTIVO", label: "Activo", color: "success" },
  { value: "EN_DESARROLLO", label: "En Desarrollo", color: "warning" },
  { value: "FINALIZADO", label: "Finalizado", color: "info" },
  { value: "SUSPENDIDO", label: "Suspendido", color: "error" }
];

export default function ProyectosPage({ modo }) {
  const [proyectos, setProyectos] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("ACTIVO");

  const cargarProyectos = () => {
    const api = modo === "Listar activos" ? listarProyectosActivos : listarProyectos;
    api()
      .then((res) => setProyectos(res.data || []))
      .catch(() => setProyectos([]));
  };

  useEffect(() => {
    cargarProyectos();
  }, [modo]);

  const handleCrear = async () => {
    try {
      await crearProyecto({ nombre, descripcion, estado });
      cargarProyectos();
      setOpenForm(false);
      setNombre("");
      setDescripcion("");
      setEstado("ACTIVO");
    } catch (e) {
      console.error(e);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarProyecto(id);
      cargarProyectos();
    } catch (e) {
      console.error(e);
    }
  };

  const getEstadoConfig = (estado) => {
    return ESTADOS.find(e => e.value === estado) || ESTADOS[0];
  };

  return (
    <AppLayout title={`Proyectos - ${modo}`}>
      <Grid container spacing={3}>
        {/* Vista de Tarjetas */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Grid container spacing={3}>
              {proyectos.map((proyecto, index) => {
                const estadoConfig = getEstadoConfig(proyecto.estado);
                return (
                  <Grid item xs={12} md={6} lg={4} key={proyecto.id}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          background: "rgba(255,255,255,0.95)",
                          backdropFilter: "blur(12px)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          borderRadius: 3,
                          boxShadow: 6,
                          transition: "all 0.3s",
                          "&:hover": {
                            boxShadow: 8,
                            transform: "translateY(-8px)"
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 600,
                                background: "linear-gradient(90deg, #0d47a1, #1565c0)",
                                backgroundClip: "text",
                                color: "transparent",
                                flex: 1
                              }}
                            >
                              {proyecto.nombre}
                            </Typography>
                            <Chip
                              label={estadoConfig.label}
                              color={estadoConfig.color}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                ml: 1
                              }}
                            />
                          </Box>
                          
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 3,
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              lineHeight: 1.5
                            }}
                          >
                            {proyecto.descripcion || "Sin descripción disponible"}
                          </Typography>
                          
                          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                            <Tooltip title="Ver detalles">
                              <IconButton 
                                size="small" 
                                sx={{
                                  background: "rgba(13, 71, 161, 0.1)",
                                  "&:hover": {
                                    background: "rgba(13, 71, 161, 0.2)",
                                    color: "primary.main"
                                  }
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            {(modo === "Modificar/Eliminar") && (
                              <>
                                <Tooltip title="Editar">
                                  <IconButton 
                                    size="small"
                                    sx={{
                                      background: "rgba(25, 118, 210, 0.1)",
                                      "&:hover": {
                                        background: "rgba(25, 118, 210, 0.2)",
                                        color: "info.main"
                                      }
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                
                                <Tooltip title="Eliminar">
                                  <IconButton 
                                    size="small"
                                    onClick={() => handleEliminar(proyecto.id)}
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
                                </Tooltip>
                              </>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          </motion.div>
        </Grid>
      </Grid>

      {/* Botón flotante para crear */}
      {(modo === "Crear" || modo === "Creación") && (
        <Fab
          component={motion.div}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          color="primary"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "linear-gradient(135deg, #0d47a1, #1565c0)",
            "&:hover": {
              background: "linear-gradient(135deg, #1565c0, #1976d2)"
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            PaperProps={{
              sx: {
                background: "rgba(255,255,255,0.98)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 3
              }
            }}
          >
            <DialogTitle
              sx={{
                background: "linear-gradient(90deg, #0d47a1, #1565c0)",
                color: "white",
                fontWeight: 600
              }}
            >
              Crear Nuevo Proyecto
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <TextField 
                fullWidth 
                label="Nombre del Proyecto" 
                margin="normal" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(13, 71, 161, 0.15)",
                    },
                  }
                }}
              />
              <TextField 
                fullWidth 
                label="Descripción" 
                margin="normal" 
                multiline
                rows={3}
                value={descripcion} 
                onChange={(e) => setDescripcion(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(13, 71, 161, 0.15)",
                    },
                  }
                }}
              />
              <Select 
                fullWidth 
                value={estado} 
                onChange={(e) => setEstado(e.target.value)} 
                sx={{ 
                  mt: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  }
                }}
              >
                {ESTADOS.map((e) => (
                  <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                ))}
              </Select>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button 
                onClick={() => setOpenForm(false)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600
                }}
              >
                Cancelar
              </Button>
              <Button 
                variant="contained" 
                onClick={handleCrear}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(90deg, #0d47a1, #1565c0)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #1565c0, #1976d2)",
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                  }
                }}
              >
                Guardar Proyecto
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
