import { zodResolver } from '@hookform/resolvers/zod';
import { Email, Lock, Person, Phone } from '@mui/icons-material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Alert, Box, Button, IconButton, Snackbar } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { registerSchema } from '../../schemas/auth.register.schema';
import { authService } from '../../services/auth.service';
import { RegisterFormType } from '../../types/auth/index';
import { CustomTextField } from '../form/CustomTextField';

export const RegisterForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      photo: null,
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('photo', file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: RegisterFormType) => {
    try {
      setError(null); // Reinicia el estado de error
      setSuccess(false); // Reinicia el estado de éxito
      await authService.register(data); // Llama al servicio
      setSuccess(true); // Indica éxito si no hay errores
      setTimeout(() => {
        navigate('/auth?mode=login'); // Redirige al login
      }, 1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err); // Muestra el error en la consola para depuración
      setError(err.message || 'Error en el registro'); // Usa el mensaje del error lanzado
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: '100%', maxWidth: 400 }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Registro exitoso. Redirigiendo...
        </Alert>
      </Snackbar>

      <CustomTextField
        name="fullName"
        control={control}
        label="Nombre Completo"
        margin="normal"
        icon={<Person />}
      />

      <CustomTextField
        name="email"
        control={control}
        label="Email"
        type="email"
        margin="normal"
        icon={<Email />}
      />

      <CustomTextField
        name="phone"
        control={control}
        label="Teléfono"
        margin="normal"
        icon={<Phone />}
      />

      <CustomTextField
        name="password"
        control={control}
        label="Contraseña"
        type="password"
        margin="normal"
        icon={<Lock />}
      />

      <CustomTextField
        name="confirmPassword"
        control={control}
        label="Confirmar Contraseña"
        type="password"
        margin="normal"
        icon={<Lock />}
      />

      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="photo-upload"
          type="file"
          onChange={handlePhotoChange}
        />
        <label htmlFor="photo-upload">
          <IconButton color="primary" component="span">
            <PhotoCamera />
          </IconButton>
        </label>
        {photoPreview && (
          <Box
            component="img"
            src={photoPreview}
            alt="Preview"
            sx={{
              width: 100,
              height: 100,
              objectFit: 'cover',
              borderRadius: 1,
            }}
          />
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting}
        sx={{ mt: 2 }}
      >
        {isSubmitting ? 'Registrando...' : 'Registrarse'}
      </Button>
    </Box>
  );
};
