
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Importar os modelos
const MessageModel = require("../models/messageModel").default;
const RoomModel = require("../models/roomModel").default;

//Guardar as mensagens enviadas pelos utilizadores 
const saveMessage = async (req, res) => {
  // Variáveis enviadas pelo cliente
  // roomId: id da sala
  // userId: id do utilizador
  // content: conteúdo da mensagem
  const { roomId, userId, content } = req.body;
  try {
    //Guardar a mensagem na base de dados com o id da sala, id do utilizador e conteúdo
    const newMessage = await MessageModel.create({
      room: roomId,
      user: userId,
      content,
    });

    //Procurar a sala na base de dados correspondente ao id da sala se não encontrar dá mensagem de erro
    const room = await RoomModel.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    //Adicionar a mensagem à sala e atualizar a data da última atividade da sala
    room.messages.push(newMessage._id);
    room.lastActivity = new Date();
    await room.save();
    res.json({ message: "Message saved successfully", newMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Obter as mensagens de uma sala
const getMessagesRoom = async (req, res) => {
  // Variável enviada pelo cliente
  // roomId: id da sala
  const { roomId } = req.params;
  try {
    //Procura as mensagens na base de dados que tenham o id da sala e popula o utilizador com o username, ou seja, procura o id do utilizador na base de dados e devolve o username
    const messages = await MessageModel.find({ room: roomId }).populate(
      "user",
      "username"
    );
    return res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  saveMessage,
  getMessagesRoom,
};
