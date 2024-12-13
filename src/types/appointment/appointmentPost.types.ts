export interface AppointmentPost {
  _id?: string,
  fecha_hora: string,
  peluquero_id: string,
  servicios: [string],
  notas: string,
};
