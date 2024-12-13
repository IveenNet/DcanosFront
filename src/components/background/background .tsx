import { Box } from '@mui/material';
import React from 'react';

interface BackgroundBoxProps {
  defaultBackground?: string; // Ruta de la imagen local o URL de fondo por defecto
  background?: string; // Ruta de la imagen local o URL de fondo
  children?: React.ReactNode; // Contenido opcional dentro del fondo
}

const BackgroundBox: React.FC<BackgroundBoxProps> = ({
  defaultBackground,
  background,
  children,
}) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${background || defaultBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {children}
    </Box>
  );
};

export default BackgroundBox;
