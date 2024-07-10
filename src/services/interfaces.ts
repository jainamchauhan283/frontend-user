// Interface for API response format
export interface ApiResponse {
  status: boolean;
  data?: any;
  error?: string;
}

// Interface for user object
export interface User {
  _id: string;
  userName: string;
  userEmail: string;
}

// Interface for Login API response data
export interface LoginResponseData {
  user: User;
  accessToken: string;
}

// Interface for Logout API response
export interface LogoutResponse {
  status: boolean;
  error?: string;
}

// Interface for Task object
export interface Task {
  _id: string;
  taskName: string;
}

// Interface for Add Task Request Payload
export interface AddTaskRequest {
  taskName: string;
  accessToken: string;
}

// Interface for Update Task Request Payload
export interface UpdateTaskRequest {
  taskId: string;
  taskName: string;
  accessToken: string;
}
