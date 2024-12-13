// src/hooks/useAuth.ts
import { useAuthStore } from '../stores/auth.store';

export const useAuth = () => {
  const { token, user, isAuthenticated, login, logout } = useAuthStore();

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout: logout
  };
};


