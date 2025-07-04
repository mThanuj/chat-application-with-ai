import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";

interface MessageInputProps {
  socket: any;
  receiver: number;
}

const MessageInput = ({ socket, receiver }: MessageInputProps) => {
  const sendMessage = () => {};

  return (
    <div className="flex space-x-5 mx-auto">
      <Input className="flex-1" />
      <Button className="cursor-pointer">
        <Send />
      </Button>
    </div>
  );
};

export default MessageInput;
