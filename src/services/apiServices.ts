import { AddTaskPayload } from "../interfaces/payload/addTaskPayload";
import { EditTaskPayload } from "../interfaces/payload/editTaskPayload";
import { LoginPayload } from "../interfaces/payload/loginPayload";
import { AddTaskResponse } from "../interfaces/responses/addTaskResponse";
import { AddUserResponse } from "../interfaces/responses/addUserResponse";
import { EditTaskResponse } from "../interfaces/responses/editTaskResponse";
import { LoginResponse } from "../interfaces/responses/loginResponse";
import axiosInstance from "./api";

const baseUrl = process.env.REACT_APP_BASE_URL;

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// login user
// export const loginUser = async (payload: any) => {
//   console.log(baseUrl);
//   payload = {
//     userEmail: payload.email,
//     userPassword: payload.password,
//   };
//   try {
//     const response = await axiosInstance.post(`/users/login`, payload);
//     return { status: true, data: response.data };
//   } catch (error) {
//     return { status: false, error: getErrorMessage(error) };
//   }
// };
export const loginUser = async (payload: LoginPayload) => {
  const requestPayload = {
    userEmail: payload.email,
    userPassword: payload.password,
  };

  try {
    console.log("Sending login request with payload:", requestPayload);
    const response = await axiosInstance.post<LoginResponse>(
      `/users/login`,
      requestPayload
    );
    console.log("Login response data:", response.data);

    // Ensure response.data matches the expected format
    if (response.data && response.data.data) {
      return { status: true, data: response.data.data };
    } else {
      console.error("Unexpected response format:", response.data);
      return { status: false, error: "Unexpected response format" };
    }
  } catch (error: any) {
    console.error("Login error:", error);
    return { status: false, error: getErrorMessage(error) };
  }
};

// logout user
export const logoutUser = async (payload: any) => {
  const headers = {
    Authorization: `Bearer ${payload.accessToken}`,
  };
  try {
    await axiosInstance.post(`${baseUrl}/users/logout`, {}, { headers });
    return { status: true };
  } catch (error: any) {
    return { status: false, error: error.message };
  }
};

// add user
export const addUser = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post<AddUserResponse>(
      `${baseUrl}/users/post`,
      formData
    );
    // return { status: true, data: response.data };
    if (response.data) {
      return { status: true, data: response.data };
    } else {
      return { status: false, error: "Unexpected response format" };
    }
  } catch (error: any) {
    return { status: false, error: error.message };
  }
};

// Fetch  tasks
export const fetchTasks = async (accessToken: string) => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/api/get/tasks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { status: true, data: response.data };
  } catch (error: any) {
    return { status: false, error: error.message };
  }
};

// Add task
export const addTask = async (payload: AddTaskPayload) => {
  try {
    const body = {
      taskName: payload.taskName,
    };
    const response = await axiosInstance.post<AddTaskResponse>(
      `${baseUrl}/api/post/tasks`,
      body,
      {
        headers: {
          Authorization: `Bearer ${payload.accessToken}`,
        },
      }
    );
    return { status: true, data: response.data };
  } catch (error) {
    return { status: false, error: getErrorMessage(error) };
  }
};

// Update task
export const updateTask = async (payload: EditTaskPayload) => {
  const body = {
    taskId: payload.taskId,
    taskName: payload.taskName,
  };
  try {
    await axiosInstance.patch<EditTaskResponse>(
      `${baseUrl}/api/update/${body.taskId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${payload.accessToken}`,
        },
      }
    );
    return { status: true };
  } catch (error) {
    return { status: false, error: getErrorMessage(error) };
  }
};

// Delete task
export const deleteTask = async (payload: any) => {
  try {
    await axiosInstance.delete(`${baseUrl}/api/delete/${payload.taskId}`, {
      headers: {
        Authorization: `Bearer ${payload.accessToken}`,
      },
    });
    return { status: true };
  } catch (error) {
    return { status: false, error: getErrorMessage(error) };
  }
};
