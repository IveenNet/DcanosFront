import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectWebSocket = (
  token: string,
  onAppointmentUpdated: (data: any) => void,
  onAppointmentCreated: (data: any) => void,
  onAppointmentDeleted: (data: any) => void
): Socket => {
  if (!socket) {
    socket = io('https://dcanosestilistas.onrender.com', {
      auth: { token },
      transports: ['websocket'], // Asegúrate de usar WebSocket
    });

    socket.on('connect', () => {
      console.log('Conectado al WebSocket con ID:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Desconectado del WebSocket');
    });

    socket.on('appointment-updated', (data) => {
      console.log('Cita actualizada:', data);
      onAppointmentUpdated(data);
    });

    socket.on('appointment-created', (data) => {
      console.log('Nueva cita creada:', data);
      onAppointmentCreated(data);
    });

    socket.on('appointment-deleted', (data) => {
      console.log('Cita eliminada:', data);
      onAppointmentDeleted(data);
    });
  }

  return socket;
};

export const disconnectWebSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
