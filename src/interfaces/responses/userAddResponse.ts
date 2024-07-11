import { User } from "../models/User";

export interface UserAdd {
  message: string;
  data: Data;
}

export interface Data {
  user: User;
}
