import { toast } from "react-toastify";

export const showCustomToast = (
  message: string,
  type: "success" | "error" = "success"
) => {
  try {
    toast.dismiss();
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  } catch (error) {}
};

export const showErrorToast = (error: any, show = true) => {
  try {
    if (show) {
      showCustomToast(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong!",
        "error"
      );
    }
  } catch (error) {}
};
