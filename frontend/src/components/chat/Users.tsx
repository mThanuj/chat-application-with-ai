"use client";

import { COLORS, SOCKET_EVENTS } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Button } from "../ui/button";

interface UsersProps {
  receiver: number;
  setReceiver: React.Dispatch<React.SetStateAction<number>>;
  socket: Socket | null;
  userId: number;
}

const Users = ({ setReceiver, socket, userId, receiver }: UsersProps) => {
  const [onlineUsers, setOnlineUsers] = useState<[number, string][]>([]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleOnlineUsers = (data: [number, string][]) => {
      setOnlineUsers(data);
    };

    socket.on(SOCKET_EVENTS.USER.ONLINE_USERS, handleOnlineUsers);

    return () => {
      socket.off(SOCKET_EVENTS.USER.ONLINE_USERS, handleOnlineUsers);
    };
  }, [socket]);

  return (
    <div>
      <h2
        className="text-xl font-bold mb-4 cursor-pointer"
        onClick={() => setReceiver(0)}
      >
        Online Users
      </h2>
      <div className="flex flex-col space-y-2">
        <Button
          key={-1}
          onClick={() => setReceiver(-1)}
          className="w-full justify-start"
          variant="outline"
          style={{
            color: receiver === -1 ? COLORS.WHITE : COLORS.GREEN,
            backgroundColor: receiver === -1 ? COLORS.PURPLE : "",
          }}
        >
          AI Chatbot
        </Button>
        {onlineUsers.map(
          (item) =>
            item[0] !== userId && (
              <Button
                key={item[0]}
                onClick={() => setReceiver(item[0])}
                className="w-full justify-start"
                variant="outline"
                style={{
                  color: receiver === item[0] ? COLORS.WHITE : COLORS.GREEN,
                  backgroundColor: receiver === item[0] ? COLORS.PURPLE : "",
                }}
              >
                {item[1]}
              </Button>
            )
        )}
      </div>
    </div>
  );
};

export default Users;
