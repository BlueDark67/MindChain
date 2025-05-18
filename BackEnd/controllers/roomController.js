import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { LMStudioClient } from "@lmstudio/sdk";

//const bcrypt = require("bcrypt");

import fs from "fs";
import { subscribe } from "diagnostics_channel";

const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const passport = require("passport");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Importar os modelos
const roomModel = require("../models/roomModel").default;
const userModel = require("../models/userModel").default;
const messageModel = require("../models/messageModel").default;

var nodemailer = require("nodemailer");

//Número de vezes que o algoritmo irá processar (ou "misturar") a senha antes de gerar o hash final.
const saltRounds = 12;

//Função para gerar um código aleatório de 6 caracteres
function generateRandomCode(length) {
  const characters = "6LZC5AYRXJEQHTD93UN4VMBOIWKGS07821PF";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

//Função para criar uma nova sala
const roomPost = async function (req, res) {
  //Variáveis enviadas pelo cliente
  //theme: tema da sala
  //code: código da sala
  //time: tempo da sala
  //password: senha da sala
  //isPrivate: se a sala é privada ou não
  //userId: id do usuário que criou a sala
  const { theme, password, time, isPrivate, userId } = req.body;
  const code = generateRandomCode(6);
  const creatorId = userId;
  const hashedPassword = password ? await bcrypt.hash(password, 12) : null;
  try {
    //Procura o plano de assinatura do utilizador que criou a sala se não encontrar retorna erro
    const user = await userModel.findById(creatorId).select("subscriptionPlan");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //Verifica se o utilizador tem um plano de assinatura standard
    //Se o utilizador tiver um plano standard verifica se já criou 5 salas hoje
    //Se não tiver criado 5 salas hoje cria a sala
    //Se já tiver criado 5 salas hoje retorna erro
    if (user.subscriptionPlan === "Standard") {
      // Define o início e o fim do dia atual
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Conta o número de salas criadas pelo utilizador hoje
      const roomsToday = await roomModel.countDocuments({
        users: creatorId,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });

      // Se o utilizador já criou 5 salas hoje, retorna erro
      if (roomsToday >= 5) {
        return res.status(403).json({
          error: "Daily limit of 5 rooms reached for the Standard plan.",
        });
      }
    }

    //Cria a sala com os dados enviados pelo cliente
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

//Função para ler o arquivo JSON e retornar os temas no caso do tema da sala ser aleatório
const readFile = function (req, res) {
  const filePath = "../BackEnd/Themes.json";
  const themesText = fs.readFileSync(filePath, "utf8");
  const themesArray = JSON.parse(themesText);
  res.json(themesArray);
};

//Função para retornar o código da sala
const getRoomCode = async (req, res) => {
  //Variáveis enviadas pelo cliente
  //roomId: id da sala
  const { roomId } = req.params;
  try {
    //Procura o código da sala pelo id da sala se não encontrar retorna erro
    const room = await roomModel.findById(roomId).select("code");
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json({ code: room.code });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

//Função para retornar o nome de utilizador do criador da sala
//Procura o utilizador pelo id da sala e retorna o nome de utilizador
const getCreatorUsername = async (roomId) => {
  const room = await roomModel.findById(roomId).populate("users", "username");
  if (!room || room.users.length === 0) {
    throw new Error("Room or creator not found");
  }
  return room.users[0].username;
};

//Função para enviar o convite por email
//Envia o convite para os emails enviados pelo client
const sendEmailInviteRoom = async (req, res) => {
  //Variáveis enviadas pelo cliente
  //emails: emails dos utilizadores que foram convidados
  //roomId: id da sala
  const { emails, roomId } = req.body;
  try {

    //Cria o transporter do Nodemailer responsável para enviar o email através do SMTP do Gmail
    //Host: endereço do servidor SMTP (Gmail)
    //Port: porta do servidor SMTP para enviar emails (587)
    //Secure: se a conexão é segura ou não (false)
    //Auth: autenticação do utilizador que envia o email
    //User: email do utilizador que envia o email
    //Pass: senha do utilizador que envia o email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    //Busca o nome de utilizador do criador da sala
    const creator = await getCreatorUsername(roomId);

    //Envio de cada email
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
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: error.message });
  }
};

//Função para entrar na sala
const enterRoom = async (req, res) => {
  //Variáveis enviadas pelo cliente
  //password: senha da sala
  //code: código da sala
  //userId: id do utilizador que quer entrar na sala
  const { password, code, userId } = req.body;
  try {
    // Busca a sala pelo código e ativa, se não encontrar retorna erro
    const room = await roomModel.findOne({ code, isActive: true });

    if (!room) {
      return res.json({ errorMessage: "Room not found or inactive" });
    }

    // Procura o utilizador pelo id enviado pelo cliente se não encontrar retorna erro
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    //Verifica se a sala é privada
    if (room.isPrivate) {
      //Se a sala for privada verifica e não tiver senha retorna o isPrivate
      if (!password) {
        return res.json({ isPrivate: true });
      }
      
      //Compara a senha enviada pelo cliente com a senha da sala
      //Se a senha não for igual retorna erro
      const isMatch = await bcrypt.compare(password, room.password);
      if (!isMatch) {
        return res.json({ errorMessage: "Incorrect password" });
      }
    }
    //Verifica se o utilizador já está na sala
    //Se o utilizador já estiver na sala retorna a view da sala
    if (room.users.includes(userId)) {
      return res.json({ view: `chatroom/${room._id}` });
    }

    //Busca o criador da sala pelo id do utilizador que criou a sala
    const creator = await userModel.findById(room.users[0]);
    //Guarda o plano de assinatura do criador da sala
    const creatorPlan = creator.subscriptionPlan;

    //Se o plano de assinatura do criador da sala for standard e o utilizador não estiver na sala
    //E a sala já tiver 5 utilizadores retorna sala cheia
    if (
      creatorPlan === "Standard" &&
      !room.users.includes(userId) &&
      room.users.length >= 5
    ) {
      return res.json({
        errorMessage: "Room is full. Please try another room.",
      });
    }

    //Se o utilizador não estiver na sala adiciona o id do utilizador na sala e guarda a sala
    if (!room.users.includes(userId)) {
      room.users.push(userId);
      await room.save();
    }

    //Retorna a view da sala
    return res.json({ view: `chatroom/${room._id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Função para buscar o histórico de salas do utilizador
const fetchHistory = async (req, res) => {
  //Variáveis enviadas pelo cliente
  //userId: id do utilizador que quer buscar o histórico
  const userId = req.body.userId;
  try {
    //Procura pelo plano de assinatura do utilizador se não encontrar retorna erro
    const user = await userModel.findById(userId).select("subscriptionPlan");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //Procura as salas do utilizador pelo id do utilizador por ordem da mais recente para a mais antiga
    //Se o utilizador tiver um plano de assinatura premium retorna todas as salas 
    //Se o utilizador não tiver um plano de assinatura premium retorna apenas 10 salas
    //Popula os utilizadores da sala com o nome de utilizador
    //Se não encontrar retorna erro
    const rooms = await roomModel
      .find({ users: userId })
      .sort({ createdAt: -1 })
      .limit(user.subscriptionPlan === "premium" ? 0 : 10)
      .populate("users", "username");

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Função para buscar as informações da sala
const fetchRoomInfo = async (req, res) => {
  //Variáveis enviadas pelo cliente
  //roomId: id da sala
  const roomId = req.body.roomId;
  try {
    //Procura a sala pelo id da sala se não encontrar retorna erro
    //Popula os utilizadores da sala com o nome de utilizador
    const room = await roomModel.findById(roomId).populate("users", "username");
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Função para reiniciar a sala
//Apaga todas as mensagens da sala e reinicia a sala
//Retorna a sala reiniciada
export const restartRoom = async (req, res) => {
  //Variáveis enviadas pelo cliente
  //roomId: id da sala
  const roomId = req.body.roomId;
  try {
    //Apaga todas as mensagens que tenham o id da sala
    await messageModel.deleteMany({ room: roomId });

    //Procura a sala pelo id da sala se não encontrar retorna erro
    const room = await roomModel.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    //Apaga todas as mensagens da sala
    //E reinicia a sala
    //E retorna a sala reiniciada
    room.messages = [];
    await room.save();
    res.json({ deleted: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Função para gerar a resposta do chat
export const generateChatResponse = async (req, res) => {
  try {
    //Variáveis enviadas pelo cliente
    //roomId: id da sala
    const { roomId } = req.body;

    //Procura a sala pelo id da sala 
    const room = await roomModel.findById(roomId);

    //Procura o tema da sala pelo id da sala e popula o tema
    const roomTheme = await roomModel.findById(roomId).populate("theme");

    //Procura as mensagens da sala pelo id da sala
    //E popula as mensagens com o conteúdo
    const roomIdeas = await roomModel
      .findById(roomId)
      .populate("messages", "content");

    //Se não encontrar a sala retorna erro
    if (!roomIdeas) {
      return res.status(404).json({ error: "Room not found" });
    }

    //Prompt com instruções detalhadas sobre como o modelo deve comportar-se e estruturar a resposta.
    const systemPrompt = `You will receive a list of ideas submitted by different participants during a brainstorming session on the theme "${roomTheme}".
    Your task is to:
    - Interpret and organize these ideas logically according to the theme.
    - Fill in any gaps to ensure smooth flow and coherence.
    - Write only the final text, structured with introduction, body, and conclusion, in a [choose: creative / professional / inspiring / technical] tone.
    - Do not include any explanations, reasoning, thoughts, comments, or <think> tags, nor any text outside the final article.
    - The text should be around 1000 words, avoid repetition, and have an engaging style.`;

    //Prompt com as ideias enviadas pelo cliente
    const userPrompt = `Here are the ideas:
    ${roomIdeas.messages.map((message) => message.content).join("\n")}
    `;

    //URL da API do LM Studio
    const LM_STUDIO_URL = process.env.LM_STUDIO_URL;

    //Configuração do cliente LM Studio
    //model: modelo a ser utilizado
    //systemPrompt: Prompt com instruções detalhadas sobre como o modelo deve comportar-se e estruturar a resposta.
    //userPrompt: Prompt com as ideias enviadas pelo cliente
    //temperature: Grau de criatividade/aleatoriedade da resposta
    //max_tokens: Número máximo de tokens(palavras) a serem gerados na resposta
    //stream: Se a resposta deve ser enviada em tempo real
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

    //Uso da api do LM Studio para gerar a resposta
    //Faz uma requisição POST para a URL da API do LM Studio com o payload
    const lmResponse = await fetch(LM_STUDIO_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    //Content-Type: indica que a resposta será um fluxo contínuo de eventos
    //Cache-Control: indica que a resposta não deve ser armazenada em cache
    //Connection: indica que a conexão deve ser mantida aberta
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    //Lê a resposta da API do LM Studio
    const reader = lmResponse.body.getReader();
    //Cria um decodificador de texto para decodificar os dados recebidos
    const decoder = new TextDecoder();
    //Cria uma variável para armazenar o texto gerado
    let generatedText = "";

    let isInThinkingBlock = false;

    //Lê os dados recebidos da API do LM Studio
    //Enquanto houver dados para ler
    //Decodifica os dados recebidos e armazena na variável generatedText
    while (true) {

      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);

      // Se o chunk não contiver "data: ", ignora
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

    //Se não encontrar a sala retorna erro
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    //Guarda o texto gerado na sala
    //E atualiza a data da última atividade da sala
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
