import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const passport = require("passport");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const roomModel = require("../models/roomModel").default;

import user from "../controllers/userController.js";

var nodemailer = require("nodemailer");

function generateRandomCode(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const roomPost = async function (req, res) {
  const { theme, password, time } = req.body;
  const code = generateRandomCode(6);
  const creatorId = req.user ? req.user._id : null;
  try {
    await roomModel.create({
      theme,
      code,
      time,
      password,
      users: creatorId ? [creatorId] : [],
    });
    res.json({ view: "personal-data" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { roomPost };
