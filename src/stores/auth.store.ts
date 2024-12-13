/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { authService } from '../services/auth.service';
import { LoginResponse } from '../types/auth/authLoginResponse.types';
import { AuthState } from '../types/auth/authState.store.types';

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,
  message: null,

  login: async (credentials) => {
    try {
      const response = await authService.login(credentials) as LoginResponse;

      if (!response || !response.token || !response.user) {
        throw new Error('Invalid response from login service');
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      console.log(response.user);
      set({
        token: response.token,
        user: response.user,
        isAuthenticated: true,
        error: null,
        message: response.message || 'Login successful',
      });

      // Conectar al WebSocket si el rol es 'peluquero'
    } catch (error: any) {

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      set({
        token: null,
        user: null,
        isAuthenticated: false,
        error: error.message || 'Error during login',
        message: null,
      });

      throw error;
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await authService.logout(token);
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      set({
        token: null,
        user: null,
        isAuthenticated: false,
        error: null,
        message: 'Logout successful',
      });
    } catch (error: any) {
      set({
        error: error.message || 'Error during logout',
      });
    }
  },
}));
