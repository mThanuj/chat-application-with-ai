"use client";

import { SOCKET_EVENTS } from "@/lib/constants";
import React, { useEffect, useState } from "react";

interface ConversationProps {
  receiver: number;
  socket: any;
}

const Conversation = ({ receiver, socket }: ConversationProps) => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {}, [receiver]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on(SOCKET_EVENTS.MESSAGE.RECEIVE, (data: string) => {
      console.log(data);
    });
  }, [socket]);

  return (
    <div>
      <div>Conversation</div>
    </div>
  );
};

export default Conversation;
