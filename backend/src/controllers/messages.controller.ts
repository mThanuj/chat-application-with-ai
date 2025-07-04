import { Request, Response } from "express";
import { AuthUser } from "../utils/types/AuthUser";
import { prisma } from "../config/prisma";

export const previousMessages = async (req: Request, res: Response) => {
  try {
    const primaryUserId = (req.user as AuthUser).id;
    const secondaryUserId = Number(req.params.id);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            toId: primaryUserId,
            fromId: secondaryUserId,
          },
          {
            toId: secondaryUserId,
            fromId: primaryUserId,
          },
        ],
      },
      orderBy: {
        created_at: "asc",
      },
    });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const fromId = (req.user as AuthUser).id;
    const toId = Number(req.params.id);
    const { message } = req.body;

    await prisma.message.create({
      data: {
        fromId,
        toId,
        message,
      },
    });

    res.json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
