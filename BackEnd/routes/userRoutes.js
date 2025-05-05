import { createRequire } from "module";
const require = createRequire(import.meta.url);
const router = require("express").Router();
const passport = require("passport");
import user from "../controllers/userController.js";

router.get("/signup", user.userGet);
router.post("/signup", user.userPost);
router.get("/login", user.loginGet);
router.get("/loginFail", user.loginFail);
router.post("/login", user.login);

router.get("/logout", user.logout);

router.post("/sendEmailResetPassword", user.sendEmailResetPassword);

router.get("/check-auth", (req, res) => {
  // req.isAuthenticated() é uma função do Passport que verifica se o usuário está autenticado
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});


export default router;
