"use client";

import axiosInstance from "@/lib/axiosInstance";
import { SOCKET_EVENTS } from "@/lib/constants";
import { Message } from "@/lib/types/Message";
import React, { useEffect, useRef } from "react";

interface ConversationProps {
  receiver: number;
  socket: any;
  userId: number;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const Conversation = ({
  receiver,
  socket,
  userId,
  messages,
  setMessages,
}: ConversationProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axiosInstance.get(
        `/messages/previous-messages/${receiver}`
      );

      setMessages(response.data.messages);
    };

    if (receiver !== -1) {
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
            msg.fromId === userId
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
