import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import cors from "cors";
import homeRoutes from "./routes/homeRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const names = {
  names: [
    "Anna",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Frank",
    "Grace",
    "Heidi",
    "Ivan",
    "Judy",
  ],
};

app.get("/", homeRoutes);

app.get("/users", (req, res) => {
  res.json(names);
});

app.use(express.urlencoded({ extended: true }));

const SERVER_PORT = 3000;
const server = http.createServer(app);

server.listen(SERVER_PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server listening on PORT", SERVER_PORT);
    console.log(`url: localhost:${SERVER_PORT}`);
  }
});
