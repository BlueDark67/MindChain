import { createRequire } from "module";
const require = createRequire(import.meta.url);
const router = require("express").Router();
import message from "../controllers/messageController.js";

router.post("/save-message", message.saveMessage);

export default router;
