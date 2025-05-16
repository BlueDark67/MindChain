import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { LMStudioClient } from "@lmstudio/sdk";

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
const messageModel = require("../models/messageModel").default;

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

export const restartRoom = async (req, res) => {
  const roomId = req.body.roomId;
  try {
    await messageModel.deleteMany({ room: roomId });
    const room = await roomModel.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });
    room.messages = [];
    await room.save();
    res.json({ deleted: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateChatResponse = async (req, res) => {
  try {
    const { roomId } = req.body;

    const room = await roomModel.findById(roomId);

    const roomTheme = await roomModel.findById(roomId).populate("theme");

    const roomIdeas = await roomModel
      .findById(roomId)
      .populate("messages", "content");

    if (!roomIdeas) {
      return res.status(404).json({ error: "Room not found" });
    }

    const systemPrompt = `You will receive a list of ideas submitted by different participants during a brainstorming session on the theme "${roomTheme}".
    Your task is to:
    - Interpret and organize these ideas logically according to the theme.
    - Fill in any gaps to ensure smooth flow and coherence.
    - Write only the final text, structured with introduction, body, and conclusion, in a [choose: creative / professional / inspiring / technical] tone.
    - Do not include any explanations, reasoning, thoughts, comments, or <think> tags, nor any text outside the final article.
    - The text should be around 1000 words, avoid repetition, and have an engaging style.`;

    const userPrompt = `Here are the ideas:
    ${roomIdeas.messages.map((message) => message.content).join("\n")}
    `;

    //const client = new LMStudioClient({ baseUrl: "ws://192.168.56.1:1234" });

    /*const response = await fetch("http://localhost:1234/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "deepseek-r1-distill-qwen-7b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.6,
        max_tokens: 1000,
        stream: false,
      }),
    });

    

    const data = await response.json();

    const generatedText = data.choices[0].message.content;*/

    const LM_STUDIO_URL = process.env.LM_STUDIO_URL;

    const payload = {
      model: "llama-3.2-1b-claude-3.7-sonnet-reasoning-distilled",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 10000,
      stream: true,
    };

    const lmResponse = await fetch(LM_STUDIO_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = lmResponse.body.getReader();
    const decoder = new TextDecoder();
    let generatedText = "";

    let isInThinkingBlock = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);

      chunk.split("\n").forEach((line) => {
        if (line.startsWith("data: ")) {
          try {
            const json = JSON.parse(line.replace("data: ", ""));
            let content = json.choices?.[0]?.delta?.content || "";

            // Lógica para remover texto entre <think> e </think>
            while (content.length > 0) {
              if (!isInThinkingBlock) {
                const thinkStart = content.indexOf("<think>");
                if (thinkStart === -1) {
                  generatedText += content;
                  content = "";
                } else {
                  generatedText += content.slice(0, thinkStart);
                  content = content.slice(thinkStart + 7); // 7 = "<think>".length
                  isInThinkingBlock = true;
                }
              } else {
                const thinkEnd = content.indexOf("</think>");
                if (thinkEnd === -1) {
                  // Ignora tudo até encontrar </think>
                  content = "";
                } else {
                  // Sai do bloco <think>
                  content = content.slice(thinkEnd + 8); // 8 = "</think>".length
                  isInThinkingBlock = false;
                }
              }
            }
          } catch (e) {
            // ignora linhas que não são JSON válidas
          }
        }
      });
    }

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.text = generatedText;
    room.lastActivity = new Date();
    room.isActive = false;
    await room.save();

    res.json({ generatedText: generatedText, setLoading: false });
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
  restartRoom,
  generateChatResponse,
};
