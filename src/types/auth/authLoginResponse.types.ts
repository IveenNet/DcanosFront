import { User } from "./authUser.store.types";

export interface LoginResponse {
  message: string;
  token: string;
  user: User
}
