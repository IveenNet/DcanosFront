import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Pagination,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { styled, useMediaQuery, useTheme } from '@mui/system';
import { useEffect, useState } from 'react';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import background from '../../assets/background.avif';
import BackgroundBox from '../../components/background/background ';
import { DashboardHeader } from '../../components/Dashboard/index';
import ConfirmationDialog from '../../components/Dialogs/ConfirmationDialog';
import { useSpecialties } from '../../hooks/useSpecialties';
import { useUsers } from '../../hooks/useUsers';
import { useAuthStore } from '../../stores/auth.store';
import { User } from '../../types/user/user.types';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const RootAdminPage = () => {
  const { users, loading, error, fetchUsers, updateUser, deleteUser } =
    useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<User['rol']>('cliente');
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null
  );
  const { specialties, fetchSpecialtiesByHairdresser } = useSpecialties('');

  const itemsPerPage = 25;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const confirmDeleteAppointment = async () => {
    if (appointmentToDelete) {
      await deleteAppointment(appointmentToDelete);
      setAppointmentToDelete(null);
    }
    setOpenDeleteDialog(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser && editRole === 'peluquero') {
      fetchSpecialtiesByHairdresser();
    }
  }, [selectedUser, editRole]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteUser(userId);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditRole(user.rol);
    setEditName(user.nombre);
    setEditPhone(user.telefono || '');
    setSelectedServices(
      user.detalles?.especialidades.map((service) => service) || []
    );
    setOpenEditDialog(true);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointmentToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleRoleChange = async () => {
    if (selectedUser) {
      const updatedUser: Partial<User> = {
        rol: editRole,
        nombre: editName,
        telefono: editPhone,
        detalles:
          editRole === 'peluquero'
            ? { ...selectedUser.detalles, especialidades: selectedServices }
            : undefined,
      };
      await updateUser(selectedUser._id, updatedUser);
      setOpenEditDialog(false);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const filteredUsers = users.filter((user) =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const displayedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <BackgroundBox
      defaultBackground="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80"
      background={background}
    >
      <Container>
        <StyledPaper>
          <DashboardHeader
            userName={user?.nombre ?? ''}
            isMobile={isMobile}
            onNewAppointment={() => {}}
            onLogout={handleLogout}
            showNewAppointmentButton={false}
          />

          {error && (
            <Typography variant="body1" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar por nombre"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <FaSearch style={{ marginRight: '8px' }} />,
              }}
            />
          </Box>

          {loading ? (
            <Typography variant="body1">Cargando usuarios...</Typography>
          ) : (
            <List>
              {displayedUsers.map((user, index) => (
                <ListItem
                  key={user._id}
                  divider={index < displayedUsers.length - 1}
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        onClick={() => handleEditClick(user)}
                        sx={{ mr: 1 }}
                      >
                        <FaEdit />
                      </IconButton>
                      <IconButton edge="end" onClick={handleDeleteAppointment}>
                        <FaTrash />
                      </IconButton>
                    </Box>
                  }
                >
                  <Avatar
                    src={user.foto_url}
                    alt={user.nombre}
                    sx={{ width: 50, height: 50, mr: 2 }}
                  />
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {user.nombre}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={
                            user.rol === 'peluquero' ? 'primary' : 'secondary'
                          }
                        >
                          {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
          <ConfirmationDialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            onConfirm={confirmDeleteAppointment}
            title="Confirmar Eliminación"
            description="¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer."
          />
          <Dialog
            open={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
          >
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Nombre"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                label="Teléfono"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                sx={{ mt: 2 }}
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={editRole}
                  label="Rol"
                  onChange={(e) => setEditRole(e.target.value as User['rol'])}
                >
                  <MenuItem value="cliente">Cliente</MenuItem>
                  <MenuItem value="peluquero">Peluquero</MenuItem>
                </Select>
              </FormControl>
              {editRole === 'peluquero' && (
                <List sx={{ mt: 2 }}>
                  {specialties.map((service) => (
                    <ListItem key={service._id}>
                      <ListItemText primary={service.nombre} />
                      <ListItemSecondaryAction>
                        <Checkbox
                          edge="end"
                          checked={selectedServices.includes(service._id)}
                          onChange={() => handleServiceToggle(service._id)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
              <Button
                onClick={handleRoleChange}
                variant="contained"
                color="primary"
              >
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
        </StyledPaper>
      </Container>
    </BackgroundBox>
  );
};

export default RootAdminPage;
