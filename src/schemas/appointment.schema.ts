import { z } from 'zod';

export const appointmentSchema = z.object({
  date: z
    .string()
    .refine((date) => {
      const inputDate = new Date(date);
      const now = new Date();
      return inputDate >= now;
    }, { message: "La fecha debe ser posterior" })
    .refine((date) => {
      const minutes = new Date(date).getMinutes();
      return minutes % 5 === 0;
    }, { message: "Los minutos deben ser múltiplos de 5" }),
  stylist: z.string().min(1, "Selecciona un peluquero"),
  service: z.string().min(1, "Selecciona un servicio"),
  note: z.string().max(100, "La nota debe tener como máximo 100 caracteres"),
});
