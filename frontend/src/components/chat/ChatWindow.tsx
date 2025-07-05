"use client";

import { COLORS } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import Users from "./Users";
import Conversation from "./Conversation";
import MessageInput from "./MessageInput";
import axiosInstance from "@/lib/axiosInstance";
import { Message } from "@/lib/types/Message";

interface ChatWindowProps {
  socket: any;
}

const ChatWindow = ({ socket }: ChatWindowProps) => {
  const [receiver, setReceiver] = useState<number>(0);
  const [userId, setUserId] = useState<number>(-1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      let response = await axiosInstance.get("/auth/me");
      setUserId(response.data.id);

      response = await axiosInstance.get("/ai/get-session");
      setSessionId(response.data.sessionId);
    };

    fetchUser();
  }, []);

  return (
    <div
      className="w-3/4 h-4/5 rounded-2xl shadow-2xl shadow-neutral-700/40 flex overflow-hidden"
      style={{
        backgroundColor: COLORS.BLACK,
      }}
    >
      <div className="w-1/4 border-r border-neutral-800 p-4 overflow-y-auto">
        <Users
          setReceiver={setReceiver}
          socket={socket}
          userId={userId}
          receiver={receiver}
        />
      </div>
      <div className="w-3/4 flex flex-col justify-between p-4">
        <div className="flex-1 overflow-y-auto mb-4">
          <Conversation
            receiver={receiver}
            socket={socket}
            userId={userId}
            messages={messages}
            setMessages={setMessages}
            sessionId={sessionId}
          />
        </div>
        <div className="pt-4 border-t border-neutral-800">
          <MessageInput
            socket={socket}
            receiver={receiver}
            setMessages={setMessages}
            sessionId={sessionId}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
