import { User } from "../models/User";

export interface UserLogout {
  message: string;
  data: Data;
}

export interface Data {
  user: User;
  accessToken: string;
}
