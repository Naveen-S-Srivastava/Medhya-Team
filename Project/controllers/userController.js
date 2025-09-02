import User from "../models/usermodel.js";
import UserDetails from "../models/userDetailsModel.js";
import ActivityLog from "../models/activityLogModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  user.save({ validateBeforeSave: false });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    refreshToken,
    data: {
      user
    }
  });
};

export const registerUser = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    email,
    phone,
    dateOfBirth,
    gender,
    institutionId,
    studentId,
    course,
    year,
    department,
    password,
    passwordConfirm,
    securityQuestion,
    securityAnswer,
    privacyConsent,
    dataProcessingConsent,
    emergencyContact,
    emergencyPhone,
    mentalHealthConsent,
    communicationConsent,
    googleId,
    profilePicture,
    isEmailVerified = false
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // If user exists and has Google ID, return success (for Google OAuth flow)
    if (existingUser.googleId) {
      return sendTokenResponse(existingUser, 200, res);
    }
    // If user exists but no Google ID, return error
    return next(new AppError('User with this email already exists', 400));
  }

  // Create basic user first
  const user = await User.create({
    email,
    password,
    passwordConfirm,
    googleId,
    profilePicture,
    isEmailVerified,
    isProfileComplete: true, // Profile will be complete after creating details
    role: "student"
  });

  // Create user details
  const userDetails = await UserDetails.create({
    user: user._id,
    firstName,
    lastName,
    username,
    phone,
    dateOfBirth,
    gender,
    institutionId,
    studentId,
    course,
    year,
    department,
    securityQuestion,
    securityAnswer,
    privacyConsent,
    dataProcessingConsent,
    emergencyContact,
    emergencyPhone,
    mentalHealthConsent,
    communicationConsent,
    isProfileComplete: true,
    profileCompletedAt: new Date()
  });

  // Log activity
  try {
    await ActivityLog.create({
      user: user._id,
      action: "user_register",
      metadata: {
        email: user.email,
        userAgent: req.get("user-agent"),
        ip: req.ip
      }
    });
  } catch (error) {
    console.log('Activity log creation failed:', error.message);
  }

  sendTokenResponse(user, 201, res);
});

export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Log activity
  try {
    await ActivityLog.create({
      user: user._id,
      action: "user_login",
      metadata: {
        email: user.email,
        userAgent: req.get("user-agent"),
        ip: req.ip
      }
    });
  } catch (error) {
    console.log('Activity log creation failed:', error.message);
  }

  sendTokenResponse(user, 200, res);
});

export const googleAuth = catchAsync(async (req, res, next) => {
  const { googleId, email, firstName, lastName, profilePicture, loginType } = req.body;

  if (!googleId || !email) {
    return next(new AppError('Google ID and email are required', 400));
  }

  console.log('🔍 Google OAuth login attempt:', { email, loginType });

  // Validate loginType
  if (loginType && !['admin', 'student', 'counselor'].includes(loginType)) {
    return next(new AppError('Invalid login type. Must be "admin", "student", or "counselor"', 400));
  }

  // Check if user exists with this Google ID
  let user = await User.findOne({ googleId });

  if (!user) {
    // Check if user exists with this email
    user = await User.findOne({ email });

    if (user) {
      // User exists but doesn't have Google ID, update it
      user.googleId = googleId;
      
      // Update role if loginType is provided and different from current role
      if (loginType && loginType !== user.role) {
        const newRole = loginType === 'admin' ? 'admin' : loginType === 'counselor' ? 'counselor' : 'student';
        console.log('🔍 Updating existing user role from', user.role, 'to', newRole);
        user.role = newRole;
      } else if (!loginType) {
        console.log('🔍 No loginType provided, keeping existing role:', user.role);
      }
      
      await user.save({ validateBeforeSave: false });
    } else {
      // User doesn't exist - create minimal user record
      console.log('🔍 Creating new user account with Google OAuth');
      
      const userData = {
        googleId,
        email,
        role: loginType || 'student',
        isEmailVerified: true, // Google OAuth users are pre-verified
        isProfileComplete: false, // Profile is not complete yet
        lastLogin: new Date()
      };
      
      user = await User.create(userData);
      console.log('✅ New user account created:', { email: user.email, role: user.role });
    }
  }

  // Log activity
  try {
    await ActivityLog.create({
      user: user._id,
      action: "google_login",
      metadata: {
        email: user.email,
        userAgent: req.get("user-agent"),
        ip: req.ip
      }
    });
  } catch (error) {
    console.log('Activity log creation failed:', error.message);
  }

  console.log('✅ Google OAuth login successful for user:', { email: user.email, role: user.role });
  sendTokenResponse(user, 200, res);
});

export const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError('Refresh token is required', 400));
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    
    // Find user with this refresh token
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return next(new AppError('Invalid refresh token', 401));
    }

    // Generate new tokens
    sendTokenResponse(user, 200, res);
  } catch (error) {
    return next(new AppError('Invalid refresh token', 401));
  }
});

export const logout = catchAsync(async (req, res, next) => {
  // Clear refresh token
  if (req.user) {
    req.user.refreshToken = null;
    await req.user.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

export const getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// Complete Google OAuth profile (no authentication required)
export const completeGoogleProfile = catchAsync(async (req, res, next) => {
  const { email, googleId, ...profileData } = req.body;

  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  // Find user by email or googleId
  let user = null;
  if (googleId) {
    user = await User.findOne({ googleId });
  }
  if (!user && email) {
    user = await User.findOne({ email });
  }

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Update user profile
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      ...profileData,
      isEmailVerified: true
    },
    {
      new: true,
      runValidators: true
    }
  );

  // Generate new tokens
  sendTokenResponse(updatedUser, 200, res);
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    return next(new AppError('Current password is incorrect', 401));
  }

  // Update password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  sendTokenResponse(user, 200, res);
});


