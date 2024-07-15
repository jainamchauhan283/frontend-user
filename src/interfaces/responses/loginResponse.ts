import { User } from "../models/UserModel";

export interface UserLogin {
  message: string;
  user: User;
  accessToken: string;
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  status: boolean;
  data?: UserLogin;
  error?: string;
};
