// src/components/DashboardHeader.tsx
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { FaCalendarPlus, FaSignOutAlt } from 'react-icons/fa';
import { DashboardHeaderProps } from '../../types/appointment/Dashboard/dashboardHeaderProps.types';

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isMobile,
  onNewAppointment,
  onLogout,
  userName,
  showNewAppointmentButton,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: 2,
        mb: 4,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 600,
          fontSize: { xs: '1.5rem', sm: '2rem' },
        }}
      >
        Bienvenid@, {userName}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 1,
        }}
      >
        {showNewAppointmentButton && ( // Renderiza el botón condicionalmente
          <Button
            fullWidth={isMobile}
            variant="contained"
            startIcon={<FaCalendarPlus />}
            onClick={onNewAppointment}
            sx={{
              backgroundColor: '#2D3748',
              '&:hover': { backgroundColor: '#1A202C' },
            }}
          >
            Nueva Cita
          </Button>
        )}
        <Button
          fullWidth={isMobile}
          variant="contained"
          color="error"
          startIcon={<FaSignOutAlt />}
          onClick={onLogout}
          sx={{
            '&:hover': { backgroundColor: '#C53030' },
          }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );
};
