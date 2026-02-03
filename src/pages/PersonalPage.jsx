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
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  listarPersonal,
  registrarPersonal,
  cambiarEstadoPersonal,
} from "../api/personalService";
import AppLayout from "../components/layout/AppLayout";

const ESTADOS_LABORAL = ["ACTIVO", "INACTIVO", "VACACIONES"];

export default function PersonalPage({ modo }) {
  const [personal, setPersonal] = useState([]);
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nui, setNui] = useState("");
  const [estadoId, setEstadoId] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState("ACTIVO");

  const cargar = () => {
    listarPersonal()
      .then((res) => setPersonal(res.data || []))
      .catch(() => setPersonal([]));
  };

  useEffect(() => {
    cargar();
  }, [modo]);

  const handleRegistrar = async () => {
    try {
      await registrarPersonal({ nombre, codigo, nui });
      cargar();
      setNombre("");
      setCodigo("");
      setNui("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleCambiarEstado = async () => {
    if (!estadoId) return;
    try {
      await cambiarEstadoPersonal(estadoId, nuevoEstado);
      cargar();
      setEstadoId("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppLayout title={`Personal - ${modo}`}>
      <Grid container spacing={3}>
        {(modo === "Registrar" || modo === "Ligar con proyecto") && (
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Paper
                sx={{
                  p: 3,
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 3,
                  boxShadow: 6,
                  height: "100%"
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    background: "linear-gradient(90deg, #0d47a1, #1565c0)",
                    backgroundClip: "text",
                    color: "transparent"
                  }}
                >
                  Registrar personal
                </Typography>
                <TextField 
                  label="Nombre" 
                  fullWidth 
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
                  label="Código" 
                  fullWidth 
                  margin="normal" 
                  value={codigo} 
                  onChange={(e) => setCodigo(e.target.value)}
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
                  label="NUI" 
                  fullWidth 
                  margin="normal" 
                  value={nui} 
                  onChange={(e) => setNui(e.target.value)}
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
                <Button 
                  variant="contained" 
                  sx={{ 
                    mt: 2,
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
                >
                  Guardar
                </Button>
              </Paper>
            </motion.div>
          </Grid>
        )}

        {(modo === "Cambiar estado") && (
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Paper
                sx={{
                  p: 3,
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 3,
                  boxShadow: 6,
                  height: "100%"
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    background: "linear-gradient(90deg, #0d47a1, #1565c0)",
                    backgroundClip: "text",
                    color: "transparent"
                  }}
                >
                  Cambiar estado laboral
                </Typography>
                <TextField 
                  label="ID del personal" 
                  fullWidth 
                  margin="normal" 
                  value={estadoId} 
                  onChange={(e) => setEstadoId(e.target.value)}
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
                  value={nuevoEstado} 
                  onChange={(e) => setNuevoEstado(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    }
                  }}
                >
                  {ESTADOS_LABORAL.map((e) => (
                    <MenuItem key={e} value={e}>{e}</MenuItem>
                  ))}
                </Select>
                <Button 
                  variant="contained" 
                  sx={{ 
                    mt: 2,
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
                  onClick={handleCambiarEstado}
                >
                  Actualizar estado
                </Button>
              </Paper>
            </motion.div>
          </Grid>
        )}

        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper
              sx={{
                overflow: "hidden",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 3,
                boxShadow: 6
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ background: "linear-gradient(90deg, #0d47a1, #1565c0)" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nombre</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Código</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>NUI</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {personal.map((p, index) => (
                    <motion.tr
                      key={p.id}
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
                      <TableCell>{p.id}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{p.nombre}</TableCell>
                      <TableCell>{p.codigo}</TableCell>
                      <TableCell>{p.nui}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-block",
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            bgcolor: p.estadoLaboral === "ACTIVO" ? "success.light" : 
                                     p.estadoLaboral === "INACTIVO" ? "error.light" : "warning.light",
                            color: "white"
                          }}
                        >
                          {p.estadoLaboral}
                        </Box>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </AppLayout>
  );
}
