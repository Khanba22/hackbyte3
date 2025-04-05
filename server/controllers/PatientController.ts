import { Request, Response } from "express";
import mongoose from "mongoose";
import Patient from "../models/Patient";
import Hospital from "../models/Hospital";
import Appointment from "../models/Appointment";

// Get recent hospitals
export const getRecentHospitals = async (req: Request, res: Response) => {
    try {
        console.log(req.params.id)
        const patient = await Patient.findOne({user:req.params.id});
        if(!patient){
            res.status(404).json({message:"Patient Not Found"});
            return;
        }
        const appointments = await Appointment.find({patient:patient._id}).sort({appointmentDate:-1}).limit(10).populate("hospital");
        const hospitals = appointments.map(appointment => appointment.hospital);
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ error: "Error fetching hospitals" });
    }
};

// Get all patients
export const getPatients = async (req: Request, res: Response) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: "Error fetching patients" });
    }
};

// Get a patient by ID
export const getPatientById = async (req: Request, res: Response) => {
    const patientId = req.params.id;
    try {
        const patient = await Patient.findOne({user:patientId});
        if (!patient){
            res.status(404).json({ error: "Patient not found" });
            return
        }

        const appointments = await Appointment.find({ patient: patient._id })
            .populate({ path: "doctor", select: "full_name specialty" })
            .populate({ path: "hospital", select: "name address" })
            .populate("timeSlot")
            .sort({ status: 1, createdAt: -1 });
        res.json({ patient, appointments: appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching patient" });
    }
};

// Add a new patient
export const addPatient = async (req: Request, res: Response) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(500).json({ error: "Error adding patient" });
    }
};

// Update a patient
export const updatePatient = async (req: Request, res: Response) => {
    const patientId = req.params.id;
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(patientId, req.body, { new: true });
        if (!updatedPatient) {
            res.status(404).json({ error: "Patient not found" })
            return
        };
        res.json(updatedPatient);
    } catch (error) {
        res.status(500).json({ error: "Error updating patient" });
    }
};

// Delete a patient
export const deletePatient = async (req: Request, res: Response) => {
    const patientId = req.params.id;
    try {
        const deletedPatient = await Patient.findByIdAndDelete(patientId);
        if (!deletedPatient){
            res.status(404).json({ error: "Patient not found" });
            return
        }
        res.json({ message: "Patient deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting patient" });
    }
};
