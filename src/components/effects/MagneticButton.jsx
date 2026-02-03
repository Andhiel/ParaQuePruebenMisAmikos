import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@mui/material';

export default function MagneticButton({ children, ...props }) {
  const buttonRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const button = buttonRef.current;
    
    const handleMouseMove = (e) => {
      if (!button) return;
      
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

    button?.addEventListener('mousemove', handleMouseMove);
    button?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button?.removeEventListener('mousemove', handleMouseMove);
      button?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      ref={buttonRef}
      style={{
        display: 'inline-block',
        transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        {...props}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '50px',
          color: 'white',
          fontWeight: 600,
          padding: '12px 32px',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover': {
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
            transform: 'translateY(-2px)',
            '&:before': {
              left: '100%',
            }
          },
          ...props.sx
        }}
      >
        {children}
      </Button>
    </motion.div>
  );
}
