import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                Algo salió mal.
              </Typography>
              <Typography variant="body1" gutterBottom>
                Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta
                recargar la página.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.location.reload()}
                sx={{ marginTop: 2 }}
              >
                Recargar Página
              </Button>
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
