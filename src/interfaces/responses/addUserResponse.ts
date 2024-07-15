import { User } from "../models/User";

export interface UserAdd {
  message: string;
  user: User;
}

export type AddUserResponse = {
  status: boolean;
  data?: UserAdd;
  error?: string;
};
