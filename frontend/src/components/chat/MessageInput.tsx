"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { Message } from "@/lib/types/Message";

interface MessageInputProps {
  socket: any;
  receiver: number;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sessionId: string | null;
  userId: number;
}

const MessageInput = ({
  receiver,
  setMessages,
  sessionId,
  userId,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!receiver || message.trim() === "") return;

    if (receiver === -1) {
      setMessage("");

      const userMessage: Message = {
        id: Date.now(),
        from_id: userId,
        to_id: receiver,
        message,
        created_at: new Date(),
        updated_at: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      try {
        const response = await axiosInstance.post("/ai/ask-ai", {
          sessionId,
          prompt: message,
        });

        const aiMessage: Message = {
          id: Date.now() + 1,
          from_id: -1,
          to_id: 0,
          message: response.data.response,
          created_at: new Date(),
          updated_at: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("AI error:", error);
      }

      return;
    }

    try {
      const response = await axiosInstance.post(
        `/messages/send-message/${receiver}`,
        { message }
      );

      if (response.status === 200) {
        setMessages((prev) => [...prev, response.data.createdMessage]);
      }
    } catch (error) {
      console.error("Message sending error:", error);
    }

    setMessage("");
  };

  return (
    <div className="flex space-x-5 mx-auto">
      <Input
        className="flex-1"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
      />
      <Button className="cursor-pointer" onClick={sendMessage}>
        <Send />
      </Button>
    </div>
  );
};

export default MessageInput;
