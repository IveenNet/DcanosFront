export interface DashboardHeaderProps {
  isMobile: boolean;
  onNewAppointment?: () => void;
  onLogout: () => void;
  userName: string;
  showNewAppointmentButton: boolean;
}
