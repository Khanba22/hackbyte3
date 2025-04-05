import mongoose, { Schema } from "mongoose";
import User from "./User";

interface IMessage{
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    message: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const MessageSchema = new mongoose.Schema({
    sender: { type: Schema.Types.ObjectId, ref: User },
    receiver: { type: Schema.Types.ObjectId, ref: User },
    message: { type: String, required: true }
}, {
    timestamps: true
});

const Message = mongoose.model<IMessage>("Message", MessageSchema);

export default Message;