// Interface for user object
export interface User {
  _id: string;
  userName: string;
  userEmail: string;
}

// Interface for Task object
export interface Task {
  _id: string;
  taskName: string;
}

// Interface for API response format
export interface ApiResponse {
  status: boolean;
  data?: any;
  error?: string;
}
