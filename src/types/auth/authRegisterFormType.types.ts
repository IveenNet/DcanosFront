export interface RegisterFormType {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  photo: File | null;
}
