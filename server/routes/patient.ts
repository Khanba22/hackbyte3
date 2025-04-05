import express from "express";
import {
    getPatientById,
    getPatients,
    getRecentHospitals,
    addPatient,
    deletePatient,
    updatePatient,
} from "../controllers/PatientController";

const router = express.Router();

// Route to get all patients
router.get("/", getPatients);

// Route to get a patient by ID
router.get("/:id", getPatientById);

// Route to get recent hospitals for a patient
router.get("/:id/recent-hospitals", getRecentHospitals);

// Route to add a new patient
router.post("/", addPatient);

// Route to update a patient by ID
router.put("/:id", updatePatient);

// Route to delete a patient by ID
router.delete("/:id", deletePatient);

export default router;