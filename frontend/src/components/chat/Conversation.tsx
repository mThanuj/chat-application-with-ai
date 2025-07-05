"use client";

import axiosInstance from "@/lib/axiosInstance";
import { SOCKET_EVENTS } from "@/lib/constants";
import { AIMessage, Message } from "@/lib/types/Message";
import React, { useEffect, useRef } from "react";

interface ConversationProps {
  receiver: number;
  socket: any;
  userId: number;
  messages: Message[];
  sessionId: string | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const Conversation = ({
  receiver,
  socket,
  userId,
  messages,
  sessionId,
  setMessages,
}: ConversationProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (receiver === -1) {
        const response = await axiosInstance.get(
          `/ai/get-previous-messages/${sessionId}`
        );
        const currentMessages: AIMessage[] = response.data.messages;
        const modifiedMessages: Message[] = [];

        for (const message of currentMessages) {
          modifiedMessages.push({
            id: `${message.id}-user`,
            created_at: message.created_at,
            updated_at: message.updated_at,
            from_id: userId,
            to_id: -1,
            message: message.prompt,
          });

          modifiedMessages.push({
            id: `${message.id}-ai`,
            created_at: message.created_at,
            updated_at: message.updated_at,
            from_id: -1,
            to_id: userId,
            message: message.response,
          });
        }

        setMessages(modifiedMessages);

        return;
      }

      const response = await axiosInstance.get(
        `/messages/previous-messages/${receiver}`
      );

      setMessages(response.data.messages);
    };

    if (receiver !== 0) {
      fetchMessages();
    }
  }, [receiver]);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on(SOCKET_EVENTS.MESSAGE.RECEIVE, handleReceive);
  }, [socket]);

  return (
    <div className="flex flex-col gap-2 p-4 max-h-[70vh] overflow-y-auto">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`max-w-[70%] p-3 rounded-lg text-sm ${
            msg.from_id === userId
              ? "bg-blue-600 text-white self-end"
              : "bg-gray-200 text-black self-start"
          }`}
        >
          {msg.message}
          <div className="text-[10px] text-right opacity-60 mt-1">
            {new Date(msg.created_at).toLocaleTimeString()}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Conversation;
