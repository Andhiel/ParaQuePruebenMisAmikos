import { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';

export default function GlitchText({ children, variant = 'h3', ...props }) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
        ...props.sx
      }}
    >
      <Typography
        variant={variant}
        sx={{
          position: 'relative',
          fontWeight: 700,
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          zIndex: 2,
          ...props.sx
        }}
      >
        {children}
      </Typography>
      
      {/* Glitch layers */}
      <Typography
        variant={variant}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          fontWeight: 700,
          color: '#00ffff',
          opacity: isGlitching ? 0.8 : 0,
          transform: isGlitching ? 'translate(-2px, 2px)' : 'translate(0, 0)',
          transition: 'all 0.1s ease',
          zIndex: 1,
          clipPath: isGlitching ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)',
          animation: isGlitching ? 'glitch1 0.3s infinite' : 'none',
          ...props.sx
        }}
      >
        {children}
      </Typography>
      
      <Typography
        variant={variant}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          fontWeight: 700,
          color: '#ff00ff',
          opacity: isGlitching ? 0.8 : 0,
          transform: isGlitching ? 'translate(2px, -2px)' : 'translate(0, 0)',
          transition: 'all 0.1s ease',
          zIndex: 1,
          clipPath: isGlitching ? 'inset(100% 0 0 0)' : 'inset(0 0 0 0)',
          animation: isGlitching ? 'glitch2 0.3s infinite' : 'none',
          ...props.sx
        }}
      >
        {children}
      </Typography>
      
      <style jsx>{`
        @keyframes glitch1 {
          0%, 100% { transform: translate(-2px, 2px); }
          50% { transform: translate(2px, -2px); }
        }
        
        @keyframes glitch2 {
          0%, 100% { transform: translate(2px, -2px); }
          50% { transform: translate(-2px, 2px); }
        }
      `}</style>
    </Box>
  );
}
