import express from "express";
import { getLoginPage } from "../controllers/loginController.js";

const router = express.Router();

router.get("/", getLoginPage);

export default router;
