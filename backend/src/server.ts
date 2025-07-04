import { createServer } from "http";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Server as SocketServer } from "socket.io";
import app from "./app";
import { env } from "./config/Env";
import { SOCKET_EVENTS } from "./constants";

const PORT = env.PORT;

const httpServer = createServer(app);

const users = new Map();
const userNames = new Map();

const io = new SocketServer(httpServer, {
  cors: {
    origin:
      env.NODE_ENV === "development" ? "http://localhost:3000" : env.FRONTEND,
    credentials: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Missing token"));
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    if (payload.exp && payload.exp < Date.now() / 1000) {
      return next(new Error("Token expired"));
    }

    socket.data.user = payload;
    next();
  } catch (error) {
    console.log(error);
    return next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  users.set(socket.data.user.sub, socket);
  userNames.set(socket.data.user.sub, socket.data.user.name);

  io.emit(SOCKET_EVENTS.USER.ONLINE_USERS, Array.from(userNames.entries()));

  socket.on(SOCKET_EVENTS.MESSAGE.SEND, (data) => {
    const { receiverId } = data;
    const receiverSocket = users.get(receiverId);

    if (receiverSocket) {
      receiverSocket.emit(SOCKET_EVENTS.MESSAGE.RECEIVE, data);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    users.delete(socket.data.user.sub);
    userNames.delete(socket.data.user.sub);
    io.emit(SOCKET_EVENTS.USER.ONLINE_USERS, Array.from(userNames.entries()));
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
