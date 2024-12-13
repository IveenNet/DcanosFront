/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { Email, Lock } from '@mui/icons-material';
import { Alert, Box, Button } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../models';
import { loginSchema } from '../../schemas/auth.schema';
import { useAuthStore } from '../../stores/auth.store';
import { LoginFormType } from '../../types/auth/index';
import { CustomTextField } from '../form/CustomTextField';

export const LoginForm: React.FC = () => {
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormType) => {
    try {
      setError(null);
      await login(data);

      const { user } = useAuthStore.getState();
      switch (user?.rol) {
        case 'cliente':
          navigate(AppRoutes.private.client);
          break;
        case 'peluquero':
          navigate(AppRoutes.private.hairdresser);
          break;
        case 'admin':
          navigate(AppRoutes.private.admin);
          break;
        default:
          throw new Error('Rol desconocido');
      }
    } catch (err: any) {
      setError(err.message);
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

      <CustomTextField
        name="email"
        control={control}
        label="Email"
        type="email"
        margin="normal"
        icon={<Email />}
      />

      <CustomTextField
        name="password"
        control={control}
        label="Contraseña"
        type="password"
        margin="normal"
        icon={<Lock />}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting}
        sx={{ mt: 2 }}
      >
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>
    </Box>
  );
};
