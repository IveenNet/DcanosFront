import { useEffect, useState } from "react";
import { appointmentService } from "../services/appointment.service";
import { AppointmentPost } from "../types/appointment";
import { Appointment } from "../types/appointment/appointment.types";
import { connectWebSocket, disconnectWebSocket } from "../utils/websocket";

export const useAppointments = (token: string | null) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (error: any) {
      console.error("Error fetching appointments:", error);
      setError("No se pudo consultar las citas");
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (newAppointment: Partial<AppointmentPost>) => {
    setError(null);
    try {
      const createdAppointment = await appointmentService.createAppointment(newAppointment);
      setAppointments((prevAppointments) => [...prevAppointments, createdAppointment]);
    } catch (error) {
      console.error("Error creating appointment:", error);
      setError("Error creating appointment");
    }
  };

  const editAppointment = async (updatedAppointment: AppointmentPost) => {
    setError(null);
    try {
      const updated = await appointmentService.editAppointment(updatedAppointment);
      setAppointments((prevAppointments) =>
        prevAppointments.map((apt) => (apt._id === updated._id ? updated : apt))
      );
    } catch (error) {
      console.error("Error editing appointment:", error);
      setError("Error editing appointment");
    }
  };

  const deleteAppointment = async (appointment: Appointment) => {
    setError(null);
    try {
      await appointmentService.deleteAppointment(appointment._id);
      setAppointments((prevAppointments) => prevAppointments.filter((apt) => apt._id !== appointment._id));
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setError("Error deleting appointment");
    }
  };

  // Integrar WebSocket
  useEffect(() => {
    if (!token) return;

    const socket = connectWebSocket(
      token,
      (updatedAppointment) => {
        console.log('Cita actualizada recibida desde WebSocket:', updatedAppointment);
        setAppointments((prevAppointments) =>
          prevAppointments.map((apt) =>
            apt._id === updatedAppointment._id ? updatedAppointment : apt
          )
        );
      },
      (newAppointment) => {
        console.log('Nueva cita recibida desde WebSocket:', newAppointment);
        setAppointments((prevAppointments) => [...prevAppointments, newAppointment]);
      },
      (deletedAppointment) => {
        console.log('Cita eliminada recibida desde WebSocket:', deletedAppointment);
        setAppointments((prevAppointments) =>
          prevAppointments.filter((apt) => apt._id !== deletedAppointment.appointment_id)
        );
      }
    );

    return () => {
      disconnectWebSocket();
    };
  }, [token]);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    editAppointment,
    deleteAppointment,
  };
};
