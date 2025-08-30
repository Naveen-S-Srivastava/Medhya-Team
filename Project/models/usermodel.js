// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema({
//   firstName: { type: String, required: true, trim: true },
//   lastName: { type: String, required: false, trim: true },

//   username: {
//     type: String,
//     required: [true, "Please provide username"],
//     trim: true,
//     minlength: 3,
//     maxlength: 30,
//     index: true,
//   },
//   email: {
//     type: String,
//     required: [true, "Please Proovide an email"],
//     unique: true,
//     lowercase: true,
//     validate: [validator.isEmail, "Please provide a valid email"],
//   },
//   phone: { type: String, required: false },
//   dateOfBirth: { type: Date, required: false },

//   gender: { type: String, enum: ["male", "female", "other", "prefer-not-to-say"] },

//   institutionId: { type: String, required: true },
//   studentId: { type: String, required: true },
//   course: { type: String, required: true },
//   year: { type: String, required: true },
//   department: { type: String },
//   password: {
//     type: String,
//     required: [true, "Please Provide a password"],
//     minlength: 8,
//     select: false,
//   },

//   passwordConfirm: {
//     type: String,
//     required: [true, "Please Confirm your password"],
//     validate: {
//       validator: function (el) {
//         return el === this.password;
//       },
//       message: "Passwords are not same",
//     },
//   },
//   securityQuestion: { type: String, required: true },
//   securityAnswer: { type: String, required: true },
//   privacyConsent: { type: Boolean, required: true },
//   dataProcessingConsent: { type: Boolean, required: true },
//   emergencyContact: { type: String, required: true },
//   emergencyPhone: { type: String, required: true },
//   mentalHealthConsent: { type: Boolean, required: true },
//   communicationConsent: { type: Boolean, default: false },
//   role: { type: String, enum: ["student", "admin", "counselor"], default: "student" },
//   createdAt: { type: Date, default: Date.now },
//   assessments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assessment" }],
//   appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
//   activityLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],

//   isVerified: {
//     type: Boolean,
//     default: false,
//   },

//   otp: {
//     type: String,
//     default: null,
//   },

//   otpExpires: {
//     type: Date,
//     default: null,
//   },

//   resetPasswordOTP: {
//     type: String,
//     default: null,
//   },

//   resetPasswordOTPExpires: {
//     type: Date,
//     default: null,
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   }
// }, { timestamps: true });

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });
// userSchema.methods.correctPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// export default mongoose.model("User", userSchema);





import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";


const userSchema = new mongoose.Schema({


  firstName: { type: String, required: false, trim: true },
  lastName: { type: String, required: false, trim: true },

  username: {
    type: String,
    required: false,
    trim: true,
    minlength: 3,
    maxlength: 30,
    index: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: { type: String, required: false },
  dateOfBirth: { type: Date, required: false },
  gender: { type: String, enum: ["male", "female", "other", "prefer-not-to-say"], required: false },

  institutionId: { type: String, required: false },
  studentId: { type: String, required: false },
  course: { type: String, required: false },
  year: { type: String, required: false },
  department: { type: String },
  password: {
    type: String,
    required: false,
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
  securityQuestion: { type: String, required: false },
  securityAnswer: { type: String, required: false },
  privacyConsent: { type: Boolean, required: false },
  dataProcessingConsent: { type: Boolean, required: false },
  emergencyContact: { type: String, required: false },
  emergencyPhone: { type: String, required: false },
  mentalHealthConsent: { type: Boolean, required: false },
  communicationConsent: { type: Boolean, default: false },
  role: { type: String, enum: ["student", "admin", "counselor"], default: "student" },
  counselorProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Counselor" },
  assessments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assessment" }],
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
  activityLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

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

  // JWT and OAuth fields
  googleId: {
    type: String,
    unique: true,
    sparse: true
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