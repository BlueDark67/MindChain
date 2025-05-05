import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import passport from "passport"; //adicionei tbm isto

const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UserModel = require("../models/userModel").default;

var nodemailer = require("nodemailer");

//Foi adicionado aqui
const login = function (req, res, next) {
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

const logout = function (req, res) {
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
            <a href="http://localhost:5173/reset-password" style="text-decoration: none; color: white;">Reset Password</a>
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

export default {
  userGet,
  userPost,
  loginGet,
  logout,
  login, // Foi adicionado aqui
  sendEmailResetPassword,
  loginFail,
};
