import { Specialties } from "../stylist/specialties.types";

export interface User {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  foto_url?: string;
  rol: 'peluquero' | 'cliente' | 'admin',
  detalles: {
    especialidades: Specialties[];
    horarios: Array<{
      dia: string;
      inicio: string;
      fin: string;
    }>;
  };
  activo: boolean;
  fecha_registro: string;
}
