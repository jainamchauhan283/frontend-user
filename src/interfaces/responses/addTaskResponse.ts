// Models
import { Task } from "../models/Task";

export interface TaskAdd {
  message: string;
  task: Task;
}

export type AddTaskResponse = {
  status: boolean;
  data?: TaskAdd;
  error?: string;
};
