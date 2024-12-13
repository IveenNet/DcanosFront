import { IconButton, IconButtonProps } from '@mui/material';
import React from 'react';

interface AnimatedIconButtonProps extends IconButtonProps {
  hoverColor?: string;
}

const AnimatedIconButton: React.FC<AnimatedIconButtonProps> = ({
  hoverColor,
  children,
  ...props
}) => {
  return (
    <IconButton
      {...props}
      sx={{
        transition: 'color 0.3s ease',
        '&:hover': {
          color: hoverColor || 'inherit',
        },
        ...props.sx, // Asegúrate de extender estilos si se pasan
      }}
    >
      {children}
    </IconButton>
  );
};

export default AnimatedIconButton;
