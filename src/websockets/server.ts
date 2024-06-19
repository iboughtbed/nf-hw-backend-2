import { SOCKET_EVENTS } from "../consts";
import { SocketIOService } from "./service";

export default (expressServer) => {
  SocketIOService.instance().initialize(expressServer, {
    cors: {
      origin: "*",
    },
  });

  const io = SocketIOService.instance().getServer();

  io.on("connection", async (socket) => {
    socket.on(SOCKET_EVENTS.JOIN_CHAT, async ({ ...roomObject }) => {
      const room = roomObject.chatId;
      console.log("joining room", room);
      if (
        io.sockets.adapter.rooms.get(room) &&
        io.sockets.adapter.rooms.get(room)!.size > 0
      ) {
        socket.emit(SOCKET_EVENTS.PARTNER_JOINED);
      }
      socket.to(room).emit(SOCKET_EVENTS.PARTNER_JOINED);
      socket.join(room);
    });

    socket.on("join", async ({ ...roomObject }) => {
      const room = roomObject.chatId;
      console.log("room", room);
      socket.join(room);
    });

    socket.on(SOCKET_EVENTS.TYPING, function ({ chatId }) {
      socket.to(chatId).emit(SOCKET_EVENTS.TYPING);
    });

    socket.on(SOCKET_EVENTS.LEAVE_CHAT, async ({ ...roomObject }) => {
      const room = roomObject.chatId;
      socket.leave(room);
      socket.to(room).emit(SOCKET_EVENTS.PARTNER_LEFT);
    });

    socket.on(SOCKET_EVENTS.JOIN_CHATS_LIST, async ({ ...roomObject }) => {
      const room = `${roomObject.userId}_chats`;
      socket.join(room);
    });

    socket.on(SOCKET_EVENTS.LEAVE_CHATS_LIST, async ({ ...roomObject }) => {
      const room = `${roomObject.userId}_chats`;
      socket.leave(room);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    io.of("/").adapter.on("leave-room", (room, id) => {
      socket.to(room).emit(SOCKET_EVENTS.PARTNER_LEFT);
    });
  });

  return io;
};
