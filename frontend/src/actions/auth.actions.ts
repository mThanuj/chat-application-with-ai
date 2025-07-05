import axiosInstance from "@/lib/axiosInstance";
import { loginSchema, registerSchema } from "@/lib/schemas/auth.schema";
import { AuthReturnType } from "@/lib/types/AuthTypes";
import z from "zod";

export const loginWithGoogle = async () => {
  try {
    window.location.href = "http://localhost:3333/auth/google";
  } catch (error) {
    console.log(error);
  }
};

export const login = async (
  values: z.infer<typeof loginSchema>
): Promise<AuthReturnType> => {
  try {
    const response = await axiosInstance.post("/auth/login", values);
    const { accessToken } = response.data;

    localStorage.setItem("accessToken", accessToken);

    return {
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to submit the form. Please try again.",
      error: String(error),
    };
  }
};

export const register = async (
  values: z.infer<typeof registerSchema>
): Promise<AuthReturnType> => {
  try {
    const response = await axiosInstance.post("/auth/register", values);

    return {
      success: true,
      message: "Registration successful",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to submit the form. Please try again.",
      error: String(error),
    };
  }
};
