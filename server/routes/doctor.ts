import express from "express";
import mongoose from "mongoose";
import Doctor from "../models/Doctor";
import TimeSlot from "../models/TimeSlot";
import { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor, getDoctorByHospital } from "../controllers/DoctorController";


const router = express.Router();

router.get("/", getDoctors);

// Get a single doctor by ID
router.get("/:id", getDoctorById);
router.get("/get-by-hospital/:hospitalId",getDoctorByHospital)
// Create a new doctor
router.post("/", createDoctor);

// Update a doctor by ID
router.put("/:id", updateDoctor);

// Delete a doctor by ID
router.delete("/:id",deleteDoctor);

export default router;