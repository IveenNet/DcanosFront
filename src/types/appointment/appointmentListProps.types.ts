import { JSX } from "react";
import { Appointment } from "./index";

export interface Action {
  icon: JSX.Element; // Representa el ícono como un componente JSX
  handler: (appointment: Appointment) => void; // Función para manejar la acción
  hoverColor?: string; // Color del hover (opcional)
  title: string; // Título de la acción
  condition?: (appointment: Appointment) => boolean; // Condición para mostrar la acción (opcional)
}

export interface AppointmentListProps {
  appointments: Appointment[]; // Lista de citas
  onEdit: (appointment: Appointment) => void; // Función para editar una cita
  onDelete: (id: string) => void; // Función para eliminar una cita
  actions: Action[]; // Array de acciones
}
