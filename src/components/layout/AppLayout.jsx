import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ParticleBackground from "../effects/ParticleBackground";
import LiquidCard from "../effects/LiquidCard";
import GlitchText from "../effects/GlitchText";

export default function AppLayout({ children, title }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Decoraciones de fondo animadas */}
      <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: "absolute",
            top: "25%",
            right: -80,
            width: 384,
            height: 384,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: "absolute",
            bottom: "25%",
            left: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(118, 75, 162, 0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </Box>

      {/* Header con efecto líquido */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          zIndex: 1100,
        }}
      >
        <LiquidCard sx={{ mx: 3, my: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Logo y título con efecto glitch */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <motion.div
                whileHover={{ 
                  rotate: 360,
                  scale: 1.1,
                  transition: { duration: 0.5 }
                }}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                }}
                onClick={() => navigate("/app")}
              >
                <Typography sx={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
                  S
                </Typography>
              </motion.div>
              <GlitchText variant="h6">
                Sistema Asistencia
              </GlitchText>
            </Box>

            {/* Botón de logout con efecto magnético */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  cursor: "pointer",
                  px: 2,
                  py: 1,
                  borderRadius: "50px",
                  transition: "all 0.3s",
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  fontWeight: 600,
                  "&:hover": {
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                    boxShadow: "0 4px 15px rgba(255,255,255,0.3)",
                    transform: "translateY(-2px)"
                  }
                }}
                onClick={() => navigate("/")}
              >
                Cerrar sesión
              </Typography>
            </motion.div>
          </Box>
        </LiquidCard>
      </motion.header>

      {/* Contenido principal */}
      <Box sx={{ position: "relative", zIndex: 1, p: 3 }}>
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GlitchText 
              variant="h3" 
              sx={{
                mb: 4,
                textAlign: "center",
                fontSize: { xs: "2rem", md: "2.5rem" }
              }}
            >
              {title}
            </GlitchText>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </Box>
    </Box>
  );
}
