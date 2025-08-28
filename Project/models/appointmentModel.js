import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  counsellor: {type: mongoose.Schema.Types.ObjectId, ref: "User"}, 
  date: {type: Date, required: true },
  time: {type: String, required: true },
  mode: {type: String, enum: ["online", "offline"], default: "offline" },
  status: {type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
