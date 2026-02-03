import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Grid, Paper, Typography, CircularProgress, Box } from "@mui/material";
import { listarProyectosActivos } from "../api/proyectosService";
import { ausenciasPendientes } from "../api/ausenciasService";
import { listarPersonal } from "../api/personalService";

export default function DashBoard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ausenciasPendientes: 0,
    proyectosActivos: 0,
    personalRegistrado: 0,
  });

  useEffect(() => {
    const cargar = async () => {
      try {
        const [ausenciasRes, proyectosRes, personalRes] = await Promise.allSettled([
          ausenciasPendientes(),
          listarProyectosActivos(),
          listarPersonal(),
        ]);
        setStats({
          ausenciasPendientes: ausenciasRes.status === "fulfilled" ? (ausenciasRes.value?.data?.length ?? 0) : 0,
          proyectosActivos: proyectosRes.status === "fulfilled" ? (proyectosRes.value?.data?.length ?? 0) : 0,
          personalRegistrado: personalRes.status === "fulfilled" ? (personalRes.value?.data?.length ?? 0) : 0,
        });
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const items = [
    { title: "Ausencias pendientes", value: stats.ausenciasPendientes },
    { title: "Proyectos activos", value: stats.proyectosActivos },
    { title: "Personal registrado", value: stats.personalRegistrado },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 3,
              boxShadow: 6,
              position: "relative",
              zIndex: 1
            }}
          >
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
              Cargando dashboard...
            </Typography>
          </Paper>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)",
        p: 3,
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

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "white",
              fontWeight: 700,
              mb: 4,
              textAlign: "center",
              fontSize: { xs: "2rem", md: "2.5rem" }
            }}
          >
            Dashboard
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          {items.map((stat, index) => (
            <Grid item xs={12} md={4} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 3,
                    boxShadow: 6,
                    height: "100%",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 8,
                    }
                  }}
                >
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    {stat.title}
                  </Typography>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: "bold",
                      background: "linear-gradient(90deg, #0d47a1, #1565c0)",
                      backgroundClip: "text",
                      color: "transparent"
                    }}
                  >
                    {stat.value}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
