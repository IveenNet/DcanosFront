import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { appointmentSchema } from '../../schemas/appointment.schema';
import {
  appointmentDialogPropsHairdress,
  AppointmentFormState,
  AppointmentFormStateHairdress,
} from '../../types/appointment/index';
import { Specialties } from '../../types/stylist/specialties.types';
import { formatDateForInput } from '../../utils/formatDateForInput ';
import { CustomTextField } from '../form/CustomTextField';

const defaultValues: AppointmentFormState = {
  date: '',
  service: '',
};

const AppointmentDialogHairdress: React.FC<appointmentDialogPropsHairdress> = ({
  open,
  onClose,
  onSubmit,
  services,
  initialData,
}) => {
  const { control, handleSubmit, reset } = useForm<AppointmentFormState>({
    defaultValues,
    resolver: zodResolver(appointmentSchema),
  });

  const [availableServices, setAvailableServices] = useState<Specialties[]>(
    services || []
  );

  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  // Configurar la fecha mínima al momento actual y máxima a 30 días desde ahora
  useEffect(() => {
    const now = new Date();
    now.setMinutes(Math.ceil(now.getMinutes() / 5) * 5, 0, 0); // Redondear a múltiplos de 5 minutos
    const max = new Date();
    max.setDate(max.getDate() + 30); // Fecha máxima 30 días desde ahora

    setMinDate(now.toISOString().slice(0, 16));
    setMaxDate(max.toISOString().slice(0, 16));
  }, []);

  const handleFormSubmit = (data: AppointmentFormStateHairdress) => {
    if (!data.service || !data.date) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    console.log(data);

    console.log('Actualizando cita:', {
      ...data,
      _id: initialData?._id,
    });
    onSubmit({
      ...data,
      _id: initialData?._id,
    });

    reset();
    onClose();
  };

  useEffect(() => {
    if (initialData) {
      const initialService = services.some(
        (service) => service._id === initialData.servicios?.[0]?._id
      )
        ? initialData.servicios?.[0]?._id
        : '';

      // Resetear el formulario con los datos iniciales
      reset({
        date: formatDateForInput(initialData.fecha_hora),
        stylist: initialData.entity._id,
        service: initialService,
        note: initialData.notas || '',
      });
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset, services]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Modificar Cita
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Modifique la fecha y el servicio asociado a la cita.
        </Typography>

        {/* Campo Nombre del Cliente (Solo Lectura) */}
        <TextField
          label="Nombre del Cliente"
          value={initialData?.entity.nombre || ''}
          InputProps={{
            readOnly: true,
            disabled: true,
          }}
          fullWidth
        />

        {/* Campo Número de Teléfono (Solo Lectura) */}
        <TextField
          label="Número de Teléfono"
          value={initialData?.entity.telefono || ''}
          InputProps={{
            readOnly: true,
            disabled: true,
          }}
          fullWidth
        />

        {/* Campo Fecha y Hora */}
        <CustomTextField
          name="date"
          control={control}
          label="Fecha y Hora"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          InputProps={{ inputProps: { min: minDate, max: maxDate } }}
          helperText="Seleccione una fecha futura (máximo 30 días). Los minutos deben ser múltiplos de 5."
        />

        <CustomTextField
          name="service"
          control={control}
          label="Servicio"
          select
          fullWidth
        >
          {availableServices.map((service) => (
            <MenuItem key={service._id} value={service._id}>
              {service.nombre} - {service.duracion_estimada} mins (
              {service.precio_base}€)
            </MenuItem>
          ))}
        </CustomTextField>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', padding: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(handleFormSubmit)}
          sx={{ backgroundColor: '#1976d2', color: '#fff' }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentDialogHairdress;
