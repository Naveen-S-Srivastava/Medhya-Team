import Appointment from "../models/appointmentModel.js";
import ActivityLog from "../models/activityLogModel.js";
import mongoose from "mongoose";

export const createAppointment = async (req, res) => {
  try {
    const appointmentData = { ...req.body };
    
    // For demo purposes, if student is not a valid ObjectId, create a temporary user reference
    if (!mongoose.Types.ObjectId.isValid(appointmentData.student)) {
      // Create a temporary user ID for demo purposes
      appointmentData.student = new mongoose.Types.ObjectId();
    }
    
    const appointment = new Appointment(appointmentData);
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
    } catch (error) {
      console.log('Activity log creation failed:', error.message);
    }
    
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAppointmentsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // For demo purposes, if studentId is not a valid ObjectId, return empty array
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.json([]);
    }
    
    const appointments = await Appointment.find({ student: studentId });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


