import { createRequire } from "module";
const require = createRequire(import.meta.url);
import mongoose, { Schema } from "mongoose";

var roomSchema = new mongoose.Schema(
  {
    theme: { type: String, required: true },
    code: { type: String, required: true },
    password: { type: String, required: false, default: null },
    time: { type: Number, required: false },
    text: { type: String, required: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    lastActivity: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    isPrivate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
