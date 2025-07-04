import jwt from "jsonwebtoken";
import { env } from "../config/Env";

export function signAccessToken(user: any) {
  const firstName = user.first_name[0].toUpperCase() + user.first_name.slice(1);
  const lastName = user.last_name[0].toUpperCase() + user.last_name.slice(1);

  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.displayName ? user.displayName : firstName + " " + lastName,
    },
    env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
}

export function signRefreshToken(user: any) {
  return jwt.sign({ sub: user.id }, env.JWT_SECRET, {
    expiresIn: "7d",
  });
}
