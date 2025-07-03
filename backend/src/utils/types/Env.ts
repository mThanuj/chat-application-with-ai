import { number, z } from "zod";

export const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.string().transform(Number),
    FRONTEND: z.string().optional(),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_CALLBACK_URL: z.string(),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === "production" && !env.FRONTEND) {
      console.log(env);
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["FRONTEND"],
        message: "FRONTEND must be defined in production",
      });
    }
  });
