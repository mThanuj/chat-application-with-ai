import { z } from "zod";

export const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(1).max(50),
});

export const registerSchema = z.object({
  firstName: z.string().min(1).min(1).max(100),
  lastName: z.string().min(1).min(1).max(100),
  email: z.string(),
  password: z.string().min(1).min(1).max(50),
});
