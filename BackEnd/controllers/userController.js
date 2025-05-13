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

const UserModel = require("../models/userModel").default;
const MessageModel = require("../models/messageModel").default;
const RoomModel = require("../models/roomModel").default;

var nodemailer = require("nodemailer");

//Foi adicionado aqui
const login = function (req, res, next) {
  // Verifica se o checkbox "rememberMe" foi enviado
  const rememberMe = req.body.rememberMe || false;

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
//foi isto que adicionei por isso é rever outro dia ctg gui pedro o userpost
// para ver se ha alteraçoes

const userGet = function (req, res) {
  res.json({ view: "signup" });
};

const userPost = async function (req, res) {
  const { username, password, email } = req.body;
  try {
    await UserModel.register({ username, email }, password);
    res.json({ view: "login" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginGet = function (req, res) {
  res.json({ view: "login" });
};

const loginFail = function (req, res) {
  res.json({ view: "login", isAuthenticated: false });
};

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

const sendEmailResetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const userFound = await UserModel.findOne({ email: email });
    if (!userFound) {
      return res.status(404).json({ error: "Email not found" });
    }

    const userId = userFound._id.toString();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

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

    await transporter.sendMail(mailOptions);
    res.json({ view: "email-sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { newPassword, userId } = req.body;

  try {
    const userFound = await UserModel.findById(userId);
    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }
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

const fetchUserName = async (req, res) => {
  const { userId: userId } = req.body;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ username: user.username });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ error: error.message });
  }
};

const fetchUserInfo = async (req, res) => {
  const { userId: userId } = req.body;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ error: error.message });
  }
};

const changeUserInfo = async (req, res) => {
  const { userId, username, email, birthdate, nationality } = req.body;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (username !== "") {
      user.username = username;
    }
    if (email !== "") {
      user.email = email;
    }
    if (birthdate !== "") {
      user.birthdate = birthdate;
    }
    if (nationality !== "") {
      user.nationality = nationality;
    }
    await user.save();
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ error: error.message });
  }
};

const userMetrics = async (req, res) => {
  const { userId: userId } = req.body;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const rooms = await RoomModel.find({ users: userId });
    if (!rooms || rooms.length === 0) {
      return res.status(404).json({ error: "No rooms found for this user" });
    }

    const messages = await MessageModel.find({ user: userId });
    if (!messages || messages.length === 0) {
      return res.status(404).json({ error: "No messages found for this user" });
    }

    const averageTime =
      rooms.length > 0
        ? rooms.reduce((acc, room) => acc + room.timeOfSession, 0) /
          rooms.length
        : 0;
    const timeBrainstorming = rooms.reduce(
      (acc, room) => acc + room.timeOfSession,
      0
    );

    const messagesByRoom = {};
    messages.forEach((msg) => {
      messagesByRoom[msg.room] = (messagesByRoom[msg.room] || 0) + 1;
    });
    const favoriteRoomId = Object.keys(messagesByRoom).reduce(
      (a, b) => (messagesByRoom[a] > messagesByRoom[b] ? a : b),
      null
    );
    const favoriteThemeByMessages = favoriteRoomId
      ? rooms.find((room) => room._id.toString() === favoriteRoomId)?.theme ||
        null
      : null;

    const favoriteTheme = favoriteThemeByMessages;

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

const deleteAccount = async (req, res) => {
  const { userId } = req.body;
  try {
    // Delete messages associated with the user
    await MessageModel.deleteMany({ user: userId });

    // Delete rooms associated with the user
    const rooms = await RoomModel.find({ users: userId });
    for (const room of rooms) {
      room.users = room.users.filter((user) => user.toString() !== userId);
      await room.save();
    }

    await UserModel.findByIdAndDelete(userId);

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
};
