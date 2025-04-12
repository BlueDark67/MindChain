import { time } from "console";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import mongoose, { Schema } from "mongoose";

var messageSchema = new mongoose.Schema({
  room: { type: Schema.Types.ObjectId, ref: "Room", require: true },
  user: { type: Schema.Types.ObjectId, ref: "User", require: true },
  content: { type: String, require: true },
  sentAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
