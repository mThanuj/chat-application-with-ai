import { Request, Response } from "express";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
      },
    });

    res.json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`http://localhost:3000/auth/success?token=${accessToken}`);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken as string | undefined;

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
