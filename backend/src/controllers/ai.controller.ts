import { Request, Response } from "express";
import { AuthUser } from "../utils/types/AuthUser";
import { prisma } from "../config/prisma";
import { askWithPersistence } from "../config/ai/chatService";

export const getSession = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as AuthUser).id;
    const activeSession = await prisma.aIChatSession.findFirst({
      where: {
        user_id: userId,
        active: true,
      },
    });

    if (activeSession) {
      res.json({ sessionId: activeSession.id });
      return;
    }

    const newSession = await prisma.aIChatSession.create({
      data: {
        user_id: userId,
      },
    });
    res.json({ sessionId: newSession.id });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const askAI = async (req: Request, res: Response) => {
  const { sessionId, prompt } = req.body;
  if (!sessionId || !prompt) {
    res.status(400).json({ error: "sessionId & prompt required" });
    return;
  }

  try {
    const response = await askWithPersistence(sessionId, prompt);

    await prisma.aIChat.create({
      data: {
        session_id: sessionId,
        prompt,
        response,
      },
    });

    res.json({ response });
  } catch (e) {
    console.error("ask error:", e);
    res.status(500).json({ error: "AI generation failed" });
  }
};

export const getPreviousMessages = async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.sessionId;
    const messages = await prisma.aIChat.findMany({
      where: {
        session_id: sessionId,
      },
    });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error });
  }
};
