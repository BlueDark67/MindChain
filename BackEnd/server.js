import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import reactEngine from "express-react-views";
import homeRoutes from "./routes/homeRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/", homeRoutes);
app.set("view engine", "jsx");
app.engine("jsx", reactEngine.createEngine());
app.set("views", path.join(__dirname, "../FrontEnd/views"));
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
