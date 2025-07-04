export const SOCKET_EVENTS = {
  MESSAGE: {
    SEND: "message:send",
    RECEIVE: "message:receive",
    SEEN: "message:seen",
    DELIVERED: "message:delivered",
  },
  ROOM: {
    JOIN: "room:join",
    LEAVE: "room:leave",
    JOINED: "room:joined",
    LEFT: "room:left",
  },
  USER: {
    ONLINE: "user:online",
    OFFLINE: "user:offline",
    TYPING: "user:typing",
    STOP_TYPING: "user:stopTyping",
    ONLINE_USERS: "user:online_users",
  },
  BASE: {
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    ERROR: "error",
    CONNECT_ERROR: "connect_error",
  },
  NOTIFICATION: "notification",
};
