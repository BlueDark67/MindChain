import userModel from "./models/userModel.js";

export default function (io) {
  io.on("connection", function (socket) {
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });

    socket.on("startPreCountdown", ({ roomId }) => {
      io.to(roomId).emit("preCountdown");
    });

    socket.on("startChatNow", ({ roomId, start, duration }) => {
      io.to(roomId).emit("chatStarted", { start, duration });
    });

    socket.on("startChatNow", ({ roomId, start, duration }) => {
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
