import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  obtenerRegistrosAsistencia,
  obtenerRegistrosPorFecha,
  registrarAsistencia,
} from "../api/biometriaService";
import AppLayout from "../components/layout/AppLayout";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

export default function AsistenciaPage({ modo }) {
  const [registros, setRegistros] = useState([]);
  const [personalId, setPersonalId] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [tipoRegistro, setTipoRegistro] = useState("ENTRADA");

  const cargarRegistros = () => {
    if (!personalId) return;
    const api = fecha
      ? () => obtenerRegistrosPorFecha(personalId, fecha)
      : () => obtenerRegistrosAsistencia(personalId);
    api()
      .then((res) => setRegistros(res.data || []))
      .catch(() => setRegistros([]));
  };

  useEffect(() => {
    if (personalId) cargarRegistros();
    else setRegistros([]);
  }, [personalId, fecha]);

  const handleRegistrar = async () => {
    if (!personalId) return;
    try {
      await registrarAsistencia(personalId, tipoRegistro);
      cargarRegistros();
    } catch (e) {
      console.error(e);
    }
  };

  const getTipoIcon = (tipo) => {
    return tipo === "ENTRADA" ? <LoginIcon /> : <LogoutIcon />;
  };

  const getTipoColor = (tipo) => {
    return tipo === "ENTRADA" ? "success" : "warning";
  };

  const getModoIcon = (modo) => {
    if (modo === "QR") return <QrCodeIcon />;
    if (modo === "Laboratorio") return <FingerprintIcon />;
    return <AccessTimeIcon />;
  };

  return (
    <AppLayout title={`Asistencia - ${modo}`}>
      <Grid container spacing={3}>
        {/* Tarjeta de registro */}
        {(modo === "Registrar biométrica" || modo === "Laboratorio" || modo === "QR") && (
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card
                sx={{
                  height: "100%",
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 3,
                  boxShadow: 6,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        background: "linear-gradient(135deg, #0d47a1, #1565c0)",
                        mr: 2
                      }}
                    >
                      {getModoIcon(modo)}
                    </Avatar>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        background: "linear-gradient(90deg, #0d47a1, #1565c0)",
                        backgroundClip: "text",
                        color: "transparent"
                      }}
                    >
                      Registrar Asistencia
                    </Typography>
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
                    margin="normal" 
                    value={tipoRegistro} 
                    onChange={(e) => setTipoRegistro(e.target.value)}
                    sx={{ 
                      mt: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      }
                    }}
                  >
                    <MenuItem value="ENTRADA">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LoginIcon fontSize="small" />
                        Entrada
                      </Box>
                    </MenuItem>
                    <MenuItem value="SALIDA">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LogoutIcon fontSize="small" />
                        Salida
                      </Box>
                    </MenuItem>
                  </Select>
                  
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{ 
                      mt: 3,
                      py: 1.5,
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
                    onClick={handleRegistrar}
                    startIcon={getModoIcon(modo)}
                  >
                    Registrar {tipoRegistro.toLowerCase()}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        )}

        {/* Tarjeta de filtros */}
        {(modo === "Visualizar registros" || modo === "Revisar") && (
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card
                sx={{
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 3,
                  boxShadow: 6,
                  mb: 3
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 2,
                      background: "linear-gradient(90deg, #0d47a1, #1565c0)",
                      backgroundClip: "text",
                      color: "transparent"
                    }}
                  >
                    Filtros de Búsqueda
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <TextField 
                        label="ID Personal" 
                        fullWidth
                        value={personalId} 
                        onChange={(e) => setPersonalId(e.target.value)}
                        InputProps={{
                          startAdornment: <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField 
                        label="Fecha" 
                        type="date" 
                        fullWidth
                        InputLabelProps={{ shrink: true }} 
                        value={fecha} 
                        onChange={(e) => setFecha(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          height: "56px",
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          borderColor: "primary.main",
                          "&:hover": {
                            borderColor: "primary.dark",
                            bgcolor: "primary.50"
                          }
                        }}
                        onClick={cargarRegistros}
                      >
                        Buscar Registros
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        )}

        {/* Tabla de registros */}
        {(modo === "Visualizar registros" || modo === "Revisar") && (
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                sx={{
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 3,
                  boxShadow: 6,
                  overflow: "hidden"
                }}
              >
                <Box sx={{ p: 3, pb: 0 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      background: "linear-gradient(90deg, #0d47a1, #1565c0)",
                      backgroundClip: "text",
                      color: "transparent"
                    }}
                  >
                    Registros de Asistencia
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {registros.length} {registros.length === 1 ? 'registro encontrado' : 'registros encontrados'}
                  </Typography>
                </Box>
                
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: "linear-gradient(90deg, #0d47a1, #1565c0)" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Fecha/Hora</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tipo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {registros.map((registro, index) => (
                      <motion.tr
                        key={registro.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        component={TableRow}
                        sx={{
                          "&:hover": {
                            bgcolor: "rgba(13, 71, 161, 0.04)"
                          }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.100" }}>
                              <PersonIcon sx={{ fontSize: 16, color: "primary.main" }} />
                            </Avatar>
                            <Typography variant="body2" fontWeight={500}>
                              {registro.id}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {new Date(registro.fechaHora ?? registro.fecha).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(registro.fechaHora ?? registro.fecha).toLocaleTimeString()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getTipoIcon(registro.tipoRegistro)}
                            label={registro.tipoRegistro}
                            color={getTipoColor(registro.tipoRegistro)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
                
                {registros.length === 0 && (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography color="text.secondary">
                      No se encontraron registros para los filtros seleccionados
                    </Typography>
                  </Box>
                )}
              </Card>
            </motion.div>
          </Grid>
        )}
      </Grid>
    </AppLayout>
  );
}
