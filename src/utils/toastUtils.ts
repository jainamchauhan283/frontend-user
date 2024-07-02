import { toast } from "react-hot-toast";

// export const showToast = (
//   message: string,
//   type: "success" | "error" | "info" = "info",
//   duration: number = 2000
// ) => {
//   switch (type) {
//     case "success":
//       toast.success(message, { duration });
//       break;
//     case "error":
//       toast.error(message, { duration });
//       break;
//     default:
//       toast(message, { duration });
//       break;
//   }
// };

export const showSuccessToast = (message: string, duration: number = 2000) => {
  toast.success(message, { duration });
};

export const showErrorToast = (message: string, duration: number = 2000) => {
  toast.error(message, { duration });
};
