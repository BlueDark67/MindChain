import userModel from "./models/userModel.js";

const roomStates = {};

export default function (io) {
  io.on("connection", function (socket) {
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
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
  });
}
