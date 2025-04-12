import { createRequire } from "module";
const require = createRequire(import.meta.url);
import mongoose, { Schema } from "mongoose";

var roomSchema = new mongoose.Schema({
  theme: { type: String, required: true },
  code: { type: String, required: true },
  password: { type: String, required: false, default: null },
  time: { type: Number, required: false },
  text: { type: String, required: false },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createAt: { type: Date, default: Date.now },
});

export default mongoose.model("Room", roomSchema);
