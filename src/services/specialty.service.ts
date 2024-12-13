/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '../config/axios.config';
import { Specialties } from '../types/stylist/specialties.types';

export class SpecialtyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SpecialtyError';
  }
}

export const specialtyService = {
  async getSpecialtiesByHairdresser(id: string): Promise<Specialties[]> {
    try {
      const response = await axiosInstance.get(`/specialties/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          throw new SpecialtyError('Peluquero no encontrado');
        }
        throw new SpecialtyError(data.message || 'Error desconocido al obtener las especialidades');
      }
      throw new SpecialtyError('No se pudo conectar con el servidor');
    }
  },
};
