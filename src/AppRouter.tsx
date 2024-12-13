// src/AppRouter.tsx
import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Loading } from './components';
import { PrivateGuard } from './guards/PrivateGuard';
import { AppRoutes } from './models/routes.model';

// Lazy loading de páginas
const AuthPage = lazy(() => import('./pages/public/AuthPage'));
const ClientDashboard = lazy(() => import('./pages/private/ClientDashboard'));
const HairdresserDashboard = lazy(
  () => import('./pages/private/HairdresserDashboard')
);
const AdminDashboard = lazy(() => import('./pages/private/AdminDashboard'));

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route
            path={AppRoutes.root}
            element={<Navigate to={AppRoutes.public.auth} replace />}
          />
          <Route path={AppRoutes.public.auth} element={<AuthPage />} />

          <Route
            path={AppRoutes.private.client}
            element={
              <PrivateGuard allowedRoles={['cliente']}>
                <ClientDashboard />
              </PrivateGuard>
            }
          />

          <Route
            path={AppRoutes.private.hairdresser}
            element={
              <PrivateGuard allowedRoles={['peluquero']}>
                <HairdresserDashboard />
              </PrivateGuard>
            }
          />
          <Route
            path={AppRoutes.private.admin}
            element={
              <PrivateGuard allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateGuard>
            }
          />

          <Route
            path="*"
            element={<Navigate to={AppRoutes.public.auth} replace />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
