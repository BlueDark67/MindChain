import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import cors from "cors";
import mongoose, { Mongoose } from "mongoose";
import methodOverride from "method-override";

import homeRoutes from "./routes/homeRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(methodOverride("_method"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/teste", homeRoutes);
app.get("/teste2", homeRoutes);

app.use(express.urlencoded({ extended: true }));

const SERVER_PORT = 3000;
const server = http.createServer(app);

mongoose
  .connect(
    "mongodb+srv://admin:adminMind@cluster.zfsi1mr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
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
