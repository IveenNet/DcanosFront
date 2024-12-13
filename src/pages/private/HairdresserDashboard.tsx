import {
  Alert,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  FaCheck,
  FaEdit,
  FaFilter,
  FaSearch,
  FaTrash,
  FaUndo,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import background from '../../assets/backgroundpelu.avif';
import { Loading } from '../../components';
import {
  StyledPaper,
  StyledSearchBox,
} from '../../components/Appointment/style/index';
import BackgroundBox from '../../components/background/background ';
import {
  AppointmentsTab,
  DashboardHeader,
} from '../../components/Dashboard/index';
import AppointmentDialogHairdress from '../../components/Dialogs/AppointmentDialogHairdress';
import ConfirmationDialog from '../../components/Dialogs/ConfirmationDialog';
import { useAppointments } from '../../hooks';
import { useSpecialties } from '../../hooks/useSpecialties';
import { useAuthStore } from '../../stores/auth.store';
import { Appointment, AppointmentFormState } from '../../types/appointment';

const DashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('today');
  const [tabValue, setTabValue] = useState(0);
  const token = useAuthStore((state) => state.token);

  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  const {
    appointments,
    loading: appointmentsLoading,
    error: appointmentsError,
    fetchAppointments,
    deleteAppointment,
    editAppointment,
  } = useAppointments(token);
  const user = useAuthStore((state) => state.user);

  const {
    specialties,
    loading: specialtiesLoading,
    error: specialtiesError,
    fetchSpecialtiesByHairdresser,
  } = useSpecialties(user?._id);

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Cargar servicios del peluquero logeado
  useEffect(() => {
    if (user?._id) {
      fetchSpecialtiesByHairdresser(); // Ahora el hook usa el ID automáticamente desde el store
    }
  }, [user]);

  const confirmDeleteAppointment = async () => {
    if (appointmentToDelete) {
      await deleteAppointment(appointmentToDelete);
      setAppointmentToDelete(null);
    }
    setOpenDeleteDialog(false);
  };

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<
    Appointment | undefined
  >(undefined);

  const handleEditSubmit = async (data: AppointmentFormState) => {
    console.log(data);
    if (data._id) {
      await editAppointment({
        _id: data._id,
        fecha_hora: data.date,
        cliente_id: data.stylist,
        servicios: [data.service],
        notas: data.note,
      });
    }
    setAppointmentToEdit(undefined);
    setOpenEditDialog(false);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setAppointmentToEdit(appointment);
    setOpenEditDialog(true);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointmentToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    const updatedAppointments = appointments.filter(
      (apt) => apt.id !== appointmentToDelete
    );
    setAppointments(updatedAppointments);
    setOpenDeleteDialog(false);
    setAppointmentToDelete(null);
  };

  const handleCompleteAppointment = (id) => {
    const updatedAppointments = appointments.map((apt) =>
      apt.id === id ? { ...apt, completed: !apt.completed } : apt
    );
    setAppointments(updatedAppointments);
  };

  const resetForm = () => {
    setSelectedAppointment(null);
    setAppointmentDate('');
    setService('');
    setClientName('');
    setPhoneNumber('');
  };

  const handleUpdateStatus = async (appointment: Appointment) => {
    try {
      // Determinar el nuevo estado
      const nuevoEstado =
        appointment.estado === 'pendiente' ? 'completada' : 'pendiente';

      // Hacer la llamada al servidor para actualizar el estado
      const response = await editAppointment({
        _id: appointment._id,
        estado: nuevoEstado,
      });

      if (response) {
        // Actualizar el estado local
        setAppointments((prevAppointments) =>
          prevAppointments.map((apt) =>
            apt._id === appointment._id ? { ...apt, estado: nuevoEstado } : apt
          )
        );
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la cita:', error);
    }
  };

  const filterAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    // Clonar y ordenar por fecha
    let filtered = [...appointments].sort(
      (a, b) =>
        new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime()
    );

    // Filtrar por estado según la pestaña seleccionada
    if (tabValue === 0) {
      filtered = filtered.filter((apt) => apt.estado === 'pendiente');
    } else if (tabValue === 1) {
      filtered = filtered.filter((apt) => apt.estado === 'completada');
    }

    // Filtrar por período de tiempo
    if (filterType === 'today') {
      filtered = filtered.filter((apt) => {
        const aptDate = new Date(apt.fecha_hora);
        return aptDate.toDateString() === today.toDateString();
      });
    } else if (filterType === 'week') {
      filtered = filtered.filter((apt) => {
        const aptDate = new Date(apt.fecha_hora);
        return aptDate >= today && aptDate <= nextWeek;
      });
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.entity.nombre.toLowerCase().includes(searchLower) || // Busca por nombre
          apt.entity.telefono?.toLowerCase().includes(searchLower) // Busca por teléfono
      );
    }

    return filtered;
  };

  if (appointmentsLoading || specialtiesLoading) {
    return <Loading />;
  }

  return (
    <BackgroundBox
      defaultBackground="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1920&q=80"
      background={background}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <StyledPaper>
              <DashboardHeader
                userName={user?.nombre}
                isMobile={isMobile}
                onNewAppointment={() => setOpenNewAppointment(true)}
                onLogout={handleLogout}
                showNewAppointmentButton={false}
              />

              <StyledSearchBox>
                <TextField
                  placeholder="Buscar por cliente o teléfono"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaSearch />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl
                  fullWidth={isMobile}
                  sx={{ minWidth: isMobile ? '100%' : 200 }}
                >
                  <InputLabel>Filtrar por</InputLabel>
                  <Select
                    value={filterType}
                    label="Filtrar por"
                    onChange={(e) => setFilterType(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <FaFilter />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="today">Hoy</MenuItem>
                    <MenuItem value="week">Esta semana</MenuItem>
                    <MenuItem value="all">Todas</MenuItem>
                  </Select>
                </FormControl>
              </StyledSearchBox>

              {appointmentsError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {appointmentsError}
                </Alert>
              )}

              {specialtiesError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {specialtiesError}
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
                  {
                    icon: tabValue === 0 ? <FaCheck /> : <FaUndo />,
                    handler: handleUpdateStatus,
                    hoverColor: tabValue === 0 ? 'green' : 'orange',
                    title:
                      tabValue === 0
                        ? 'Marcar como completada'
                        : 'Marcar como pendiente',
                  },
                ]}
              />
            </StyledPaper>
          </Grid>
        </Grid>

        <AppointmentDialogHairdress
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          onSubmit={handleEditSubmit}
          services={specialties} // Pasamos los servicios del peluquero logeado
          initialData={appointmentToEdit}
        />

        <ConfirmationDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={confirmDeleteAppointment}
          title="Confirmar Eliminación"
          description="¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer."
        />
      </Container>
    </BackgroundBox>
  );
};

export default DashboardPage;
