import express from "express";
import { 
  createAppointment, 
  getAppointmentsForStudent, 
  checkPendingAppointment,
  cancelAppointment,
  approveAppointment,
  getAppointmentsForCounselor
} from "../controllers/appointmentController.js";
import { getAppointmentMessages } from "../controllers/messageController.js";

const router = express.Router();

// Student routes
router.post("/", createAppointment);
router.get("/student/:studentId", getAppointmentsForStudent);
router.get("/student/:studentId/pending", checkPendingAppointment);
router.put("/:appointmentId/cancel", cancelAppointment);

// Counselor routes
router.get("/counselor/:counselorId", getAppointmentsForCounselor);
router.put("/:appointmentId/approve", approveAppointment);

// Message routes for appointments
router.get("/:appointmentId/messages", getAppointmentMessages);

export default router;
