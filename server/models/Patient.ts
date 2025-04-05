import mongoose, { model, Schema, Types } from "mongoose";
import User from "./User";

interface IPatient extends Document{
    user: Schema.Types.ObjectId;
    full_name: string;
    phone: string;
    date_of_birth: Date;
    weight: number;
    height: number;
    blood_group: string;
    address: string;
    city: string;
    state: string;
}

const PatientSchema = new mongoose.Schema<IPatient>({
  user: { type: Schema.Types.ObjectId, ref: User, required: true },
  full_name: { type: String, required: true },
  phone: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  blood_group: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true }
}, { timestamps: true });



export default model<IPatient>('Patient', PatientSchema);