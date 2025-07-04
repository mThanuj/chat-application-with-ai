"use client";

import { COLORS, SOCKET_EVENTS } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Button } from "../ui/button";

interface UsersProps {
  setReceiver: React.Dispatch<React.SetStateAction<number>>;
  socket: Socket | null;
}

const Users = ({ setReceiver, socket }: UsersProps) => {
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
      <h2 className="text-xl font-bold mb-4">Online Users</h2>
      <div className="flex flex-col space-y-2">
        {onlineUsers.map((item) => (
          <Button
            key={item[0]}
            onClick={() => setReceiver(item[0])}
            className="w-full justify-start"
            variant="outline"
            style={{
              color: COLORS.GREEN,
            }}
          >
            {item[1]}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Users;
