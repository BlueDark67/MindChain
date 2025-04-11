import { createRequire } from "module";
const require = createRequire(import.meta.url);
const router = require("express").Router();
const passport = require("passport");
import room from "../controllers/roomController.js";

router.post("/create-room", room.roomPost);
router.get("/file-txt", room.readFile);

export default router;
