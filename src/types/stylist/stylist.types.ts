// stylist.types.ts
import { Specialties } from "./specialties.types";

export interface Stylist {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  foto_url?: string;
  rol: 'peluquero';
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
