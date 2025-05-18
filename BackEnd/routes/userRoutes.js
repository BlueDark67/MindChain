import { createRequire } from "module";
const require = createRequire(import.meta.url);
const router = require("express").Router();
const passport = require("passport");
import user from "../controllers/userController.js";

// Define routes for user-related operations
router.get("/signup", user.userGet);
router.post("/signup", user.userPost);
router.get("/login", user.loginGet);
router.get("/loginFail", user.loginFail);
router.post("/login", user.login);

router.get("/logout", user.logout);

router.post("/sendEmailResetPassword", user.sendEmailResetPassword);

router.post("/resetPassword", user.resetPassword);

router.get("/check-auth", (req, res) => {
  // req.isAuthenticated() é uma função do Passport que verifica se o usuário está autenticado
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

router.post("/fetch-user-name", user.fetchUserName);
router.post("/fetch-user-info", user.fetchUserInfo);
router.post("/change-user-info", user.changeUserInfo);
router.post("/user-metrics", user.userMetrics);
router.post("/delete-account", user.deleteAccount);
router.post("/change-subscription-plan", user.changeSubscriptionPlan);
router.post("/fetch-user-progress", user.userProgress);

export default router;
