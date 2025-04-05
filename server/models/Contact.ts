import mongoose, { model, Schema } from "mongoose";

interface IContact{
    // Meta Data of a contact
    isGroupChat:boolean;
    createdAt:Date;
}

const ContactSchema = new Schema<IContact>({
    isGroupChat:Boolean
},{
    timestamps:true
})

export default model("Contact",ContactSchema)