import { createRequire } from "module";
const require = createRequire(import.meta.url);
import mongoose from "mongoose";
const passportLocalMongoose = require("passport-local-mongoose");

//Modelo do utilizador
//O modelo do utilizador é utilizado para armazenar informações sobre os utilizadores
//O utilizador tem um nome de utilizador, um email, uma data de nascimento, uma nacionalidade, um token de lembrete, uma data de expiração do token, um plano de subscrição e um método de pagamento
var userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },

  email: { type: String, required: true, unique: true },
  birthdate: { type: Date, required: false },
  nationality: { type: String, required: false },
  rememberToken: { type: String },
  tokenExpires: { type: Date },
  subscriptionPlan: { type: String, required: true, default: "Standard" },
  paymentMethod: { type: String, required: false },
},{ timestamps: true }
);

// Adiciona o plugin passport-local-mongoose ao esquema
userSchema.plugin(passportLocalMongoose, {
  usernameField: "username",
  usernameQueryFields: ["email"], // Permite pesquisar pelo email além do username
});
//module.exports = mongoose.model("User", userSchema);
export default mongoose.model("User", userSchema);
