import { Task } from "../models/Task";

export interface TaskDelete {
  message: string;
  data: Data;
}

export interface Data {
  task: Task;
}
