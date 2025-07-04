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
}

const MessageInput = ({ receiver, setMessages }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!receiver) {
      return;
    }

    const response = await axiosInstance.post(
      "/messages/send-message/" + receiver,
      { message }
    );

    if (response.status === 200) {
      setMessages((prev) => [...prev, response.data.createdMessage]);
      setMessage("");
    }
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
