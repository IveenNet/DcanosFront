import { Stylist } from "../../stylist/stylist.types";
import { Appointment, AppointmentFormState } from "../index";

export interface AppointmentDialogPropsCliente {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormState) => void;
  stylists: Stylist[];
  initialData?: Appointment; // Datos iniciales para edición
}
