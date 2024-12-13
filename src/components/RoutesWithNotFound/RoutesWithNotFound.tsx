import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { ReactNode } from "react";
import { Route, Routes } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black"
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Página no encontrada
          </Typography>
          <Typography variant="body1" gutterBottom>
            Lo sentimos, la página que estás buscando no existe.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.href = "/"}
            sx={{ marginTop: 2 }}
          >
            Volver al Inicio
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export const RoutesWithNotFound = ({ children }: Props) => {
  return (
    <Routes>
      {children}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
