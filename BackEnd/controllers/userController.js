import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import passport from "passport"; //adicionei tbm isto

//const passport = require("passport");

const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importando os modelos
const UserModel = require("../models/userModel").default;
const MessageModel = require("../models/messageModel").default;
const RoomModel = require("../models/roomModel").default;

var nodemailer = require("nodemailer");

//Foi adicionado aqui
const login = function (req, res, next) {
  // Verifica se o checkbox "rememberMe" foi enviado
  const rememberMe = req.body.rememberMe || false;

  //Autenticando o usuário com Passport
  // O "local" refere-se à estratégia de autenticação local
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({
        view: "login",
        isAuthenticated: false,
      });
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      // Se "rememberMe" for true, cria uma sessão persistente
      if (rememberMe) {
        // Define o tempo da sessão para 30 dias em vez do padrão (geralmente algumas horas)
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 dias em milissegundos
        // Gera um token de lembrete único
        const crypto = require("crypto");
        const rememberToken = crypto.randomBytes(64).toString("hex");
        const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        // Salva o token no banco de dados
        UserModel.findByIdAndUpdate(user._id, {
          rememberToken: rememberToken,
          tokenExpires: expiry,
        }).catch((err) => console.error("Erro ao salvar token:", err));

        // Define cookie seguro para o token
        res.cookie("remember_token", rememberToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
      }
      return res.json({
        view: "home",
        isAuthenticated: true,
        userId: user._id,
      });
    });
  })(req, res, next);
};

const userGet = function (req, res) {
  res.json({ view: "signup" });
};

// Função para criar um novo utilizador
const userPost = async function (req, res) {
  //Variáveis enviadas pelo cliente
  //username: username do utilizador
  //password: password do utilizador
  //email: email do utilizador
  const { username, password, email } = req.body;
  try {
    //Regista o utilizador
    //O método register do passport-local-mongoose já faz a validação do username e password
    await UserModel.register({ username, email }, password);
    res.json({ view: "login" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Função para obter a página de login
// Esta função é chamada quando o utilizador tenta aceder à página de login
const loginGet = function (req, res) {
  res.json({ view: "login" });
};

// Função para falhar o login
// Esta função é chamada quando o utilizador tenta fazer login e falha
const loginFail = function (req, res) {
  res.json({ view: "login", isAuthenticated: false });
};

// Função para fazer logout
const logout = function (req, res, next) {
  // Limpa o token de remember_me do banco de dados
  if (req.user) {
    UserModel.findByIdAndUpdate(req.user._id, {
      rememberToken: null,
      tokenExpires: null,
    }).catch((err) => console.error("Erro ao limpar token:", err));
  }

  // Limpa o cookie remember_token
  res.clearCookie("remember_token");

  // Faz o logout padrão
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ view: "login" });
  });
};

