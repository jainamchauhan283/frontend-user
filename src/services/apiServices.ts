import { TaskAdd } from "../interfaces/responses/taskAddResponse";
import { TaskDelete } from "../interfaces/responses/taskDeleteResponse";
import { TaskUpdate } from "../interfaces/responses/taskUpdateResponse";
import { UserAdd } from "../interfaces/responses/userAddResponse";
import {
  LoginPayload,
  LoginResponse,
} from "../interfaces/responses/loginResponse";
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
// export const loginUser = async (payload: {
//   email: string;
//   password: string;
// }): Promise<{ status: boolean; data?: UserLogin; error?: string }> => {
//   console.log(baseUrl);
//   const requestPayload = {
//     userEmail: payload.email,
//     userPassword: payload.password,
//   };
//   try {
//     const response = await axiosInstance.post<UserLogin>(
//       `/users/login`,
//       requestPayload
//     );
//     return { status: true, data: response.data };
//   } catch (error: any) {
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
// export const addUser = async (formData: FormData) => {
//   try {
//     const response = await axiosInstance.post(
//       `${baseUrl}/users/post`,
//       formData
//     );
//     return { status: true, data: response.data };
//   } catch (error: any) {
//     return { status: false, error: error.message };
//   }
// };
export const addUser = async (
  formData: FormData
): Promise<{ status: boolean; data?: UserAdd; error?: string }> => {
  try {
    const response = await axiosInstance.post<UserAdd>(
      `${baseUrl}/users/post`,
      formData
    );
    return { status: true, data: response.data };
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
// export const addTask = async (payload: any) => {
//   try {
//     const body = {
//       taskName: payload.taskName,
//     };
//     const response = await axiosInstance.post(
//       `${baseUrl}/api/post/tasks`,
//       body,
//       {
//         headers: {
//           Authorization: `Bearer ${payload.accessToken}`,
//         },
//       }
//     );
//     return { status: true, data: response.data };
//   } catch (error) {
//     return { status: false, error: getErrorMessage(error) };
//   }
// };
export const addTask = async (payload: {
  taskName: string;
  accessToken: string;
}): Promise<{ status: boolean; data?: TaskAdd; error?: string }> => {
  try {
    const body = { taskName: payload.taskName };
    const response = await axiosInstance.post<TaskAdd>(
      `${baseUrl}/api/post/tasks`,
      body,
      {
        headers: {
          Authorization: `Bearer ${payload.accessToken}`,
        },
      }
    );
    return { status: true, data: response.data };
  } catch (error: any) {
    return { status: false, error: getErrorMessage(error) };
  }
};

// Update task
// export const updateTask = async (payload: any) => {
//   const body = {
//     taskId: payload.taskId,
//     taskName: payload.taskName,
//   };
//   try {
//     await axiosInstance.patch(`${baseUrl}/api/update/${body.taskId}`, body, {
//       headers: {
//         Authorization: `Bearer ${payload.accessToken}`,
//       },
//     });
//     return { status: true };
//   } catch (error) {
//     return { status: false, error: getErrorMessage(error) };
//   }
// };
export const updateTask = async (payload: {
  taskId: string;
  taskName: string;
  accessToken: string;
}): Promise<{ status: boolean; data?: TaskUpdate; error?: string }> => {
  const body = {
    taskId: payload.taskId,
    taskName: payload.taskName,
  };
  try {
    const response = await axiosInstance.patch<TaskUpdate>(
      `${baseUrl}/api/update/${body.taskId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${payload.accessToken}`,
        },
      }
    );
    return { status: true, data: response.data };
  } catch (error: any) {
    return { status: false, error: getErrorMessage(error) };
  }
};

// Delete task
// export const deleteTask = async (payload: any) => {
//   try {
//     await axiosInstance.delete(`${baseUrl}/api/delete/${payload.taskId}`, {
//       headers: {
//         Authorization: `Bearer ${payload.accessToken}`,
//       },
//     });
//     return { status: true };
//   } catch (error) {
//     return { status: false, error: getErrorMessage(error) };
//   }
// };
export const deleteTask = async (payload: {
  taskId: string;
  accessToken: string;
}): Promise<{ status: boolean; data?: TaskDelete; error?: string }> => {
  try {
    const response = await axiosInstance.delete<TaskDelete>(
      `${baseUrl}/api/delete/${payload.taskId}`,
      {
        headers: {
          Authorization: `Bearer ${payload.accessToken}`,
        },
      }
    );
    return { status: true, data: response.data };
  } catch (error: any) {
    return { status: false, error: getErrorMessage(error) };
  }
};
