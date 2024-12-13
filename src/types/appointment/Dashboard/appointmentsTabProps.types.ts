import { JSX } from "react";
import { Appointment } from "../index";

export interface Action {
  icon: JSX.Element;
  handler: (appointment: Appointment) => void;
  hoverColor?: string;
  title: string;
  condition?: (appointment: Appointment) => boolean;
}

export interface AppointmentsTabProps {
  tabValue: number;
  setTabValue: (value: number) => void;
  filterAppointments: () => Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
  actions: Action[];
}
