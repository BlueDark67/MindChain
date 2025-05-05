import express from "express";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const path = require("path");
const fileURLToPath = require("url").fileURLToPath;
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const localStrategy = require("passport-local");
import User from "./models/userModel.js";
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const bodyParser = require("body-parser");
const nodeMailer = require("nodemailer");
const cookieParser = require("cookie-parser");


import userRoutes from "./routes/userRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Tente usar o cookie-parser sem opções primeiro
app.use(require('cookie-parser')());

// E use um middleware super simplificado
// Substitua o middleware atual por esta versão simplificada
// Adicione o middleware de autenticação automática AQUI
app.use(async (req, res, next) => {
  if (!req.isAuthenticated() && req.cookies.remember_token) {
    try {
      // Busca usuário com este token que ainda não expirou
      const user = await User.findOne({
        rememberToken: req.cookies.remember_token,
        tokenExpires: { $gt: new Date() }
      });
      
      if (user) {
        // Faz login automático
        req.logIn(user, function(err) {
          if (err) return next(err);
          next();
        });
      } else {
        // Token inválido ou expirado, limpa o cookie
        res.clearCookie('remember_token');
        next();
      }
    } catch (err) {
      console.error('Erro ao verificar token de autenticação:', err);
      next();
    }
  } else {
    next();
  }
});


app.use(userRoutes);
app.use(roomRoutes);

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const password = process.env.MONGO_DB_PASSWORD;
const url = `mongodb+srv://admin:${password}@cluster.zfsi1mr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`;

const SERVER_PORT = process.env.SERVER_PORT;
const server = http.createServer(app);

mongoose
  .connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

server.listen(SERVER_PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server listening on PORT", SERVER_PORT);
    console.log(`url: localhost:${SERVER_PORT}`);
  }
});


