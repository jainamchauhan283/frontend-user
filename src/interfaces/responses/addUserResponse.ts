import { User } from "../models/UserModel";

export interface UserAdd {
  message: string;
  user: User;
}

export type AddUserResponse = {
  status: boolean;
  data?: UserAdd;
  error?: string;
};
