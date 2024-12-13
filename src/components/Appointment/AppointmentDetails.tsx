import { Box, Chip, Typography } from '@mui/material';
import React from 'react';
import { FaPhone } from 'react-icons/fa';
import { AppointmentDetailsProps } from '../../types/appointment';

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  isMobile,
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      gap: 0.5,
    }}
  >
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {appointment.entity.nombre}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: 'text.secondary',
          }}
        >
          <FaPhone size={14} />
          <Typography variant="body2">
            {appointment.entity.telefono ? (
              <a
                href={`tel:${appointment.entity.telefono}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {appointment.entity.telefono}
              </a>
            ) : (
              'Sin teléfono'
            )}
          </Typography>
        </Box>
      </Box>

      <Chip
        label={appointment.estado === 'completada' ? 'Completada' : 'Pendiente'}
        sx={{
          backgroundColor:
            appointment.estado === 'completada' ? '#4CAF50' : '#FF9800',
          color: '#fff',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          borderRadius: '8px',
          padding: '0 8px',
        }}
      />
    </Box>

    <Typography variant="body2" color="text.secondary">
      {`Servicio: ${appointment.servicios.map((s) => s.nombre).join(', ')}`}
    </Typography>

    <Typography variant="body2" color="text.secondary">
      {`Fecha: ${new Date(appointment.fecha_hora).toLocaleString('es-ES')}`}
    </Typography>

    {appointment.notas && (
      <Typography variant="body2" color="text.secondary">
        {`Nota: ${appointment.notas}`}
      </Typography>
    )}
  </Box>
);

export default AppointmentDetails;
