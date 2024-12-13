import { Specialties } from "../stylist/specialties.types";
import { Stylist } from "../stylist/stylist.types";

export interface Appointment<T = Stylist, U = string, Z = Specialties> {
  _id: string;
  entity: T;
  relatedEntityId: U;
  servicios: Z[];
  fecha_hora: string;
  estado: 'pendiente' | 'completada';
  notas?: string;
  __v: number;
}
