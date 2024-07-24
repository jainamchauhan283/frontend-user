// Models
import { Payment } from "../models/Payment";
import { User } from "../models/User";

export interface UserLogin {
  message: string;
  user: User;
  accessToken: string;
  payment: Payment;
}

export type LoginResponse = {
  status: boolean;
  data?: UserLogin;
  error?: string;
};
