// Models
import { User } from "../models/User";

export interface UserLogin {
  message: string;
  user: User;
  accessToken: string;
}

export type LoginResponse = {
  status: boolean;
  data?: UserLogin;
  error?: string;
};
