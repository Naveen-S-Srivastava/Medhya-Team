
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

  // Profile information
  firstName: {
    type: String,
    trim: true
  },

  lastName: {
    type: String,
    trim: true
  },

  phone: {
    type: String,
    trim: true
  },

  profileImage: {
    type: String,
    default: null
  },

  // Reference to counselor profile (for counselor users)
  counselorProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counselor',
    default: null
  },

  // Reference to user details (for student users)
  userDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetails',
    default: null
  },
  
  // isEmailVerified: {
  //   type: Boolean,
  //   default: false,
  // },

  isVerified: {
    type: Boolean,
    default: false,
  },

  // Profile completion status
  isProfileComplete: {
    type: Boolean,
    default: false
  },

  // Password change requirement
  requiresPasswordChange: {
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

  // resetPasswordOTP: {
  //   type: String,
  //   default: null,
  // },

  // resetPasswordOTPExpires: {
  //   type: Date,
  //   default: null,
  // },

  refreshToken: {
    type: String,
    default: null
  },

  lastLogin: {
    type: Date,
    default: null
  },

  // Streak tracking
  currentStreak: {
    type: Number,
    default: 0
  },

  longestStreak: {
    type: Number,
    default: 0
  },

  lastStreakDate: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { 
  timestamps: true,
  strictPopulate: false // Allow population of paths not explicitly defined in schema
});

userSchema.pre("save", async function (next) {
  console.log('🔐 Pre-save hook triggered for user:', this._id);
  console.log('🔐 Password modified:', this.isModified("password"));
  console.log('🔐 Has password:', !!this.password);
  console.log('🔐 Password value length:', this.password ? this.password.length : 0);
  console.log('🔐 PasswordConfirm value:', !!this.passwordConfirm);
  
if (!this.password) {
    console.log('🔐 Skipping password hashing - no password');
    return next();
  }

  // Check if password is already hashed (starts with $2a$ or $2b$)
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    console.log('🔐 Password already hashed, skipping');
    return next();
  }

  try {
    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('🔐 Password hashed successfully, new length:', this.password.length);
    console.log('🔐 Hashed password starts with:', this.password.substring(0, 10));
    
    // Remove passwordConfirm from the document (it's not needed in the database)
    delete this.passwordConfirm;
    
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

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.email;
});

// Virtual to check if user is a counselor
userSchema.virtual('isCounselor').get(function() {
  return this.role === 'counselor' && this.counselorProfile;
});

// Method to get counselor profile
userSchema.methods.getCounselorProfile = async function() {
  if (this.role === 'counselor' && this.counselorProfile) {
    const Counselor = mongoose.model('Counselor');
    return await Counselor.findById(this.counselorProfile);
  }
  return null;
};

// Method to check if user has complete profile
userSchema.methods.hasCompleteProfile = function() {
  if (this.role === 'counselor') {
    return this.counselorProfile && this.firstName && this.lastName;
  }
  return this.firstName && this.lastName;
};

// Method to update login streak
userSchema.methods.updateLoginStreak = function() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastStreakDate = this.lastStreakDate ? new Date(this.lastStreakDate.getFullYear(), this.lastStreakDate.getMonth(), this.lastStreakDate.getDate()) : null;

  console.log(`🔥 updateLoginStreak called for user ${this._id}`);
  console.log(`🔥 Current values: currentStreak=${this.currentStreak}, longestStreak=${this.longestStreak}, lastStreakDate=${this.lastStreakDate}`);

  if (!lastStreakDate) {
    // First login
    this.currentStreak = 1;
    this.longestStreak = Math.max(this.longestStreak || 0, 1);
    this.lastStreakDate = today;
    console.log(`🔥 First login: setting currentStreak=1, longestStreak=${this.longestStreak}`);
  } else {
    const daysDifference = Math.floor((today - lastStreakDate) / (1000 * 60 * 60 * 24));
    console.log(`🔥 Days difference: ${daysDifference}`);

    if (daysDifference === 1) {
      // Consecutive day
      this.currentStreak = (this.currentStreak || 0) + 1;
      this.longestStreak = Math.max(this.longestStreak || 0, this.currentStreak);
      this.lastStreakDate = today;
      console.log(`🔥 Consecutive day: currentStreak=${this.currentStreak}, longestStreak=${this.longestStreak}`);
    } else if (daysDifference > 1) {
      // Streak broken
      this.currentStreak = 1;
      this.longestStreak = Math.max(this.longestStreak || 0, 1);
      this.lastStreakDate = today;
      console.log(`🔥 Streak broken: resetting to currentStreak=1, longestStreak=${this.longestStreak}`);
    } else if (daysDifference === 0) {
      console.log(`🔥 Same day login: no streak update needed`);
    } else {
      console.log(`🔥 Unexpected days difference: ${daysDifference}`);
    }
  }

  this.lastLogin = now;
  console.log(`🔥 Final values: currentStreak=${this.currentStreak}, longestStreak=${this.longestStreak}, lastStreakDate=${this.lastStreakDate}`);
  return this.save();
};

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export default mongoose.model("User", userSchema);