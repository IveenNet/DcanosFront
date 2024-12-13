export interface RegisterResponse {
  message: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
    photoUrl?: string;
  };
}

