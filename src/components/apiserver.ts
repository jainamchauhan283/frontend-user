import axios from "axios";

const baseUrl = "http://localhost:5000";

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
