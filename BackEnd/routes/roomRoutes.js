import { createRequire } from "module";
const require = createRequire(import.meta.url);
const router = require("express").Router();
const passport = require("passport");
import room from "../controllers/roomController.js";

// Define routes for room-related operations
router.post("/create-room", room.roomPost);
router.get("/file-txt", room.readFile);
router.get("/room-code/:roomId", room.getRoomCode);
router.post("/sendEmailInviteRoom", room.sendEmailInviteRoom);
router.post("/enter-room", room.enterRoom);
router.post("/fetch-history", room.fetchHistory);
router.post("/fetch-room-info", room.fetchRoomInfo);
router.post("/restart-room", room.restartRoom);
router.post("/generate-chat-response/:roomId", room.generateChatResponse);

export default router;
