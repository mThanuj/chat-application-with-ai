import jwt from "jsonwebtoken";
import { env } from "../config/Env";

export function signAccessToken(user: any) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );
}

export function signRefreshToken(user: any) {
  return jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
}
