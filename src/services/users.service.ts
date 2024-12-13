/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '../config/axios.config';
import { User } from '../types/user/user.types';

export class UserServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserServiceError';
  }
}

export const userService = {
  async getUsers(): Promise<User[]> {
    try {
      const response = await axiosInstance.get('/users');
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          throw new UserServiceError('No autorizado para obtener los usuarios');
        }
        throw new UserServiceError(data.message || 'Error desconocido al obtener los usuarios');
      }
      throw new UserServiceError('No se pudo conectar con el servidor');
    }
  },

  async getUserById(userId: string): Promise<User> {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          throw new UserServiceError('Usuario no encontrado');
        }
        throw new UserServiceError(data.message || 'Error desconocido al obtener el usuario');
      }
      throw new UserServiceError('No se pudo conectar con el servidor');
    }
  },

  async updateUser(userId: string, updatedUser: Partial<User>): Promise<User> {
    try {
      const response = await axiosInstance.put(`/users/${userId}`, updatedUser);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          throw new UserServiceError('Usuario no encontrado');
        }
        throw new UserServiceError(data.message || 'Error desconocido al actualizar el usuario');
      }
      throw new UserServiceError('No se pudo conectar con el servidor');
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      await axiosInstance.delete(`/users/${userId}`);
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          throw new UserServiceError('Usuario no encontrado');
        }
        throw new UserServiceError(data.message || 'Error desconocido al eliminar el usuario');
      }
      throw new UserServiceError('No se pudo conectar con el servidor');
    }
  },
};
