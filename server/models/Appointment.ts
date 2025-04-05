import mongoose, { Schema, Document } from "mongoose";
import Hospital from "./Hospital";
import Patient from "./Patient";
import Doctor from "./Doctor";
import TimeSlot from "./TimeSlot";

export interface IAppointment extends Document {
  hospital: Schema.Types.ObjectId;
  patient: Schema.Types.ObjectId;
  doctor: Schema.Types.ObjectId;
  appointmentDate:string;
  timeSlot: Schema.Types.ObjectId;
  diagnosis:string;
  prescription:string;
  review:string;
  rating:number;
  status: string;
}

const AppointmentSchema = new Schema<IAppointment>({
  appointmentDate:{type:String,required:true},
  hospital: { type: Schema.Types.ObjectId, ref: Hospital, required: true },
  patient: { type: Schema.Types.ObjectId, ref: Patient, required: true },
  doctor: { type: Schema.Types.ObjectId, ref: Doctor, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed", "scheduled"],
    default: "pending",
  },
  diagnosis:String,
  prescription:String,
  review:String,
  rating:Number,
  timeSlot: { type: Schema.Types.ObjectId, ref: TimeSlot, required: true },
});

export default mongoose.model<IAppointment>(
  "Appointment",
  AppointmentSchema
);
