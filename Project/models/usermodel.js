import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema({
  // Basic auth information only
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  
  password: {
    type: String,
    required: false, // Not required for Google OAuth users
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: false,
    validate: {
      validator: function (el) {
        // Skip validation if password is not set (for Google OAuth users)
        if (!this.password) return true;
        return el === this.password;
      },
      message: "Passwords are not same",
    },
  },

  // OAuth fields
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },

  // Basic role and verification
  role: { 
    type: String, 
    enum: ["student", "admin", "counselor"], 
    default: "student" 
  },
  
  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  // Profile completion status
  isProfileComplete: {
    type: Boolean,
    default: false
  },

  // System fields
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

  refreshToken: {
    type: String,
    default: null
  },

  lastLogin: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
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

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);