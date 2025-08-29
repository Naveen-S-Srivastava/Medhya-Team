import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },

  username: {
    type: String,
    required: [true, "Please provide username"],
    trim: true,
    minlength: 3,
    maxlength: 30,
    index: true,
  },
  email: {
    type: String,
    required: [true, "Please Proovide an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other", "prefer-not-to-say"] },

  institutionId: { type: String, required: true },
  studentId: { type: String, required: true },
  course: { type: String, required: true },
  year: { type: String, required: true },
  department: { type: String },
  password: {
    type: String,
    required: [true, "Please Provide a password"],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "Please Confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not same",
    },
  },
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
  activityLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],

  isVerified: {
    type: Boolean,
    default: false,
  },

  otp: {
    type: String,
    default: null,
  },

  otpExpires: {
    type: Date,
    default: null,
  },

  resetPasswordOTP: {
    type: String,
    default: null,
  },

  resetPasswordOTPExpires: {
    type: Date,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
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
userSchema.methods.correctPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
