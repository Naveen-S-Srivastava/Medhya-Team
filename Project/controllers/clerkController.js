import User from "../models/usermodel.js";
import ActivityLog from "../models/activityLogModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// Sync Clerk user with backend database
export const syncClerkUser = catchAsync(async (req, res, next) => {
  const { clerkId, email, firstName, lastName, phone } = req.body;

  if (!clerkId || !email) {
    return next(new AppError("Clerk ID and email are required", 400));
  }

  try {
    // Check if user already exists by clerkId or email
    let user = await User.findOne({
      $or: [{ clerkId }, { email }]
    });

    if (user) {
      // Update existing user with clerkId if not already set
      if (!user.clerkId) {
        user.clerkId = clerkId;
        await user.save();
      }

      // Log activity
      await ActivityLog.create({
        user: user._id,
        action: "CLERK_SYNC",
        details: "User synced with Clerk authentication"
      });

      res.status(200).json({
        status: "success",
        message: "User synced successfully",
        data: user
      });
    } else {
      // Create new user
      const newUser = await User.create({
        clerkId,
        email,
        firstName: firstName || "",
        lastName: lastName || "",
        phone: phone || "",
        role: "student", // Default role
        isEmailVerified: true, // Clerk handles email verification
        // Set default values for required fields
        institutionId: "",
        studentId: "",
        course: "",
        year: "",
        department: "",
        emergencyContact: "",
        emergencyPhone: "",
        securityQuestion: "",
        securityAnswer: "",
        privacyConsent: false,
        dataProcessingConsent: false,
        mentalHealthConsent: false,
        communicationConsent: false
      });

      // Log activity
      await ActivityLog.create({
        user: newUser._id,
        action: "CLERK_SIGNUP",
        details: "New user created via Clerk authentication"
      });

      res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: newUser
      });
    }
  } catch (error) {
    console.error("Error syncing Clerk user:", error);
    return next(new AppError("Failed to sync user", 500));
  }
});

// Get user by Clerk ID
export const getUserByClerkId = catchAsync(async (req, res, next) => {
  const { clerkId } = req.params;

  const user = await User.findOne({ clerkId });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: user
  });
});

// Update user profile
export const updateUserProfile = catchAsync(async (req, res, next) => {
  const { clerkId } = req.params;

  const user = await User.findOneAndUpdate(
    { clerkId },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Log activity
  await ActivityLog.create({
    user: user._id,
    action: "UPDATE_PROFILE",
    details: "User profile updated"
  });

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    data: user
  });
});

// Complete user profile (for new users)
export const completeUserProfile = catchAsync(async (req, res, next) => {
  const { clerkId } = req.params;
  const {
    phone,
    dateOfBirth,
    gender,
    institutionId,
    studentId,
    course,
    year,
    department,
    emergencyContact,
    emergencyPhone,
    securityQuestion,
    securityAnswer
  } = req.body;

  const user = await User.findOne({ clerkId });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Update user profile with provided data
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      phone,
      dateOfBirth,
      gender,
      institutionId,
      studentId,
      course,
      year,
      department,
      emergencyContact,
      emergencyPhone,
      securityQuestion,
      securityAnswer
    },
    {
      new: true,
      runValidators: true
    }
  );

  // Log activity
  await ActivityLog.create({
    user: updatedUser._id,
    action: "COMPLETE_PROFILE",
    details: "User profile completed"
  });

  res.status(200).json({
    status: "success",
    message: "Profile completed successfully",
    data: updatedUser
  });
});

// Get user profile with activity summary
export const getUserProfile = catchAsync(async (req, res, next) => {
  const { clerkId } = req.params;

  const user = await User.findOne({ clerkId });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Get recent activity
  const recentActivity = await ActivityLog.find({ user: user._id })
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json({
    status: "success",
    data: {
      user,
      recentActivity
    }
  });
});
