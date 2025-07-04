import { Request, Response } from "express";
import { AuthUser } from "../utils/types/AuthUser";
import { prisma } from "../config/prisma";
import ollama from "ollama";

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
  try {
    const { sessionId, prompt } = req.body;
    if (!sessionId || !prompt) {
      res.status(400).json({ error: "Missing sessionId or prompt" });
      return;
    }

    const messages: { role: string; content: string }[] = [];
    const aiMessages = await prisma.aIChat.findMany({
      where: {
        session_id: sessionId,
      },
      orderBy: {
        created_at: "asc",
      },
      take: 10,
    });

    for (const message of aiMessages) {
      messages.push({ role: "user", content: message.prompt });
      messages.push({ role: "assistant", content: message.response });
    }

    const newPrompt = `Answer in 5 short sentences: ${prompt}`;
    messages.push({ role: "user", content: newPrompt });

    console.log(messages);

    const response = await ollama.chat({
      model: "llama3.1",
      messages,
      options: {
        num_predict: 50,
        temperature: 0.7,
      },
    });

    await prisma.aIChat.create({
      data: {
        session_id: sessionId,
        prompt: newPrompt,
        response: response.message.content,
      },
    });

    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI generation failed" });
  }
};
