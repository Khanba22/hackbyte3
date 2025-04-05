import mongoose, { Schema, Types } from "mongoose";
import TimeSlot from "./TimeSlot";
import User from "./User";
import Hospital from "./Hospital";

interface IDoctor extends Document {
    user: Schema.Types.ObjectId;
    full_name: string;
    hospital: Schema.Types.ObjectId;
    department: string;
    specialty: string;
    experience: number;
    phone: string;
    available_time_slots: Schema.Types.ObjectId[];  // ✅ Change to array of strings
}

const DoctorSchema = new mongoose.Schema<IDoctor>({
    user: { type: Types.ObjectId, ref: User, required: true },
    full_name: { type: String, required: true },
    hospital: { type: Types.ObjectId, ref: Hospital, required: true },
    department: { type: String, required: true },
    specialty: { type: String, required: true },
    experience: { type: Number, required: true },
    phone: { type: String, required: true },
    available_time_slots: [{ type: Schema.Types.ObjectId, ref: TimeSlot }]
}, { timestamps: true });



export default mongoose.model<IDoctor>('Doctor', DoctorSchema);
