import express from "express";
import { getHomePage, getHomePage2 } from "../controllers/homeController.js";

const router = express.Router();

router.get("/teste", getHomePage);
router.get("/teste2", getHomePage2);

export default router;