// Função para enviar o email de reset de password
// Esta função é chamada quando o utilizador clica no botão "Esqueci-me da password"
const sendEmailResetPassword = async (req, res) => {
  //Variáveis enviadas pelo cliente
  //email: email do utilizador que quer resetar a password
  const { email } = req.body;
  try {

    //Procura o utilizador pelo email se não encontrar retorna erro
    const userFound = await UserModel.findOne({ email: email });
    if (!userFound) {
      return res.status(404).json({ error: "Email not found" });
    }

    //Transforma o id do utilizador em string
    const userId = userFound._id.toString();

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

    //Envio do email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "MindChain - Reset Your Password",
      html: `
        <div style="text-align: center;">
          <img src="cid:mindchainlogo" alt="MindChain Logo" style="width: 300px; height: auto; margin-bottom: 20px;" />
        </div>
        <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
        <p style="color: #555; text-align: center;">Seems like you forgot your password for Mindchain. If this is true, click below to change your password.</p>
        <div style="text-align: center;">
          <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
            <a href="http://localhost:5173/reset-password/${userId}" style="text-decoration: none; color: white;">Reset Password</a>
          </button>
        </div>
        <p style="color: #555; text-align: center;">If you didn't request this, please ignore this email.</p>
      `,
      attachments: [
        {
          filename: "MindChain.png",
          path: path.join(__dirname, "../../FrontEnd/public/MindChain.png"),
          cid: "mindchainlogo",
        },
      ],
    };

    //Envia o email
    //retorna a view email-sent quando o email é enviado
    await transporter.sendMail(mailOptions);
    res.json({ view: "email-sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: error.message });
  }
};

// Função para resetar a password
const resetPassword = async (req, res) => {
  //Variáveis enviadas pelo cliente
  //newPassword: nova password do utilizador
  //userId: id do utilizador que quer resetar a password
  const { newPassword, userId } = req.body;

  try {
    //Procura o utilizador pelo id se não encontrar retorna erro
    const userFound = await UserModel.findById(userId);
    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }
    //Muda a password do utilizador
    //O método setPassword do passport-local-mongoose já faz a validação da password
    userFound.setPassword(newPassword, async (err) => {
      if (err) {
        return res.status(500).json({ error: "Error setting new password" });
      }
      await userFound.save();
      res.json({ view: "login", confirmation: true });
    });
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Função para buscar o nome de utilizador
const fetchUserName = async (req, res) => {
  //Variáveis enviadas pelo cliente
  //userId: id do utilizador que quer buscar o nome
  const { userId: userId } = req.body;
  try {
    //Procura o utilizador pelo id se não encontrar retorna erro
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    //Retorna o nome de utilizador e o plano de subscrição
    res.json({
      username: user.username,
      subscriptionPlan: user.subscriptionPlan,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Função para buscar informações do utilizador
const fetchUserInfo = async (req, res) => {
  //Variáveis enviadas pelo cliente
  //userId: id do utilizador que quer buscar as informações
  const { userId: userId } = req.body;
  try {
    //Procura o utilizador pelo id se não encontrar retorna erro
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    //Retorna as informações do utilizador
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Função para mudar as informações do utilizador
const changeUserInfo = async (req, res) => {
  //Variáveis enviadas pelo cliente
  //userId: id do utilizador que quer mudar as informações
  //username: novo nome de utilizador
  //email: novo email do utilizador
  //birthdate: nova data de nascimento do utilizador
  //nationality: nova nacionalidade do utilizador
  const { userId, username, email, birthdate, nationality } = req.body;
  try {
    //Procura o utilizador pelo id se não encontrar retorna erro
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    //Se o nome de utilizador não for vazio muda o nome de utilizador
    if (username !== "") {
      user.username = username;
    }
    //Se o email não for vazio muda o email
    if (email !== "") {
      user.email = email;
    }
    //Se a data de nascimento não for vazia muda a data de nascimento
    if (birthdate !== "") {
      user.birthdate = birthdate;
    }
    //Se a nacionalidade não for vazia muda a nacionalidade
    if (nationality !== "") {
      user.nationality = nationality;
    }
    //Guarda as aletrações do utilizador
    await user.save();
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Função para buscar métricas do utilizador
const userMetrics = async (req, res) => {
  //Variáveis enviadas pelo cliente
  //userId: id do utilizador que quer buscar as métricas
  const { userId: userId } = req.body;
  try {
    //Procura o utilizador pelo id se não encontrar retorna erro
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Busca todas as salas associadas ao usuário se não encontrar retorna erro
    const rooms = await RoomModel.find({ users: userId });
    if (!rooms || rooms.length === 0) {
      return res.status(404).json({ error: "No rooms found for this user" });
    }

    // Busca todas as mensagens associadas ao usuário se não encontrar retorna erro
    const messages = await MessageModel.find({ user: userId });
    if (!messages || messages.length === 0) {
      return res.status(404).json({ error: "No messages found for this user" });
    }

    // Calcula o número de sessões, tempo médio e tempo total de brainstorming
    // Soma o tempo de cada sala e divide pelo número de salas para obter o tempo médio
    const averageTime =
      rooms.length > 0
        ? rooms.reduce((acc, room) => acc + room.timeOfSession, 0) /
          rooms.length
        : 0;

    // Soma o tempo total de brainstorming
    // O tempo total é a soma do tempo de todas as salas
    const timeBrainstorming = rooms.reduce(
      (acc, room) => acc + room.timeOfSession,
      0
    );

    //Busca todas as mensagens do utilizador por sala
    const messagesByRoom = {};
    messages.forEach((msg) => {
      messagesByRoom[msg.room] = (messagesByRoom[msg.room] || 0) + 1;
    });
    // Busca o tema da sala com mais mensagens
    const favoriteRoomId = Object.keys(messagesByRoom).reduce(
      (a, b) => (messagesByRoom[a] > messagesByRoom[b] ? a : b),
      null
    );
    // Busca o tema da sala favorita
    // O tema da sala favorita é o tema da sala com mais mensagens
    const favoriteThemeByMessages = favoriteRoomId
      ? rooms.find((room) => room._id.toString() === favoriteRoomId)?.theme ||
        null
      : null;

    
    const favoriteTheme = favoriteThemeByMessages;

    // Retorna as métricas do utilizador
    // O número de sessões é o número de salas associadas ao utilizador
    // O tempo médio é o tempo médio de todas as salas associadas ao utilizador
    // O tempo total de brainstorming é a soma do tempo de todas as salas associadas ao utilizador
    // O tema favorito é o tema da sala com mais mensagens do utilizador
    res.json({
      numberSessions: rooms.length,
      averageTime: averageTime,
      timeBrainstorming: timeBrainstorming,
      favoriteTheme: favoriteTheme,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Função para apagar a conta do utilizador
const deleteAccount = async (req, res) => {
  //Variáveis enviadas pelo cliente
  //userId: id do utilizador que quer apagar a conta
  const { userId } = req.body;
  try {
    // Apaga todas as mensagens associadas ao utilizador
    await MessageModel.deleteMany({ user: userId });

    //Retira o utilizador de todas as salas
    const rooms = await RoomModel.find({ users: userId });
    for (const room of rooms) {
      room.users = room.users.filter((user) => user.toString() !== userId);
      await room.save();
    }

    // Apaga o utilizador
    await UserModel.findByIdAndDelete(userId);

    // Se o utilizador estiver autenticado, faz logout
    req.logout(function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.clearCookie("remember_token");
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: error.message });
  }
};

// Função para mudar o plano de subscrição do utilizador
const changeSubscriptionPlan = async (req, res) => {
  //Variáveis enviadas pelo cliente
  //userId: id do utilizador que quer mudar o plano de subscrição
  const { userId } = req.body;
  try {
    //Procura o utilizador pelo id se não encontrar retorna erro
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    //Muda o plano de subscrição do utilizador
    const newSubscriptionPlan = "Premium";
    user.subscriptionPlan = newSubscriptionPlan;
    await user.save();
    res.json({ changeConfirmation: true });
  } catch (error) {
    console.error("Error changing subscription plan:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Função para buscar o progresso do utilizador
const userProgress = async (req, res) => {
  //Variáveis enviadas pelo cliente
  //userId: id do utilizador que quer buscar o progresso
  const { userId } = req.body;
  try {
    //Procura o utilizador pelo id se não encontrar retorna erro
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Busca todas as salas associadas ao usuário
    const rooms = await RoomModel.find({ users: userId });
    if (!rooms || rooms.length === 0) {
      return res.status(404).json({ error: "No rooms found for this user" });
    }

    // Busca todas as mensagens associadas ao usuário
    const messages = await MessageModel.find({ user: userId });
    if (!messages || messages.length === 0) {
      return res.status(404).json({ error: "No messages found for this user" });
    }

    // Dados para o gráfico de linha: sessões de brainstorming por mês
    const brainstormingByMonth = {};
    rooms.forEach((room) => {
      const month = new Date(room.createdAt).toLocaleString("default", {
        month: "long",
      });
      brainstormingByMonth[month] = (brainstormingByMonth[month] || 0) + 1;
    });

    // Cria um mapa de roomId para theme
    const roomIdToTheme = {};
    rooms.forEach((room) => {
      roomIdToTheme[room._id.toString()] = room.theme;
    });

    // Dados para o gráfico de barras: mensagens por sessão
    const messagesBySession = {};
    messages.forEach((message) => {
      const roomId = message.room.toString();
      const theme = roomIdToTheme[roomId] || "Unknown";
      messagesBySession[theme] = (messagesBySession[theme] || 0) + 1;
    });

    res.json({
      brainstormingByMonth, // Dados para o gráfico de linha
      messagesBySession, // Dados para o gráfico de barras
    });
  } catch (error) {
    console.error("Error fetching user metrics:", error);
    return res.status(500).json({ error: error.message });
  }
};

export default {
  userGet,
  userPost,
  loginGet,
  logout,
  login,
  sendEmailResetPassword,
  loginFail,
  resetPassword,
  fetchUserName,
  fetchUserInfo,
  changeUserInfo,
  userMetrics,
  deleteAccount,
  changeSubscriptionPlan,
  userProgress,
};
