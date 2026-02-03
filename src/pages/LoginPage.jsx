import { useState } from "react";
import { motion } from "framer-motion";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { login } from "../api/usuariosService";
import { useNavigate } from "react-router-dom";

// Usuario de prueba solo en frontend (sin backend)
const USUARIO_PRUEBA = {
  correo: "test@test.com",
  contrasena: "123456",
  usuario: {
    id: 0,
    nombre: "Usuario de prueba",
    correo: "test@test.com",
    rol: "ADMINISTRADOR",
    codigo: "TEST001",
  },
};

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    // Si coincide con el usuario de prueba, entrar sin llamar al backend
    if (correo === USUARIO_PRUEBA.correo && contrasena === USUARIO_PRUEBA.contrasena) {
      onLogin(USUARIO_PRUEBA.usuario);
      navigate("/app");
      return;
    }
    try {
      const res = await login({ correo, contrasena });
      if (res.data?.autenticado && res.data?.usuario) {
        onLogin(res.data.usuario);
        navigate("/app");
      } else {
        setError(res.data?.mensaje || "Credenciales incorrectas");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al conectar con el servidor");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decoraciones de fondo */}
      <Box sx={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Box
          sx={{
            position: "absolute",
            top: "25%",
            right: -80,
            width: 384,
            height: 384,
            borderRadius: "50%",
            bgcolor: "primary.main",
            opacity: 0.1,
            filter: "blur(60px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "25%",
            left: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            bgcolor: "secondary.main",
            opacity: 0.1,
            filter: "blur(60px)",
          }}
        />
      </Box>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 400 }}
      >
        <Paper
          sx={{
            p: 4,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 3,
            boxShadow: 6,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                mb: 3,
                textAlign: "center",
                background: "linear-gradient(90deg, #0d47a1, #1565c0)",
                backgroundClip: "text",
                color: "transparent"
              }}
            >
              Iniciar sesión
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TextField
              label="Correo"
              type="email"
              fullWidth
              margin="normal"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
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
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="contained"
              fullWidth
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
              onClick={handleLogin}
            >
              Entrar
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              fullWidth 
              sx={{ 
                mt: 1,
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "rgba(13, 71, 161, 0.04)"
                }
              }} 
              onClick={() => navigate("/")}
            >
              Volver a inicio
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Typography 
              variant="caption" 
              display="block" 
              sx={{ 
                mt: 2, 
                color: "text.secondary", 
                textAlign: "center",
                bgcolor: "action.hover",
                px: 2,
                py: 1,
                borderRadius: 2
              }}
            >
              Prueba: test@test.com / 123456
            </Typography>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
}
