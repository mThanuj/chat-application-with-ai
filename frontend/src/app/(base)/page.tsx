"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { SOCKET_EVENTS } from "@/lib/constants";
import { toast } from "sonner";
import ChatWindow from "@/components/chat/ChatWindow";
import { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";

const Home = () => {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = getSocket();
    setSocket(socket);

    socket.on(SOCKET_EVENTS.BASE.CONNECT_ERROR, (error) => {
      toast.error(`${error.message}: Please Login Again`);
      logout();
    });
  }, []);

  const logout = async () => {
    await axiosInstance.get("/auth/logout");
    disconnectSocket();
    router.push("/login");
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-900">
      <div className="w-full px-6 py-4 flex items-center justify-between bg-slate-800 text-white shadow">
        <div className="text-lg font-semibold">Chat App</div>
        <button
          onClick={logout}
          className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 transition text-white text-sm"
        >
          Logout
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <ChatWindow socket={socket} />
      </div>
    </div>
  );
};

export default Home;
