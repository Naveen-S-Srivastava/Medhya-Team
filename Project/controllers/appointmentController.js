import Appointment from "../models/appointmentModel.js";
import ActivityLog from "../models/activityLogModel.js";

export const createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    try {
      await ActivityLog.create({
        user: appointment.student,
        action: "appointment_create",
        metadata: {
          counselor: appointment.counselor,
          date: appointment.date,
          timeSlot: appointment.timeSlot,
          urgencyLevel: appointment.urgencyLevel
        }
      });
    } catch {}
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAppointmentsForStudent = async (req, res) => {
  try {
    const appointments = await Appointment.find({ student: req.params.studentId });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


