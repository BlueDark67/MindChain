import { createRequire } from "module";
const require = createRequire(import.meta.url);
import mongoose from "mongoose";
const passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  //password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  birthdate: { type: Date, required: false },
  nationality: { type: String, required: false },
  // Campos para lembrar o usuário
  rememberToken: { type: String },
  tokenExpires: { type: Date }
});
//alterei isto
//Como é que querias que ele usasse o email se nao defenias isso
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'username',
  usernameQueryFields: ['email'] // Permite pesquisar pelo email além do username
});
//module.exports = mongoose.model("User", userSchema);
export default mongoose.model("User", userSchema);
