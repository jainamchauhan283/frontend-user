import { toast } from "react-hot-toast";

export const showSuccessToast = (message: string, duration: number = 2000) => {
  toast.success(message, { duration });
};

export const showErrorToast = (message: string, duration: number = 2000) => {
  toast.error(message, { duration });
};

export const logToConsole = (message: string, data?: any) => {
  if (data) {
    console.log(message, data);
  } else {
    console.log(message);
  }
};