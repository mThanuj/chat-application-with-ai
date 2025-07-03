import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { AppError } from "./utils/types/Error";
import { env } from "./config/Env";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";

import "./config/passport/passport-local";
import "./config/passport/passport-jwt";
import "./config/passport/passport-google";

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin:
      env.NODE_ENV === "development" ? "http://localhost:3000" : env.FRONTEND,
    credentials: true,
  })
);
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(cookieParser());
app.use(passport.initialize());

import authRouter from "./routes/auth.route";

app.use("/auth", authRouter);

app.use((err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500).json({
    error: err.message,
  });
});

export default app;
