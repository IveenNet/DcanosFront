import { Divider, List, useMediaQuery, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { AppointmentListProps } from '../../types/appointment';
import AppointmentDetails from './AppointmentDetails';
import AnimatedIconButton from './button/AnimatedIconButton';
import { StyledActionBox, StyledAvatar, StyledListItem } from './style/index';

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  onEdit,
  onDelete,
  actions,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const sortedAppointments = useMemo(() => {
    console.log(appointments);

    return [...appointments].sort((a, b) => {
      // Ordenar por estado y luego por fecha
      if (a.estado === 'pendiente' && b.estado !== 'pendiente') return -1;
      if (a.estado !== 'pendiente' && b.estado === 'pendiente') return 1;
      return (
        new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime()
      );
    });
  }, [appointments]);

  return (
    <List>
      {sortedAppointments.map((appointment, index) => (
        <React.Fragment key={appointment._id}>
          <StyledListItem estado={appointment.estado}>
            <StyledAvatar
              src={appointment.entity.foto_url}
              alt={appointment.entity.nombre}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'; // Ruta de la imagen predeterminada
              }}
            />
            <AppointmentDetails appointment={appointment} isMobile={isMobile} />
            <StyledActionBox>
              {actions.map(
                (action, index) =>
                  (action.condition ? action.condition(appointment) : true) && ( // Verificamos si la condición es verdadera
                    <AnimatedIconButton
                      key={index}
                      onClick={() => action.handler(appointment)}
                      hoverColor={action.hoverColor}
                      sx={{ mr: isMobile ? 0.5 : 1 }}
                      title={action.title}
                    >
                      {action.icon}
                    </AnimatedIconButton>
                  )
              )}
            </StyledActionBox>
          </StyledListItem>
          {index < sortedAppointments.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default AppointmentList;
