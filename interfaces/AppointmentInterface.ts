import mongoose from "mongoose";

interface IAppointment{
  patient: mongoose.Schema.Schema.Types.ObjectId;
  hospital: mongoose.Schema.Schema.Types.ObjectId;
  doctor: mongoose.Schema.Schema.Types.ObjectId;
  status: "scheduled" | "completed" | "cancelled";
  time_slot: Date;
  category: string;
  description: string;
  diagnosis: string;
  prescription: string;
  fee: number;
}