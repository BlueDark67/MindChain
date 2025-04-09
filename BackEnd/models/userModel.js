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
});

userSchema.plugin(passportLocalMongoose);
//module.exports = mongoose.model("User", userSchema);
export default mongoose.model("User", userSchema);
