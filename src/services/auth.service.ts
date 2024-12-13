/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../config/axios.config";
import { LoginFormType, LoginResponse, RegisterFormType, RegisterResponse } from "../types/auth/index";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

const getAuthHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const handleError = (error: any): never => {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 401) throw new AuthError("No autorizado");
    if (status === 400) throw new AuthError(data.message || "Datos inválidos");
    throw new AuthError(data.message || "Error desconocido en el servidor");
  }
  throw new AuthError("No se pudo conectar con el servidor");
};

export const authService = {
  async login(credentials: LoginFormType) {
    try {
      const response = await axiosInstance.post<LoginResponse>("/auth/login", credentials);
      return response.data;

    } catch (error: any) {
      handleError(error);
    }
  },

  async register(userData: RegisterFormType) {
    try {
      const formData = new FormData();
      formData.append('nombre', userData.fullName);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('telefono', userData.phone);

      if (userData.photo) {
        formData.append('photo', userData.photo);
      }

      const response = await axiosInstance.post<RegisterResponse>(
        '/auth/register',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      handleError(error);
    }
  },

  async logout(token: string) {
    try {
      await axiosInstance.post("/auth/logout", {}, getAuthHeaders(token));
    } catch (error: any) {
      handleError(error);
    }
  }
};
