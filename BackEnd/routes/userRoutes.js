import { createRequire } from "module";
const require = createRequire(import.meta.url);
const router = require("express").Router();
const passport = require("passport");
import user from "../controllers/userController.js";

router.get("/signup", user.userGet);
router.post("/signup", user.userPost);
router.get("/login", user.loginGet);
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    res.json({ view: "home" });
  }
);
router.get("/logout", user.logout);
router.post("/teste", (req, res) => {
  res.json({ view: "teste" });
});

export default router;
