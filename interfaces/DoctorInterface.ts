import mongoose from "mongoose";

interface IDoctor {
    user: string;
    full_name: string;
    hospital: string;
    department: string;
    specialty: string;
    experience: number;
    phone: string;
    available_time_slots: mongoose.Schema.Schema.Types.ObjectId[];  // ✅ Change to array of strings
}
