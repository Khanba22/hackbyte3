import { Router } from "express";

import { createAppointment, getAllAppointments,getPatientAppointments, getAppointmentsByDoctor, getAppointmentsByDoctorAndHospital, getAppointmentsByHospital, getAppointmentById } from "../controllers/AppointmentController";

const router = Router();

router.post("/", createAppointment);
router.get("/", getAllAppointments);
router.get("/get-doctor-appointment/:doctorId", getAppointmentsByDoctor);
router.get("/get-patient-appointment/:id", getPatientAppointments);
router.get("/get-hospital-appointment/:hospitalId", getAppointmentsByHospital);
router.get("/doctor/:doctorId/hospital/:hospitalId", getAppointmentsByDoctorAndHospital);
router.get("/:id", getAppointmentById); 

export default router;