// src/guards/PrivateGuard.tsx
import { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AppRoutes } from '../models/routes.model';

export const PrivateGuard = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
  const { user, token } = useAuth();

  if (!user || !token) {
    return <Navigate to={AppRoutes.public.auth} />;
  }

  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to={AppRoutes.public.auth} />;
  }

  return children;
};
