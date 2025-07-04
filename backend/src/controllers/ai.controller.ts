import { Request, Response } from "express";
import { AuthUser } from "../utils/types/AuthUser";
import { prisma } from "../config/prisma";
import ollama from "ollama";
import { env } from "../config/Env";

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

    const aiMessages = await prisma.aIChat.findMany({
      where: { session_id: sessionId },
      orderBy: { created_at: "asc" },
      take: 50,
    });

    const fullContext = aiMessages
      .map((m) => `User: ${m.prompt}\nAI: ${m.response}`)
      .join("\n\n");
    let windowedContext =
      fullContext.length > 4000
        ? fullContext.slice(fullContext.length - 4000)
        : fullContext;

    if (aiMessages.length > 20) {
      const summaryResp = await ollama.chat({
        model: env.OLLAMA_MODEL,
        messages: [
          {
            role: "system",
            content:
              "Summarize the following conversation briefly:\n" +
              windowedContext,
          },
        ],
        options: { num_predict: 80, temperature: 0.2 },
      });
      windowedContext = summaryResp.message.content;
    }

    const messages: { role: string; content: string }[] = [];
    if (windowedContext) {
      messages.push({ role: "system", content: windowedContext });
    }
    const userPrompt = `Answer in 5 short, complete sentences: ${prompt}`;
    messages.push({ role: "user", content: userPrompt });

    const response = await ollama.chat({
      model: env.OLLAMA_MODEL,
      messages,
      options: {
        num_predict: 80,
        temperature: 0.2,
        top_p: 0.9,
        top_k: 40,
        num_thread: 8,
      },
    });

    await prisma.aIChat.create({
      data: {
        session_id: sessionId,
        prompt: userPrompt,
        response: response.message.content,
      },
    });

    console.log(response);

    res.json({ response: response.message.content });
  } catch (error) {
    console.error("askAI error:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
};
