import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: "./MongoDB.env" });

const UserModel = require("../models/userModel").default;

var nodemailer = require("nodemailer");

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

const logout = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ view: "login" });
  });
};

const sendEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      text: "Aqui está o link para resetar sua senha...",
      html: ``,
    };

    await transporter.sendMail(mailOptions);
    res.json({ isEmailSent: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: error.message });
  }
};

export default { userGet, userPost, loginGet, logout, sendEmail };
