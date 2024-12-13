import { Specialties } from "../../stylist/specialties.types";
import { Appointment } from "../appointment.types";
import { AppointmentFormState } from "../Client/appointmentFormState.types";

export interface appointmentDialogPropsHairdress {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormState) => void;
  services: Specialties[];
  initialData?: Appointment; // Datos iniciales para edición
}
