import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    googleId?: string;
    isPasswordSet: boolean;
    role:string;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role:{type:String,enum:["doctor","user","patient"]},
    googleId: { type: String, unique: true, sparse: true }, // Google OAuth ID
    isPasswordSet: { type: Boolean, default: false }
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
