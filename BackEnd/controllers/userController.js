import { createRequire } from "module";
const require = createRequire(import.meta.url);

const UserModel = require("../models/userModel").default;

const userGet = function (req, res) {
  res.json({ view: "signup" });
};

const userPost = async function (req, res) {
  const { username, password, email } = req.body;
  try {
    await UserModel.register({ username, email }, password);
    res.json({ view: "home" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginGet = function (req, res) {
  res.json({ view: "login" });
};

const logout = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ view: "login" });
  });
};

export default { userGet, userPost, loginGet, logout };
