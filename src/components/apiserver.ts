import axios from "axios";

const baseUrl = "http://localhost:5000";

// login user
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${baseUrl}/users/login`, {
      userEmail: email,
      userPassword: password,
    });
    return { status: true, data: response.data };
  } catch (error: any) {
    return { status: false, error: error.message };
  }
};

// logout user
export const logoutUser = async (accessToken: string) => {
  try {
    await axios.post(
      `${baseUrl}/users/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return { status: true };
  } catch (error: any) {
    return { status: false, error: error.message };
  }
};

// add user
export const addUser = async (formData: FormData) => {
  try {
    const response = await axios.post(`${baseUrl}/users/post`, formData);
    return { status: true, data: response.data };
  } catch (error: any) {
    return { status: false, error: error.message };
  }
};

// Fetch  tasks
export const fetchTasks = async (accessToken: string) => {
  try {
    const response = await axios.get(`${baseUrl}/api/get/tasks`, {
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
export const addTask = async (taskName: string, accessToken: string) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/post/tasks`,
      { taskName },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return { status: true, data: response.data };
  } catch (error: any) {
    return { status: false, error: error.message };
  }
};

export const updateTask = async (
  taskId: string,
  taskName: string,
  accessToken: string
) => {
  try {
    await axios.patch(
      `${baseUrl}/api/update/${taskId}`,
      { taskName },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return { status: true };
  } catch (error: any) {
    return { status: false, error: error.message };
  }
};

// Delete task
export const deleteTask = async (taskId: string, accessToken: string) => {
  try {
    await axios.delete(`${baseUrl}/api/delete/${taskId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { status: true };
  } catch (error: any) {
    return { status: false, error: error.message };
  }
};
