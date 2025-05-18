import { createRequire } from "module";
const require = createRequire(import.meta.url);
import mongoose, { Schema } from "mongoose";


//Modelo da sala
// A sala é criada com um tema, um código, uma senha (opcional), um tempo (opcional), um texto (opcional), uma lista de usuários, uma lista de mensagens, a última atividade, se está ativa ou não, se é privada ou não e o tempo da sessão
var roomSchema = new mongoose.Schema(
  {
    theme: { type: String, required: true },
    code: { type: String, required: true },
    password: { type: String, required: false, default: null },
    time: { type: Number, required: false },
    text: { type: String, required: false, default: null },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    lastActivity: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    isPrivate: { type: Boolean, default: false },
    timeOfSession: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
