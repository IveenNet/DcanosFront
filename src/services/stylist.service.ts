/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '../config/axios.config';
import { Stylist } from '../types/stylist/stylist.types';

export class StylistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StylistError';
  }
}

// Almacena estilistas en memoria temporal para reducir solicitudes repetidas
let stylistCache: Stylist[] | null = null;

export const stylistService = {
  async getStylists(forceRefresh = false): Promise<Stylist[]> {
    if (!forceRefresh && stylistCache) {
      return stylistCache || [];
    }

    try {
      const response = await axiosInstance.get('/stylist');
      stylistCache = response.data;
      return stylistCache || [];
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          throw new StylistError('No autorizado para obtener los estilistas');
        }
        if (status === 404) {
          throw new StylistError('No se encontraron estilistas');
        }
        throw new StylistError(data.message || 'Error desconocido al obtener los estilistas');
      }
      throw new StylistError('No se pudo conectar con el servidor');
    }
  },
};
