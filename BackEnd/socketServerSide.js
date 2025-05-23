import userModel from "./models/userModel.js";
import roomModel from "./models/roomModel.js";

//Guarda o estado de cada sala
const roomStates = {};
// Guarda os usuários ativos em cada sala
const activeUsersByRoom = {};


export default function (io) {
  
  io.on("connection", function (socket) {
    //Adiciona o utilizador a sala com o id da sala
    socket.on("joinRoom", async ({ roomId, userId }) => {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.userId = userId;

      //Procura o utilizador na base de dados
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

    //Começa a contagem decrescente
    socket.on("startPreCountdown", ({ roomId }) => {
      io.to(roomId).emit("preCountdown");
    });

    //Começa o chat
    socket.on("startChatNow", ({ roomId, start, duration }) => {
      roomStates[roomId] = { started: true, start, duration };
      io.to(roomId).emit("chatStarted", { start, duration });
    });

    //Envio de mensagens
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

    //Para o chat
    socket.on("stopChat", ({ roomId }) => {
      io.to(roomId).emit("chatStopped");
    });

    //Recomeça a sala
    socket.on("restartRoom", ({ roomId }) => {
      io.to(roomId).emit("roomRestarted");
    });

    //Continuar o chat
    socket.on("continueChat", ({ roomId }) => {
      io.to(roomId).emit("chatContinued");
    });

    //Mostrar as informações de reset
    socket.on("showResetInfo", ({ roomId }) => {
      io.to(roomId).emit("showResetInfo");
    });

    //Sai da sala
    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      if (activeUsersByRoom[roomId]) {
        activeUsersByRoom[roomId] = activeUsersByRoom[roomId].filter(
          (u) => String(u._id) !== String(socket.userId)
        );
        io.to(roomId).emit("activeUsers", activeUsersByRoom[roomId]);
      }
    });

    //Remover utilizador da sala
    socket.on("disconnect", () => {
      const { roomId, userId } = socket;
      if (roomId && userId && activeUsersByRoom[roomId]) {
        activeUsersByRoom[roomId] = activeUsersByRoom[roomId].filter(
          (u) => String(u._id) !== String(socket.userId)
        );
        io.to(roomId).emit("activeUsers", activeUsersByRoom[roomId]);
      }
    });

    //Acabar a sala e envia o tempo de sessão
    socket.on("finishRoom", async ({ roomId, elapsedTime }) => {
      const room = await roomModel.findById(roomId);
      if (!room) return;
      room.timeOfSession = elapsedTime;
      await room.save();
      io.to(roomId).emit("redirectToAiText", { roomId });
    });
  });
}
