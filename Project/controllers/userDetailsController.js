import UserDetails from "../models/userDetailsModel.js";
import User from "../models/usermodel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// Get user details by user ID
export const getUserDetails = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const userDetails = await UserDetails.findOne({ user: userId })
    .populate('user', 'email role isProfileComplete');

  if (!userDetails) {
    return next(new AppError('User details not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      userDetails
    }
  });
});

// Create or update user details
export const createOrUpdateUserDetails = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const userDetailsData = req.body;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if user details already exist
  let userDetails = await UserDetails.findOne({ user: userId });

  if (userDetails) {
    // Update existing user details
    Object.assign(userDetails, userDetailsData);
    await userDetails.save();
  } else {
    // Create new user details
    userDetails = await UserDetails.create({
      user: userId,
      ...userDetailsData
    });
  }

  // Update user profile completion status
  if (userDetails.isProfileComplete && !user.isProfileComplete) {
    user.isProfileComplete = true;
    await user.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    status: 'success',
    message: 'User details updated successfully',
    data: {
      userDetails
    }
  });
});

// Mark profile as complete
export const markProfileComplete = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if user details exist and are complete
  const userDetails = await UserDetails.findOne({ user: userId });
  if (!userDetails) {
    return next(new AppError('User details not found. Please complete your profile first.', 400));
  }

  // Validate that all required fields are filled
  const requiredFields = [
    'firstName', 'lastName', 'username', 'phone', 'dateOfBirth', 'gender',
    'institutionId', 'studentId', 'course', 'year',
    'securityQuestion', 'securityAnswer',
    'privacyConsent', 'dataProcessingConsent', 'emergencyContact', 
    'emergencyPhone', 'mentalHealthConsent'
  ];

  const missingFields = requiredFields.filter(field => !userDetails[field]);
  
  if (missingFields.length > 0) {
    return next(new AppError(`Please complete the following fields: ${missingFields.join(', ')}`, 400));
  }

  // Mark profile as complete
  userDetails.isProfileComplete = true;
  await userDetails.save();

  // Update user profile completion status
  user.isProfileComplete = true;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Profile marked as complete successfully',
    data: {
      userDetails
    }
  });
});

// Get profile completion status
export const getProfileCompletionStatus = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const userDetails = await UserDetails.findOne({ user: userId });
  
  let completionPercentage = 0;
  let missingFields = [];

  if (userDetails) {
    const requiredFields = [
      'firstName', 'lastName', 'username', 'phone', 'dateOfBirth', 'gender',
      'institutionId', 'studentId', 'course', 'year',
      'securityQuestion', 'securityAnswer',
      'privacyConsent', 'dataProcessingConsent', 'emergencyContact', 
      'emergencyPhone', 'mentalHealthConsent'
    ];

    const completedFields = requiredFields.filter(field => userDetails[field]);
    completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);
    missingFields = requiredFields.filter(field => !userDetails[field]);
  }

  res.status(200).json({
    status: 'success',
    data: {
      isProfileComplete: user.isProfileComplete,
      completionPercentage,
      missingFields,
      userDetails: userDetails || null
    }
  });
});

// Delete user details (for admin purposes)
export const deleteUserDetails = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const userDetails = await UserDetails.findOneAndDelete({ user: userId });
  
  if (!userDetails) {
    return next(new AppError('User details not found', 404));
  }

  // Update user profile completion status
  const user = await User.findById(userId);
  if (user) {
    user.isProfileComplete = false;
    await user.save({ validateBeforeSave: false });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
