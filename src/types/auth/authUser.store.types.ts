import { Specialties } from "../stylist/specialties.types";

export interface Detalles {
  especialidades?: Specialties[];
  horarios?: Array<{
    dia: string;
    inicio: string;
    fin: string;
  }>;
}

export interface User {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  foto_url?: string;
  rol: 'admin' | 'peluquero' | 'cliente';
  detalles?: Detalles;
  activo: boolean;
  fecha_registro: string;
}
