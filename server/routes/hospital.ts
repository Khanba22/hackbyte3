import express from "express"

const router = express.Router();

import { createHospital, deleteHospital, getHospitalById, getHospitals, updateHospital,getRecommendation } from "../controllers/HospitalController";

router.post("/", createHospital);
router.post("/get-recommendation",getRecommendation)
router.get("/", getHospitals);
router.get("/:id", getHospitalById);
router.put("/:id", updateHospital);
router.delete("/:id", deleteHospital);

export default router;