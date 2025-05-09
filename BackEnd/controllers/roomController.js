import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

//const bcrypt = require("bcrypt");

import fs from "fs";

const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const passport = require("passport");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const roomModel = require("../models/roomModel").default;
const userModel = require("../models/userModel").default;

var nodemailer = require("nodemailer");

const saltRounds = 12;

function generateRandomCode(length) {
  const characters = "6LZC5AYRXJEQHTD93UN4VMBOIWKGS07821PF";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const roomPost = async function (req, res) {
  const { theme, password, time, isPrivate } = req.body;
  const code = generateRandomCode(6);
  const creatorId = req.user ? req.user._id : null;
  const hashedPassword = password ? await bcrypt.hash(password, 12) : null;
  try {
    const newRoom = await roomModel.create({
      theme,
      code,
      time,
      password: hashedPassword,
      users: creatorId ? [creatorId] : [],
      isPrivate: isPrivate,
    });
    res.json({ view: "invite", roomId: newRoom._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readFile = function (req, res) {
  const filePath = "../BackEnd/Themes.json";
  const themesText = fs.readFileSync(filePath, "utf8");
  const themesArray = JSON.parse(themesText);
  res.json(themesArray);
};

const getRoomCode = async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await roomModel.findById(roomId).select("code");
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json({ code: room.code });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const getCreatorUsername = async (roomId) => {
  const room = await roomModel.findById(roomId).populate("users", "username");
  if (!room || room.users.length === 0) {
    throw new Error("Room or creator not found");
  }
  return room.users[0].username;
};

const getRoomCreator = async (req, res) => {
  const { roomId } = req.params;
  try {
    const creatorUsername = await getCreatorUsername(roomId);
    res.json({ username: creatorUsername });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendEmailInviteRoom = async (req, res) => {
  const { emails, roomId } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const creator = await getCreatorUsername(roomId);

    for (const email of emails) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `MindChain - ${creator} has invited you to a brainstorm session `,
        html: `
          <div style="text-align: center;">
          <img src="cid:mindchainlogo" alt="MindChain Logo" style="width: 300px; height: auto; margin-bottom: 20px;" />
          </div>
            <h1 style="color: #333; text-align: center;">${creator} has invited you to a brainstorm session</h1>
            <p style="color: #555; text-align: center;">Seems like you where invited by ${creator} to a brainstorming session. If this is true, click below to enter the session</p>
            <div style="text-align: center;">
            <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
              <a href="http://localhost:5173/chatroom/${roomId}" style="text-decoration: none; color: white;">Enter session</a>
            </button>
          </div>
          <p style="color: #555; text-align: center;">If you don't know who ${creator} is, please ignore this email.</p>
          `,
        attachments: [
          {
            filename: "MindChain.png",
            path: path.join(__dirname, "../../FrontEnd/public/MindChain.png"),
            cid: "mindchainlogo",
          },
        ],
      };

      await transporter.sendMail(mailOptions);
    }
    res.json({ view: "email-sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: error.message });
  }
};

const enterRoom = async (req, res) => {
  const { password, code, userId } = req.body;
  try {
    // Busca a sala pelo código e ativa
    const room = await roomModel.findOne({ code, isActive: true });

    if (!room) {
      return res.json({ errorMessage: "Room not found or inactive" });
    }

    // Verifica se o usuário já está na sala
    const user = await userModel.findOne({ userId: userId });
    if (!user) {
      room.users.push(userId);
      await room.save();
    }

    if (!room.isPrivate) {
      return res.json({ view: `chatroom/${room._id}` });
    } else {
      if (!password) {
        return res.json({ isPrivate: true });
      }

      const isMatch = await bcrypt.compare(password, room.password);
      if (!isMatch) {
        return res.json({ errorMessage: "Incorrect password" });
      }

      return res.json({ view: `chatroom/${room._id}` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetchHistory = async (req, res) => {
  const userId = req.body.userId;
  try {
    const rooms = await roomModel
      .find({ users: userId })
      .sort({ createdAt: -1 })
      .populate("users", "username");

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetchRoomInfo = async (req, res) => {
  const roomId = req.body.roomId;
  try {
    const room = await roomModel.findById(roomId).populate("users", "username");
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  roomPost,
  readFile,
  getRoomCode,
  sendEmailInviteRoom,
  enterRoom,
  fetchHistory,
  fetchRoomInfo,
};
