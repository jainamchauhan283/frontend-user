// Payload
import { AddTaskPayload } from "../interfaces/payload/addTaskPayload";
import { EditTaskPayload } from "../interfaces/payload/editTaskPayload";
import { LoginPayload } from "../interfaces/payload/loginPayload";
// Responses
import { AddTaskResponse } from "../interfaces/responses/addTaskResponse";
import { AddUserResponse } from "../interfaces/responses/addUserResponse";
import { EditTaskResponse } from "../interfaces/responses/editTaskResponse";
import { LoginResponse } from "../interfaces/responses/loginResponse";
// Utils
import { getErrorMessage } from "../utils/errorUtils";
// Services
import axiosInstance from "./api";

const baseUrl = process.env.REACT_APP_BASE_URL;

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
  } catch (error) {
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
  } catch (error) {
    return { status: false, error: getErrorMessage(error) };
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
  } catch (error) {
    return { status: false, error: getErrorMessage(error) };
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
  } catch (error) {
    return { status: false, error: getErrorMessage(error) };
  }
};

// Add task
export const addTask = async (payload: AddTaskPayload) => {
  try {
    const body = {
      taskName: payload.taskName,
      taskDescription: payload.taskDescription,
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
    taskDescription: payload.taskDescription,
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

// find user and payment
export const fetchUserAndPayment = async (accessToken: string) => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/users/findone`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return {
      user: response.data.user,
      payment: response.data.payment,
    };
  } catch (error) {
    console.error("Error fetching user and payment:", error);
    throw new Error(getErrorMessage(error));
  }
};

// Function to create a new payment order
export const createOrder = async (accessToken: any, amount: any) => {
  try {
    const { data } = await axiosInstance.post(
      `${baseUrl}/payments/create`,
      { amount },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data.data; // Assuming data.data contains { amount, id, currency }
  } catch (error) {
    throw error; // Handle errors in the calling function
  }
};

// Function to verify the payment
export const verifyPayment = async (accessToken: any, paymentData: any) => {
  try {
    const { data } = await axiosInstance.post(
      `${baseUrl}/payments/verify`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data; // Assuming your backend returns success/failure response
  } catch (error) {
    throw error; // Handle errors in the calling function
  }
};
