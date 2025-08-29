import mongoose from "mongoose";

const availabilitySlotSchema = new mongoose.Schema({
  dayOfWeek: { type: Number, min: 0, max: 6, required: true }, // 0=Sun
  startTime: { type: String, required: true }, // e.g. "09:00"
  endTime: { type: String, required: true },   // e.g. "17:00"
}, { _id: false });

const counselorSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String },

  institutionId: { type: String, required: true, index: true },

  specialties: [{ type: String, trim: true }], // e.g., depression, anxiety, crisis
  languages: [{ type: String, trim: true }],   // e.g., English, Hindi

  availability: [availabilitySlotSchema],

  active: { type: Boolean, default: true, index: true },

  // load management
  maxConcurrent: { type: Number, default: 5, min: 1 },
  currentOpenAssignments: { type: Number, default: 0, min: 0 },
  lastAssignedAt: { type: Date },
}, { timestamps: true });

counselorSchema.index({ institutionId: 1, active: 1 });
counselorSchema.index({ lastAssignedAt: 1 });

export default mongoose.model("Counselor", counselorSchema);


