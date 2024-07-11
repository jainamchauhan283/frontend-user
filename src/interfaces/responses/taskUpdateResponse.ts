import { Task } from "../models/Task";

export interface TaskUpdate {
  message: string;
  data: Data;
}

export interface Data {
  task: Task;
}
