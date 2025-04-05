import mongoose, { Schema, Types, Document } from "mongoose";
import Doctor from "./Doctor";

interface ITimeSlot extends Document{
    doctor:Schema.Types.ObjectId;
    day_of_week: string;
    start_time: string;
    end_time: string;
}

const TimeSlotSchema = new mongoose.Schema<ITimeSlot>({
    day_of_week: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], required: true },
    start_time: { type: String, required: true }, // "HH:mm"
    end_time: { type: String, required: true }   // "HH:mm"
}, { timestamps: true });


export default mongoose.model<ITimeSlot>('TimeSlot', TimeSlotSchema);