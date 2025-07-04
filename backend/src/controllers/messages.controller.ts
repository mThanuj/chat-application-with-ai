import { Request, Response } from "express";
import { AuthUser } from "../utils/types/AuthUser";
import { prisma } from "../config/prisma";
import { users } from "../server";
import { SOCKET_EVENTS } from "../constants";

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

    if (!toId || !message) {
      res.status(400).json({ error: "Missing recipient or message" });
      return;
    }

    const createdMessage = await prisma.message.create({
      data: {
        fromId,
        toId,
        message,
      },
    });
    users.get(toId)?.emit(SOCKET_EVENTS.MESSAGE.RECEIVE, createdMessage);

    res.json({ createdMessage });
  } catch (error) {
    res.status(500).json({ error });
  }
};
