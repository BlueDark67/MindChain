import { time } from "console";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import mongoose, { Schema } from "mongoose";
const passportLocalMongoose = require("passport-local-mongoose");

var roomSchema = new mongoose.Schema({
  theme: { type: String, required: true },
  code: { type: String, required: true },
  password: { type: String, required: false },
  time: { type: Number, required: false },
  text: { type: String, required: false },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

roomSchema.plugin(passportLocalMongoose);
export default mongoose.model("Room", roomSchema);
