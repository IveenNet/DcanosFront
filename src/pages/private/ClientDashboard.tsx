import {
  Alert,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import background from '../../assets/background.avif';
import { StyledPaper } from '../../components/Appointment/style/index';
import BackgroundBox from '../../components/background/background ';
import {
  AppointmentsTab,
  DashboardHeader,
} from '../../components/Dashboard/index';
import AppointmentDialog from '../../components/Dialogs/AppointmentDialogClient';
import ConfirmationDialog from '../../components/Dialogs/ConfirmationDialog';
import { Loading } from '../../components/Load/Loading';
import { useAppointments, useStylists } from '../../hooks/index';
import { useAuthStore } from '../../stores/auth.store';
import {
  Appointment,
  AppointmentFormState,
} from '../../types/appointment/index';

const ClientDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    appointments,
    loading: appointmentsLoading,
    error: appointmentsError,
    fetchAppointments,
    deleteAppointment,
    editAppointment,
    createAppointment,
  } = useAppointments('cliente');
  const [tabValue, setTabValue] = useState(0);

  const {
    stylists,
    loading: stylistsLoading,
    error: stylistsError,
  } = useStylists(); // Usa el hook de estilistas
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null
  );

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<
    Appointment | undefined
  >(undefined);

  const [openNewDialog, setOpenNewDialog] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setAppointmentToEdit(appointment);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async (data: AppointmentFormState) => {
    if (data._id) {
      await editAppointment({
        _id: data._id,
        fecha_hora: data.date,
        peluquero_id: data.stylist,
        servicios: [data.service],
        notas: data.note,
      });
    }
    setAppointmentToEdit(undefined);
    setOpenEditDialog(false);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointmentToDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteAppointment = async () => {
    if (appointmentToDelete) {
      await deleteAppointment(appointmentToDelete);
      setAppointmentToDelete(null);
    }
    setOpenDeleteDialog(false);
  };

  const handleNewAppointment = () => {
    setOpenNewDialog(true);
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    if (tabValue === 0) {
      filtered = filtered.filter((apt) => apt.estado === 'pendiente');
    } else if (tabValue === 1) {
      filtered = filtered.filter((apt) => apt.estado === 'completada');
    }

    return filtered;
  };

  const handleNewSubmit = async (data: AppointmentFormState) => {
    await createAppointment({
      fecha_hora: data.date,
      peluquero_id: data.stylist,
      servicios: [data.service],
      notas: data.note,
    });
    setOpenNewDialog(false);
  };

  if (appointmentsLoading || stylistsLoading) {
    return <Loading />;
  }

  return (
    <BackgroundBox
      defaultBackground="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80"
      background={background}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <StyledPaper>
              <DashboardHeader
                userName={user?.nombre ?? ''}
                isMobile={isMobile}
                onNewAppointment={handleNewAppointment}
                onLogout={handleLogout}
                showNewAppointmentButton={true}
              />

              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                }}
              >
                Citas
              </Typography>

              {appointmentsError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {appointmentsError}
                </Alert>
              )}

              {stylistsError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {stylistsError}
                </Alert>
              )}

              <AppointmentsTab
                tabValue={tabValue}
                setTabValue={setTabValue}
                filterAppointments={filterAppointments}
                onEdit={handleEditAppointment}
                onDelete={handleDeleteAppointment}
                actions={[
                  {
                    icon: <FaEdit />,
                    handler: handleEditAppointment,
                    hoverColor: 'orange',
                    title: 'Editar cita',
                    condition: (appointment) =>
                      appointment.estado !== 'completada', // Condición para mostrar el botón de editar
                  },
                  {
                    icon: <FaTrash />,
                    handler: handleDeleteAppointment,
                    hoverColor: 'red',
                    title: 'Eliminar cita',
                  },
                ]}
              />
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>

      <ConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={confirmDeleteAppointment}
        title="Confirmar Eliminación"
        description="¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer."
      />

      <AppointmentDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSubmit={handleEditSubmit}
        stylists={stylists}
        initialData={appointmentToEdit}
      />

      <AppointmentDialog
        open={openNewDialog}
        onClose={() => setOpenNewDialog(false)}
        onSubmit={handleNewSubmit}
        stylists={stylists}
      />
    </BackgroundBox>
  );
};

export default ClientDashboard;
