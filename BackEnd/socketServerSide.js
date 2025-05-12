import userModel from "./models/userModel.js";

const roomStates = {};
const activeUsersByRoom = {};

export default function (io) {
  io.on("connection", function (socket) {
    socket.on("joinRoom", async ({ roomId, userId }) => {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.userId = userId;

      const user = await userModel.findById(userId);
      if (!user) return;

      const userData = {
        _id: user._id,
        username: user.username,
      };

      if (!activeUsersByRoom[roomId]) activeUsersByRoom[roomId] = [];
      if (
        !activeUsersByRoom[roomId].some(
          (u) => String(u._id) === String(userData._id)
        )
      ) {
        activeUsersByRoom[roomId].push(userData);
      }
      socket.user = userData;
      io.to(roomId).emit("activeUsers", activeUsersByRoom[roomId]);
      if (roomStates[roomId]?.started) {
        socket.emit("chatStarted", {
          start: roomStates[roomId].start,
          duration: roomStates[roomId].duration,
        });
      }
    });

    socket.on("startPreCountdown", ({ roomId }) => {
      io.to(roomId).emit("preCountdown");
    });

    socket.on("startChatNow", ({ roomId, start, duration }) => {
      roomStates[roomId] = { started: true, start, duration };
      io.to(roomId).emit("chatStarted", { start, duration });
    });

    socket.on("sendMessage", async function (data) {
      const user = await userModel.findById(data.userId);
      const toClient = {
        roomId: data.roomId,
        userId: data.userId,
        username: user.username,
        content: data.content,
      };
      io.to(data.roomId).emit("clientChat", toClient);
    });

    socket.on("stopChat", ({ roomId }) => {
      io.to(roomId).emit("chatStopped");
    });

    socket.on("restartRoom", ({ roomId }) => {
      io.to(roomId).emit("roomRestarted");
    });

    socket.on("continueChat", ({ roomId }) => {
      io.to(roomId).emit("chatContinued");
    });

    socket.on("showResetInfo", ({ roomId }) => {
      io.to(roomId).emit("showResetInfo");
    });

    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      if (activeUsersByRoom[roomId]) {
        activeUsersByRoom[roomId] = activeUsersByRoom[roomId].filter(
          (u) => String(u._id) !== String(socket.userId)
        );
        io.to(roomId).emit("activeUsers", activeUsersByRoom[roomId]);
      }
    });

    socket.on("disconnect", () => {
      const { roomId, userId } = socket;
      if (roomId && userId && activeUsersByRoom[roomId]) {
        activeUsersByRoom[roomId] = activeUsersByRoom[roomId].filter(
          (u) => String(u._id) !== String(socket.userId)
        );
        io.to(roomId).emit("activeUsers", activeUsersByRoom[roomId]);
      }
    });
  });
}
