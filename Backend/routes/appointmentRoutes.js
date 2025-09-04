import express from "express";
import { createAppointment, getAppointmentsForStudent } from "../controllers/appointmentController.js";

const router = express.Router();
router.post("/", createAppointment);
router.get("/student/:studentId", getAppointmentsForStudent);

export default router;
