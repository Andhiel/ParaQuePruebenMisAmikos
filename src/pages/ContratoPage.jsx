import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
} from "@mui/material";
import {
  listarContratos,
  registrarContrato,
  descargarContratoPDF,
  eliminarContrato,
} from "../api/contratosService";
import AppLayout from "../components/layout/AppLayout";
import LiquidCard from "../components/effects/LiquidCard";
import MagneticButton from "../components/effects/MagneticButton";
import GlitchText from "../components/effects/GlitchText";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function ContratoPage({ modo }) {
  const [contratos, setContratos] = useState([]);
  const [personalId, setPersonalId] = useState("");
  const [numeroContrato, setNumeroContrato] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [archivo, setArchivo] = useState(null);

  const cargar = () => {
    listarContratos()
      .then((res) => setContratos(res.data || []))
      .catch(() => setContratos([]));
  };

  useEffect(() => {
    cargar();
  }, [modo]);

  const handleRegistrar = async () => {
    const formData = new FormData();
    formData.append("personalId", personalId);
    formData.append("numeroContrato", numeroContrato);
    formData.append("fechaInicio", fechaInicio);
    formData.append("fechaFin", fechaFin);
    if (archivo) formData.append("archivo", archivo);
    try {
      await registrarContrato(formData);
      cargar();
      setPersonalId("");
      setNumeroContrato("");
      setFechaInicio("");
      setFechaFin("");
      setArchivo(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDescargar = async (id) => {
    try {
      const res = await descargarContratoPDF(id);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contrato-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarContrato(id);
      cargar();
    } catch (e) {
      console.error(e);
    }
  };

  const getEstadoContrato = (fechaFin) => {
    const hoy = new Date();
    const fin = new Date(fechaFin);
    const diffTime = fin - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { color: 'error', label: 'Vencido', icon: '⚠️' };
    } else if (diffDays <= 30) {
      return { color: 'warning', label: 'Por vencer', icon: '⏰' };
    } else {
      return { color: 'success', label: 'Vigente', icon: '✅' };
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <AppLayout title={`Contratos - ${modo}`}>
      <Grid container spacing={3}>
        {/* Tarjeta de registro */}
        {(modo === "Registrar" || modo === "Subir PDF") && (
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <LiquidCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                          mr: 2
                        }}
                      >
                        <DescriptionIcon />
                      </Avatar>
                    </motion.div>
                    <GlitchText variant="h6">
                      Registrar Contrato
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
                          boxShadow: "0 4px 12px rgba(79, 172, 254, 0.15)",
                        },
                      }
                    }}
                  />
                  
                  <TextField 
                    label="Número de Contrato" 
                    fullWidth 
                    margin="normal" 
                    value={numeroContrato} 
                    onChange={(e) => setNumeroContrato(e.target.value)}
                    InputProps={{
                      startAdornment: <DescriptionIcon sx={{ mr: 1, color: "text.secondary" }} />,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        transition: "all 0.3s",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(79, 172, 254, 0.15)",
                        },
                      }
                    }}
                  />
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                      <TextField 
                        label="Fecha Inicio" 
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
                        label="Fecha Fin" 
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
                  
                  <Box sx={{ mt: 2 }}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{
                          borderRadius: 3,
                          border: "2px dashed",
                          borderColor: "primary.main",
                          py: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          background: "rgba(79, 172, 254, 0.05)",
                          "&:hover": {
                            background: "rgba(79, 172, 254, 0.1)",
                            borderColor: "primary.dark",
                          }
                        }}
                      >
                        <UploadFileIcon sx={{ mr: 1 }} />
                        {archivo ? archivo.name : "Seleccionar PDF del Contrato"}
                        <input 
                          type="file" 
                          accept="application/pdf" 
                          hidden 
                          onChange={(e) => setArchivo(e.target.files?.[0])} 
                        />
                      </Button>
                    </motion.div>
                  </Box>
                  
                  <MagneticButton onClick={handleRegistrar} sx={{ mt: 2, width: "100%" }}>
                    <DescriptionIcon sx={{ mr: 1 }} />
                    Guardar Contrato
                  </MagneticButton>
                </CardContent>
              </LiquidCard>
            </motion.div>
          </Grid>
        )}

        {/* Lista de contratos */}
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
                    background: "linear-gradient(90deg, #4facfe, #00f2fe)",
                    backgroundClip: "text",
                    color: "transparent",
                    mb: 2
                  }}
                >
                  Gestión de Contratos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {contratos.length} {contratos.length === 1 ? 'contrato encontrado' : 'contratos encontrados'}
                </Typography>
              </Box>
              
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: "linear-gradient(90deg, #4facfe, #00f2fe)" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Número</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Personal</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Periodo</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Estado</TableCell>
                      {(modo === "Descargar PDF" || modo === "Eliminar") && (
                        <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Acciones</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contratos.map((contrato, index) => {
                      const estadoConfig = getEstadoContrato(contrato.fechaFin);
                      return (
                        <motion.tr
                          key={contrato.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          component={TableRow}
                          sx={{
                            "&:hover": {
                              bgcolor: "rgba(79, 172, 254, 0.04)"
                            }
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.100" }}>
                                <DescriptionIcon sx={{ fontSize: 16, color: "primary.main" }} />
                              </Avatar>
                              <Typography variant="body2" fontWeight={500}>
                                {contrato.id}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {contrato.numeroContrato}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                              <Typography variant="body2">
                                {contrato.personalId}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {formatFecha(contrato.fechaInicio)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                hasta {formatFecha(contrato.fechaFin)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${estadoConfig.icon} ${estadoConfig.label}`}
                              color={estadoConfig.color}
                              size="small"
                              sx={{ 
                                fontWeight: 600,
                                fontSize: "0.75rem"
                              }}
                            />
                          </TableCell>
                          {(modo === "Descargar PDF" || modo === "Eliminar") && (
                            <TableCell align="center">
                              <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                {modo === "Descargar PDF" && (
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Tooltip title="Descargar PDF">
                                      <IconButton 
                                        size="small"
                                        onClick={() => handleDescargar(contrato.id)}
                                        sx={{
                                          background: "rgba(79, 172, 254, 0.1)",
                                          "&:hover": {
                                            background: "rgba(79, 172, 254, 0.2)",
                                            color: "primary.main",
                                            transform: "scale(1.1)"
                                          }
                                        }}
                                      >
                                        <PictureAsPdfIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </motion.div>
                                )}
                                
                                {modo === "Eliminar" && (
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Tooltip title="Eliminar contrato">
                                      <IconButton 
                                        size="small"
                                        onClick={() => handleEliminar(contrato.id)}
                                        sx={{
                                          background: "rgba(244, 67, 54, 0.1)",
                                          "&:hover": {
                                            background: "rgba(244, 67, 54, 0.2)",
                                            color: "error.main"
                                          }
                                        }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </motion.div>
                                )}
                              </Box>
                            </TableCell>
                          )}
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
              
              {contratos.length === 0 && (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <DescriptionIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                  <Typography color="text.secondary">
                    No se encontraron contratos
                  </Typography>
                </Box>
              )}
            </LiquidCard>
          </motion.div>
        </Grid>
      </Grid>
    </AppLayout>
  );
}
