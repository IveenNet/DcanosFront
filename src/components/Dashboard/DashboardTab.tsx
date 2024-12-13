import { Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { AppointmentsTabProps } from '../../types/appointment/Dashboard/appointmentsTabProps.types';
import AppointmentList from '../Appointment/AppointmentList';

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
  tabValue,
  setTabValue,
  filterAppointments,
  onEdit,
  onDelete,
  actions, // Nuevo: Recibimos las acciones como prop
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ mb: 2 }}
        variant={isMobile ? 'fullWidth' : 'standard'}
      >
        <Tab label="Citas Pendientes" />
        <Tab label="Citas Completadas" />
      </Tabs>
      <AppointmentList
        appointments={filterAppointments()}
        onEdit={onEdit}
        onDelete={onDelete}
        actions={actions} // Pasamos las acciones personalizadas a la lista
      />
    </>
  );
};
