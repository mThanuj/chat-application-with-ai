"use client";

import { COLORS } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import Users from "./Users";
import Conversation from "./Conversation";
import MessageInput from "./MessageInput";

interface ChatWindowProps {
  socket: any;
}

const ChatWindow = ({ socket }: ChatWindowProps) => {
  const [receiver, setReceiver] = useState<number>(-1);

  return (
    <div
      className="w-3/4 h-4/5 rounded-2xl shadow-2xl shadow-neutral-700/40 flex overflow-hidden"
      style={{
        backgroundColor: COLORS.BLACK,
      }}
    >
      <div className="w-1/4 border-r border-neutral-800 p-4 overflow-y-auto">
        <Users setReceiver={setReceiver} socket={socket} />
      </div>
      <div className="w-3/4 flex flex-col justify-between p-4">
        <div className="flex-1 overflow-y-auto mb-4">
          <Conversation receiver={receiver} socket={socket} />
        </div>
        <div className="pt-4 border-t border-neutral-800">
          <MessageInput socket={socket} receiver={receiver} />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
