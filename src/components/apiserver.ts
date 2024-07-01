import axiosInstance from "./axiosInterceptors";

const baseUrl = process.env.REACT_APP_BASE_URL;

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// login user
export const loginUser = async (payload: any) => {
  console.log(baseUrl);
  payload = {
    userEmail: payload.email,
    userPassword: payload.password,
  };
  try {
    const response = await axiosInstance.post(`/users/login`, payload);
    return { status: true, data: response.data };
  } catch (error) {
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
    const response = await axiosInstance.post(
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
export const addTask = async (payload: any) => {
  try {
    const body = {
      taskName: payload.taskName,
    };
    const response = await axiosInstance.post(
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
export const updateTask = async (payload: any) => {
  const body = {
    taskId: payload.taskId,
    taskName: payload.taskName,
  };
  try {
    await axiosInstance.patch(`${baseUrl}/api/update/${body.taskId}`, body, {
      headers: {
        Authorization: `Bearer ${payload.accessToken}`,
      },
    });
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
