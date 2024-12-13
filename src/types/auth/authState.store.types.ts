import { LoginFormType } from "./authLoginFormType.types";
import { User } from "./authUser.store.types";

export interface AuthState {
  token: string | null;
  user: User | null;
  error: string | null;
  message: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginFormType) => Promise<void>;
  logout: () => Promise<void>;
}
