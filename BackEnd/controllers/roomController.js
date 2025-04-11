import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import fs from "fs";

const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const passport = require("passport");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const roomModel = require("../models/roomModel").default;

import user from "../controllers/userController.js";

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
  const { theme, password, time } = req.body;
  const code = generateRandomCode(6);
  const creatorId = req.user ? req.user._id : null;
  const hashedPassword = password ? await bcrypt.hash(password, 12) : null;
  try {
    await roomModel.create({
      theme,
      code,
      time,
      password: hashedPassword,
      users: creatorId ? [creatorId] : [],
    });
    res.json({ view: "personal-data" });
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

export default { roomPost, readFile };
