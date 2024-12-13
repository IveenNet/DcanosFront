import { z } from 'zod';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const registerSchema = z.object({
  fullName: z.string()
    .min(1, 'El nombre completo es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string()
    .min(1, 'Debe confirmar la contraseña'),
  phone: z.string()
    .min(1, 'El teléfono es requerido')
    .regex(/^\+?[0-9]{9,}$/, 'Número de teléfono inválido'),
  photo: z.custom<File>()
    .refine((file) => file !== null, 'La foto es requerida')
    .refine((file) => file?.size <= MAX_FILE_SIZE, 'El tamaño máximo es 1MB')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Solo se permiten archivos .jpg, .jpeg, .png y .webp'
    )
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});
