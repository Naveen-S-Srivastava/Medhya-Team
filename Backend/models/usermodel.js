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
  console.log('🔐 Pre-save hook triggered');
  console.log('🔐 Password modified:', this.isModified("password"));
  console.log('🔐 Has password:', !!this.password);
  console.log('🔐 Password value:', this.password);
  
  if (!this.isModified("password") || !this.password) {
    console.log('🔐 Skipping password hashing');
    return next();
  }
  
  try {
    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('🔐 Password hashed successfully');
    
    // Remove passwordConfirm from the document (it's not needed in the database)
    this.passwordConfirm = null;
    
    next();
  } catch (err) {
    console.error('🔐 Error hashing password:', err);
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