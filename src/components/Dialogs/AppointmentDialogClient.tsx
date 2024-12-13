import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { appointmentSchema } from '../../schemas/appointment.schema';
import {
  AppointmentDialogPropsCliente,
  AppointmentFormState,
} from '../../types/appointment/index';
import { Specialties } from '../../types/stylist/specialties.types';
import { formatDateForInput } from '../../utils/formatDateForInput ';
import { CustomTextField } from '../form/CustomTextField';

const defaultValues: AppointmentFormState = {
  date: '',
  stylist: '',
  service: '',
  note: '',
};

const AppointmentDialogClient: React.FC<AppointmentDialogPropsCliente> = ({
  open,
  onClose,
  onSubmit,
  stylists,
  initialData,
}) => {
  const { control, handleSubmit, reset, watch, setValue } =
    useForm<AppointmentFormState>({
      defaultValues,
      resolver: zodResolver(appointmentSchema),
    });

  const selectedStylistId = watch('stylist');
  const [availableServices, setAvailableServices] = useState<Specialties[]>([]);
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

  useEffect(() => {
    if (initialData) {
      const initialStylist = stylists.find(
        (s) => s._id === initialData.entity._id
      );
      const services = initialStylist?.detalles.especialidades || [];
      setAvailableServices(services);

      const initialService = services.some(
        (service) => service._id === initialData.servicios?.[0]?._id
      )
        ? initialData.servicios?.[0]?._id
        : '';

      console.log(initialData.fecha_hora);
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
  }, [initialData, reset, stylists]);

  useEffect(() => {
    const selectedStylist = stylists.find((s) => s._id === selectedStylistId);
    const services = selectedStylist?.detalles.especialidades || [];
    setAvailableServices(services);

    const currentService = watch('service');
    if (!services.some((service) => service._id === currentService)) {
      setValue('service', '');
    }
  }, [selectedStylistId, setValue, stylists, watch]);

  const handleFormSubmit = (data: AppointmentFormState) => {
    if (!data.stylist || !data.service || !data.date) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    const isUpdate = Boolean(initialData);

    if (isUpdate) {
      console.log('Actualizando cita:', {
        ...data,
        _id: initialData?._id,
      });
      onSubmit({
        ...data,
        _id: initialData?._id,
      });
    } else {
      console.log('Creando nueva cita:', data);
      onSubmit(data);
    }

    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        {initialData ? 'Editar Cita' : 'Nueva Cita'}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Rellena los campos para configurar tu cita.
        </Typography>
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
          name="stylist"
          control={control}
          label="Peluquero"
          select
        >
          <MenuItem value="">
            <em>Selecciona un peluquero</em>
          </MenuItem>
          {stylists.map((stylist) => (
            <MenuItem key={stylist._id} value={stylist._id}>
              {stylist.nombre}
            </MenuItem>
          ))}
        </CustomTextField>

        <CustomTextField
          name="service"
          control={control}
          label="Servicio"
          select
          disabled={availableServices.length === 0}
        >
          <MenuItem value="">
            <em>Selecciona un servicio</em>
          </MenuItem>
          {availableServices.map((service) => (
            <MenuItem key={service._id} value={service._id}>
              {service.nombre} - {service.duracion_estimada} mins (
              {service.precio_base}€)
            </MenuItem>
          ))}
        </CustomTextField>

        <CustomTextField
          name="note"
          control={control}
          label="Nota"
          multiline
          rows={3}
          inputProps={{ maxLength: 100 }}
          helperText="Máximo 100 caracteres."
        />
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
          {initialData ? 'Guardar Cambios' : 'Crear Cita'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentDialogClient;
