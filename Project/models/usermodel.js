import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other", "prefer-not-to-say"] },

  institutionId: { type: String, required: true },
  studentId: { type: String, required: true },
  course: { type: String, required: true },
  year: { type: String, required: true },
  department: { type: String },
  password: { type: String, required: true, minlength: 8 }, 
  securityQuestion: { type: String, required: true },
  securityAnswer: { type: String, required: true },
  privacyConsent: { type: Boolean, required: true },
  dataProcessingConsent: { type: Boolean, required: true },
  emergencyContact: { type: String, required: true },
  emergencyPhone: { type: String, required: true },
  mentalHealthConsent: { type: Boolean, required: true },
  communicationConsent: { type: Boolean, default: false },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  createdAt: { type: Date, default: Date.now },
  assessments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assessment" }],
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
  activityLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }]
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
