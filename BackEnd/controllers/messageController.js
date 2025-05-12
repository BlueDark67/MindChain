import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MessageModel = require("../models/messageModel").default;
const RoomModel = require("../models/roomModel").default;

const saveMessage = async (req, res) => {
  const { roomId, userId, content } = req.body;
  try {
    const newMessage = await MessageModel.create({
      room: roomId,
      user: userId,
      content,
    });
    const room = await RoomModel.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    room.messages.push(newMessage._id);
    room.lastActivity = new Date();
    await room.save();
    res.json({ message: "Message saved successfully", newMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessagesRoom = async (req, res) => {
  const { roomId } = req.params;
  try {
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
