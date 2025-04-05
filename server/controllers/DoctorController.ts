import {Request, Response} from 'express';
import Doctor from "../models/Doctor";

export const getDoctors = async (req:Request, res:Response) => {
    try {
        const doctors = await Doctor.find().populate("available_time_slots");
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching doctors", error: (error as Error).message });
    }
}

export const getDoctorById = async (req:Request, res:Response) => {
    try {
        const doctor = await Doctor.findOne({
            user:req.params.id
        }).populate("user hospital available_time_slots");
        if (!doctor) {
            res.status(404).json({ message: "Doctor not found" });
            return;
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: "Error fetching doctor", error });
    }
}

export const getDoctorByHospital = async(req:Request,res:Response)=>{
    try {
        console.log(req.params.hospitalId)
        const doctors = await Doctor.find({hospital: req.params.hospitalId}).populate("available_time_slots")
        if (doctors.length === 0) {
            res.status(404).json({ message: "Doctor not found" });
            return;
        }
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({message:"Error",error})
    }
}

export const createDoctor = async (req:Request, res:Response) => {
    try {
        const newDoctor = new Doctor(req.body);
        const savedDoctor = await newDoctor.save();
        res.status(201).json(savedDoctor);
    } catch (error) {
        res.status(400).json({ message: "Error creating doctor", error });
    }
}

export const updateDoctor = async (req:Request, res:Response) => {
    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDoctor) {
            res.status(404).json({ message: "Doctor not found" });
        }
        res.status(200).json(updatedDoctor);
    } catch (error) {
        res.status(400).json({ message: "Error updating doctor", error });
    }
}

export const deleteDoctor = async (req:Request, res:Response) => {
    try {
        const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!deletedDoctor) {
            res.status(404).json({ message: "Doctor not found" });
        }
        res.status(200).json({ message: "Doctor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting doctor", error });
    }
}