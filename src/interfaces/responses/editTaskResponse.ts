// Models
import { Task } from "../models/Task";

export interface TaskEdit {
  message: string;
  task: Task;
}

export type EditTaskResponse = {
  status: boolean;
  error?: string;
};
