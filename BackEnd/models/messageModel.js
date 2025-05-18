import { time } from "console";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import mongoose, { Schema } from "mongoose";

//Modelo das mensagens
// O modelo é composto por um id de sala, um id de usuário e o conteúdo da mensagem
var messageSchema = new mongoose.Schema(
  {
    room: { type: Schema.Types.ObjectId, ref: "Room", require: true },
    user: { type: Schema.Types.ObjectId, ref: "User", require: true },
    content: { type: String, require: true },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
