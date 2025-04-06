import express from "express";
import { getSignUp } from '../controllers/homeController.js';

const router = express.Router();

router.get("/", getSignUp);

export default router;