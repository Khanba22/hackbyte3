import mongoose, { Schema, Document } from 'mongoose';

interface IHospital extends Document {
    name: string;
    address: string;
    city: string;
    state: string;
    specialty: string;
    bed_total: number;
    bed_available: number;
    is_icu_available: boolean;
    icu_total: number;
    icu_available: number;
    phone: string;
    email: string;
    established: Date;
    image?: string;
    rating?: number;
    location:{
        lon:number,
        lat:number,
    }
}

const HospitalSchema = new mongoose.Schema<IHospital>({
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    specialty: { type: String, required: true },
    bed_total: { type: Number, required: true },
    bed_available: { type: Number, required: true },
    is_icu_available: { type: Boolean, required: true },
    icu_total: { type: Number, required: true },
    icu_available: { type: Number, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String },
    location:{
        lat:Number,
        lon:Number
    },
    rating: { type: Number, default: 0 }
}, { timestamps: true });


export default mongoose.model<IHospital>('Hospital', HospitalSchema);