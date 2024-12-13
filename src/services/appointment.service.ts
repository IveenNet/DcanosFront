/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '../config/axios.config';
import { AppointmentPost } from '../types/appointment';
import { Appointment } from '../types/appointment/appointment.types';

export class AppointmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppointmentError';
  }
}

export const appointmentService = {
  async getAppointments(): Promise<Appointment[]> {
    try {

      const response = await axiosInstance.get('/appointments');
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          throw new AppointmentError('No autorizado para obtener las citas');
        }
        throw new AppointmentError(data.message || 'Error desconocido al obtener las citas');
      }
      throw new AppointmentError('No se pudo conectar con el servidor');
    }
  },

  async createAppointment(newAppointment: Partial<AppointmentPost>): Promise<Appointment> {
    try {
      const response = await axiosInstance.post('/appointments', newAppointment);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          throw new AppointmentError(data.message || 'Datos de la cita inválidos');
        }
        throw new AppointmentError(data.message || 'Error desconocido al crear la cita');
      }
      throw new AppointmentError('No se pudo conectar con el servidor');
    }
  },

  async editAppointment(updatedAppointment: AppointmentPost): Promise<Appointment> {
    try {
      const response = await axiosInstance.put(`/appointments/${updatedAppointment._id}`, updatedAppointment);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          throw new AppointmentError('Cita no encontrada');
        }
        throw new AppointmentError(data.message || 'Error desconocido al editar la cita');
      }
      throw new AppointmentError('No se pudo conectar con el servidor');
    }
  },

  async deleteAppointment(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/appointments/${id}`);
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          throw new AppointmentError('Cita no encontrada');
        }
        throw new AppointmentError(data.message || 'Error desconocido al eliminar la cita');
      }
      throw new AppointmentError('No se pudo conectar con el servidor');
    }
  },
};
