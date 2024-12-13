// AuthPage.tsx
import { Container, Paper, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { JSX, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import background from '../../assets/background.avif';
import { LoginForm } from '../../components/auth/LoginForm';
import { RegisterForm } from '../../components/auth/RegisterForm';
import BackgroundBox from '../../components/background/background ';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
}));

export default function AuthPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode'); // Lee el valor del parámetro "mode"
  const [tabValue, setTabValue] = React.useState<number>(
    mode === 'register' ? 1 : 0
  ); // Por defecto, login (0)

  useEffect(() => {
    // Sincroniza el tabValue con los cambios en la URL
    if (mode === 'register') {
      setTabValue(1);
    } else {
      setTabValue(0);
    }
  }, [mode]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Actualiza el parámetro "mode" en la URL según la pestaña seleccionada
    setSearchParams({ mode: newValue === 1 ? 'register' : 'login' });
  };

  return (
    <BackgroundBox
      defaultBackground="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80"
      background={background}
    >
      <Container maxWidth="xs">
        <StyledPaper>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 3, width: '100%' }}
          >
            <Tab label="Iniciar Sesión" />
            <Tab label="Registrarse" />
          </Tabs>

          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 4, fontWeight: 600 }}
          >
            {tabValue === 0 ? 'Bienvenido de nuevo' : 'Crear cuenta'}
          </Typography>

          {tabValue === 0 ? <LoginForm /> : <RegisterForm />}
        </StyledPaper>
      </Container>
    </BackgroundBox>
  );
}
