import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  listarAusencias,
  ausenciasPendientes,
  notificarAusencia,
  aprobarAusencia,
  rechazarAusencia,
} from "../api/ausenciasService";
import AppLayout from "../components/layout/AppLayout";
import LiquidCard from "../components/effects/LiquidCard";
import MagneticButton from "../components/effects/MagneticButton";
import GlitchText from "../components/effects/GlitchText";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DescriptionIcon from "@mui/icons-material/Description";
import SendIcon from "@mui/icons-material/Send";

export default function AusenciasPage({ modo }) {
  const [ausencias, setAusencias] = useState([]);
  const [personalId, setPersonalId] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [motivo, setMotivo] = useState("");
  const [rechazoMotivo, setRechazoMotivo] = useState("");

  const cargar = () => {
    const api = modo === "Pendientes" || modo === "Aprobar/Rechazar" ? ausenciasPendientes : listarAusencias;
    api()
      .then((res) => setAusencias(res.data || []))
      .catch(() => setAusencias([]));
  };

  useEffect(() => {
    cargar();
  }, [modo]);

  const handleNotificar = async () => {
    if (!personalId) return;
    try {
      await notificarAusencia(personalId, { fechaInicio, fechaFin, motivo });
      cargar();
      setPersonalId("");
      setFechaInicio("");
      setFechaFin("");
      setMotivo("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleAprobar = async (ausenciaId, aprobadorId) => {
    try {
      await aprobarAusencia(ausenciaId, aprobadorId);
      cargar();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRechazar = async (ausenciaId, aprobadorId) => {
    try {
      await rechazarAusencia(ausenciaId, aprobadorId, rechazoMotivo);
      cargar();
      setRechazoMotivo("");
    } catch (e) {
      console.error(e);
    }
  };

  const getEstadoConfig = (estado) => {
    switch (estado) {
      case 'APROBADA':
        return { color: 'success', label: 'Aprobada', icon: CheckCircleIcon };
      case 'RECHAZADA':
        return { color: 'error', label: 'Rechazada', icon: CancelIcon };
      case 'PENDIENTE':
        return { color: 'warning', label: 'Pendiente', icon: EventBusyIcon };
      default:
        return { color: 'info', label: estado, icon: EventBusyIcon };
    }
  };

  const [openRechazoDialog, setOpenRechazoDialog] = useState(false);
  const [selectedAusencia, setSelectedAusencia] = useState(null);

  const handleRechazoClick = (ausencia) => {
    setSelectedAusencia(ausencia);
    setOpenRechazoDialog(true);
  };

  const handleRechazoConfirm = () => {
    if (selectedAusencia) {
      handleRechazar(selectedAusencia.id, 1);
      setOpenRechazoDialog(false);
      setSelectedAusencia(null);
    }
  };

  return (
    <AppLayout title={`Ausencias - ${modo}`}>
      <Grid container spacing={3}>
        {/* Tarjeta de notificación */}
        {(modo === "Listar todas" || modo === "Notificar ausencia" || modo === "Registrar ayudantes") && (
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <LiquidCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        background: "linear-gradient(135deg, #f093fb, #f5576c)",
                        mr: 2
                      }}
                    >
                      <EventBusyIcon />
                    </Avatar>
                    <GlitchText variant="h6">
                      Notificar Ausencia
                    </GlitchText>
                  </Box>
                  
                  <TextField 
                    label="ID Personal" 
                    fullWidth 
                    margin="normal" 
                    value={personalId} 
                    onChange={(e) => setPersonalId(e.target.value)}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        transition: "all 0.3s",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(240, 147, 251, 0.15)",
                        },
                      }
                    }}
                  />
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                      <TextField 
                        label="Fecha inicio" 
                        type="date" 
                        fullWidth 
                        margin="normal" 
                        InputLabelProps={{ shrink: true }} 
                        value={fechaInicio} 
                        onChange={(e) => setFechaInicio(e.target.value)}
                        InputProps={{
                          startAdornment: <DateRangeIcon sx={{ mr: 1, color: "text.secondary" }} />,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField 
                        label="Fecha fin" 
                        type="date" 
                        fullWidth 
                        margin="normal" 
                        InputLabelProps={{ shrink: true }} 
                        value={fechaFin} 
                        onChange={(e) => setFechaFin(e.target.value)}
                        InputProps={{
                          startAdornment: <DateRangeIcon sx={{ mr: 1, color: "text.secondary" }} />,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                  
                  <TextField 
                    label="Motivo" 
                    fullWidth 
                    margin="normal" 
                    multiline
                    rows={3}
                    value={motivo} 
                    onChange={(e) => setMotivo(e.target.value)}
                    InputProps={{
                      startAdornment: <DescriptionIcon sx={{ mr: 1, mt: 2, color: "text.secondary" }} />,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        transition: "all 0.3s",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(240, 147, 251, 0.15)",
                        },
                      }
                    }}
                  />
                  
                  <MagneticButton onClick={handleNotificar} sx={{ mt: 2, width: "100%" }}>
                    <SendIcon sx={{ mr: 1 }} />
                    Enviar Notificación
                  </MagneticButton>
                </CardContent>
              </LiquidCard>
            </motion.div>
          </Grid>
        )}

        {/* Lista de ausencias */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <LiquidCard>
              <Box sx={{ p: 3, pb: 0 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    background: "linear-gradient(90deg, #f093fb, #f5576c)",
                    backgroundClip: "text",
                    color: "transparent",
                    mb: 2
                  }}
                >
                  {esPendientes ? 'Ausencias Pendientes' : 'Historial de Ausencias'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {ausencias.length} {ausencias.length === 1 ? 'ausencia encontrada' : 'ausencias encontradas'}
                </Typography>
              </Box>
              
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: "linear-gradient(90deg, #f093fb, #f5576c)" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Personal</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Periodo</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Estado</TableCell>
                      {esPendientes && (
                        <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Acciones</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ausencias.map((ausencia, index) => {
                      const estadoConfig = getEstadoConfig(ausencia.estado);
                      const EstadoIcon = estadoConfig.icon;
                      return (
                        <motion.tr
                          key={ausencia.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          component={TableRow}
                          sx={{
                            "&:hover": {
                              bgcolor: "rgba(240, 147, 251, 0.04)"
                            }
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.100" }}>
                                <EventBusyIcon sx={{ fontSize: 16, color: "primary.main" }} />
                              </Avatar>
                              <Typography variant="body2" fontWeight={500}>
                                {ausencia.id}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                              <Typography variant="body2">
                                {ausencia.personalId ?? ausencia.personal?.id}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {new Date(ausencia.fechaInicio).toLocaleDateString()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                hasta {new Date(ausencia.fechaFin).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={<EstadoIcon fontSize="small" />}
                              label={estadoConfig.label}
                              color={estadoConfig.color}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          {esPendientes && (
                            <TableCell align="center">
                              <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Tooltip title="Aprobar ausencia">
                                    <IconButton 
                                      size="small"
                                      onClick={() => handleAprobar(ausencia.id, 1)}
                                      sx={{
                                        background: "rgba(76, 175, 80, 0.1)",
                                        "&:hover": {
                                          background: "rgba(76, 175, 80, 0.2)",
                                          color: "success.main",
                                          transform: "scale(1.1)"
                                        }
                                      }}
                                    >
                                      <CheckCircleIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </motion.div>
                                
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Tooltip title="Rechazar ausencia">
                                    <IconButton 
                                      size="small"
                                      onClick={() => handleRechazoClick(ausencia)}
                                      sx={{
                                        background: "rgba(244, 67, 54, 0.1)",
                                        "&:hover": {
                                          background: "rgba(244, 67, 54, 0.2)",
                                          color: "error.main"
                                        }
                                      }}
                                    >
                                      <CancelIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </motion.div>
                              </Box>
                            </TableCell>
                          )}
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
              
              {ausencias.length === 0 && (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <EventBusyIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                  <Typography color="text.secondary">
                    No se encontraron ausencias
                  </Typography>
                </Box>
              )}
            </LiquidCard>
          </motion.div>
        </Grid>
      </Grid>

      {/* Dialog de rechazo */}
      <AnimatePresence>
        {openRechazoDialog && (
          <Dialog
            open={openRechazoDialog}
            onClose={() => setOpenRechazoDialog(false)}
            maxWidth="sm"
            fullWidth
            component={motion.div}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            PaperProps={{
              sx: {
                background: "rgba(255,255,255,0.98)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 4
              }
            }}
          >
            <DialogTitle
              sx={{
                background: "linear-gradient(135deg, #f5576c, #f093fb)",
                color: "white",
                fontWeight: 600
              }}
            >
              Rechazar Ausencia
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <TextField
                fullWidth
                label="Motivo del rechazo"
                multiline
                rows={3}
                value={rechazoMotivo}
                onChange={(e) => setRechazoMotivo(e.target.value)}
                placeholder="Ingresa el motivo por el cual se rechaza esta ausencia..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  }
                }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button 
                onClick={() => setOpenRechazoDialog(false)}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 600
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleRechazoConfirm}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #f5576c, #f093fb)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #f093fb, #f5576c)",
                  }
                }}
              >
                Confirmar Rechazo
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
