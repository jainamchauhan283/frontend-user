import { Task } from "../models/Task";

export interface TaskAdd {
  message: string;
  data: Data;
}

export interface Data {
  task: Task;
}
