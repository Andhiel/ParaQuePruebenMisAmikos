import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, Box } from '@mui/material';

export default function LiquidCard({ children, ...props }) {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const card = cardRef.current;
    
    const handleMouseMove = (e) => {
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 50, y: 50 });
    };

    card?.addEventListener('mousemove', handleMouseMove);
    card?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card?.removeEventListener('mousemove', handleMouseMove);
      card?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
    >
      <Card
        sx={{
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(102, 126, 234, 0.3) 0%, transparent 50%)`,
            opacity: 0.8,
            transition: 'background 0.3s ease',
            pointerEvents: 'none',
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            background: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c)',
            borderRadius: '20px',
            zIndex: -1,
            opacity: 0,
            transition: 'opacity 0.3s ease',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 3s ease infinite',
          },
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)',
            '&:after': {
              opacity: 1,
            }
          },
          ...props.sx
        }}
      >
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          {children}
        </CardContent>
      </Card>
      
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </motion.div>
  );
}
