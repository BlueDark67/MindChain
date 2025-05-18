import { createRequire } from "module";
const require = createRequire(import.meta.url);
const router = require("express").Router();
import message from "../controllers/messageController.js";

// Define routes for message-related operations
router.post("/save-message", message.saveMessage);
router.get("/get-messages/:roomId", message.getMessagesRoom);

export default router;
