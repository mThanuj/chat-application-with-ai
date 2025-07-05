import { Ollama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { prisma } from "../prisma";
import { env } from "../Env";

const llm = new Ollama({
  model: env.OLLAMA_MODEL,
  temperature: 0.5,
  maxRetries: 1,
  verbose: true,
});

type PromptVars = { history: string; input: string };
const chatPrompt = PromptTemplate.fromTemplate<PromptVars>(
  `This is a conversation between a user and an AI assistant. Respond concisely.

{history}
User: {input}
AI:`
);

export async function askWithPersistence(sessionId: string, userInput: string) {
  const historyChats = await prisma.aIChat.findMany({
    where: { session_id: sessionId },
    orderBy: { created_at: "asc" },
    take: 50,
  });

  const history = historyChats
    .map((c) => `User: ${c.prompt}\nAI: ${c.response}`)
    .join("\n");

  const fullPrompt = await chatPrompt.format({ history, input: userInput });

  const llmResult = await llm.invoke(fullPrompt);

  return llmResult;
}
