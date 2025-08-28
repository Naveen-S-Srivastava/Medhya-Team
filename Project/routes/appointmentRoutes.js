import express from "express";
import Appointment from "../models/appointmentModel.js";

const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get("/student/:studentId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ student: req.params.studentId });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
