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

  console.log('🔍 createOrUpdateUserDetails called for user:', userId);
  console.log('🔍 User details data:', userDetailsData);

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    console.log('❌ User not found:', userId);
    return next(new AppError('User not found', 404));
  }

  console.log('✅ User found:', { userId: user._id, currentProfileStatus: user.isProfileComplete });

  // Handle password update if provided
  if (userDetailsData.password && userDetailsData.passwordConfirm && 
      userDetailsData.password.trim() !== '' && userDetailsData.passwordConfirm.trim() !== '') {
    console.log('🔐 Password update detected');
    console.log('🔐 Password provided:', !!userDetailsData.password);
    console.log('🔐 PasswordConfirm provided:', !!userDetailsData.passwordConfirm);
    console.log('🔐 Password length:', userDetailsData.password ? userDetailsData.password.length : 0);
    
    const password = userDetailsData.password.trim();
    const passwordConfirm = userDetailsData.passwordConfirm.trim();
    
    if (password !== passwordConfirm) {
      console.log('❌ Passwords do not match');
      return next(new AppError('Passwords do not match', 400));
    }
    
    if (password.length < 8) {
      console.log('❌ Password too short');
      return next(new AppError('Password must be at least 8 characters long', 400));
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      console.log('❌ Password does not meet complexity requirements');
      return next(new AppError('Password must contain uppercase, lowercase, and number', 400));
    }
    
    // Update user password
    user.password = password;
    user.markModified('password');
    
    // Ensure passwordConfirm is not set to avoid validation issues
    user.passwordConfirm = undefined;
    
    await user.save({ validateBeforeSave: false });
    
    // Remove password fields from userDetailsData to avoid saving them in userDetails
    delete userDetailsData.password;
    delete userDetailsData.passwordConfirm;
    
    console.log('✅ Password updated for user:', userId);
  } else {
    console.log('ℹ️ No password update requested');
    console.log('ℹ️ Password field present:', 'password' in userDetailsData);
    console.log('ℹ️ PasswordConfirm field present:', 'passwordConfirm' in userDetailsData);
    if (userDetailsData.password) {
      console.log('ℹ️ Password value:', userDetailsData.password);
    }
    if (userDetailsData.passwordConfirm) {
      console.log('ℹ️ PasswordConfirm value:', userDetailsData.passwordConfirm);
    }
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

  // Check if all required fields are filled to determine profile completion
  const requiredFields = [
    'firstName', 'lastName', 'username', 'phone', 'dateOfBirth', 'gender',
    'institutionId', 'studentId', 'course', 'year',
    'securityQuestion', 'securityAnswer',
    'privacyConsent', 'dataProcessingConsent', 'emergencyContact', 
    'emergencyPhone', 'mentalHealthConsent'
  ];

  const allFieldsComplete = requiredFields.every(field => userDetails[field]);
  
  console.log('🔍 Profile completion check:', {
    requiredFields,
    allFieldsComplete,
    userDetailsFields: Object.keys(userDetails._doc).filter(key => !key.startsWith('_')),
    fieldValues: requiredFields.reduce((acc, field) => {
      acc[field] = userDetails[field];
      return acc;
    }, {})
  });
  
  // Update user profile completion status based on field completion
  if (allFieldsComplete && !user.isProfileComplete) {
    console.log('✅ All fields complete, updating user profile completion status to true');
    user.isProfileComplete = true;
    await user.save({ validateBeforeSave: false });
    userDetails.isProfileComplete = true;
  } else if (!allFieldsComplete && user.isProfileComplete) {
    console.log('❌ Not all fields complete, updating user profile completion status to false');
    user.isProfileComplete = false;
    await user.save({ validateBeforeSave: false });
    userDetails.isProfileComplete = false;
  } else {
    console.log('ℹ️ Profile completion status unchanged:', {
      allFieldsComplete,
      userIsProfileComplete: user.isProfileComplete
    });
  }

  const responseData = {
    status: 'success',
    message: 'User details updated successfully',
    data: {
      userDetails
    }
  };
  
  console.log('✅ User details updated successfully:', {
    userId: user._id,
    userIsProfileComplete: user.isProfileComplete,
    userDetailsIsProfileComplete: userDetails.isProfileComplete
  });
  
  res.status(200).json(responseData);
});

// Mark profile as complete
export const markProfileComplete = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  console.log('🔍 markProfileComplete called for user:', userId);

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    console.log('❌ User not found:', userId);
    return next(new AppError('User not found', 404));
  }

  console.log('✅ User found:', { userId: user._id, currentProfileStatus: user.isProfileComplete });

  // Check if user details exist and are complete
  const userDetails = await UserDetails.findOne({ user: userId });
  if (!userDetails) {
    console.log('❌ User details not found for user:', userId);
    return next(new AppError('User details not found. Please complete your profile first.', 400));
  }

  console.log('✅ User details found:', { 
    userId: userDetails.user, 
    isProfileComplete: userDetails.isProfileComplete,
    hasAllFields: Boolean(userDetails.firstName && userDetails.lastName && userDetails.username)
  });

  // Validate that all required fields are filled
  const requiredFields = [
    'firstName', 'lastName', 'username', 'phone', 'dateOfBirth', 'gender',
    'institutionId', 'studentId', 'course', 'year',
    'securityQuestion', 'securityAnswer',
    'privacyConsent', 'dataProcessingConsent', 'emergencyContact', 
    'emergencyPhone', 'mentalHealthConsent'
  ];

  const missingFields = requiredFields.filter(field => !userDetails[field]);
  
  console.log('🔍 Field validation:', {
    requiredFields,
    missingFields,
    userDetailsFields: Object.keys(userDetails._doc).filter(key => !key.startsWith('_'))
  });
  
  if (missingFields.length > 0) {
    console.log('❌ Missing required fields:', missingFields);
    return next(new AppError(`Please complete the following fields: ${missingFields.join(', ')}`, 400));
  }

  // Mark profile as complete
  userDetails.isProfileComplete = true;
  await userDetails.save();

  // Update user profile completion status
  user.isProfileComplete = true;
  await user.save({ validateBeforeSave: false });

  console.log('✅ Profile marked complete successfully:', {
    userId: user._id,
    userIsProfileComplete: user.isProfileComplete,
    userDetailsIsProfileComplete: userDetails.isProfileComplete
  });

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

  console.log('🔍 getProfileCompletionStatus called for user:', userId);

  const user = await User.findById(userId);
  if (!user) {
    console.log('❌ User not found:', userId);
    return next(new AppError('User not found', 404));
  }

  console.log('✅ User found:', { userId: user._id, isProfileComplete: user.isProfileComplete });

  const userDetails = await UserDetails.findOne({ user: userId });
  
  let completionPercentage = 0;
  let missingFields = [];

  if (userDetails) {
    console.log('✅ User details found:', { 
      userId: userDetails.user, 
      isProfileComplete: userDetails.isProfileComplete 
    });
    
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
    
    console.log('🔍 Profile completion analysis:', {
      requiredFields,
      completedFields,
      missingFields,
      completionPercentage,
      userDetailsFields: Object.keys(userDetails._doc).filter(key => !key.startsWith('_'))
    });
  } else {
    console.log('❌ User details not found for user:', userId);
  }

  const responseData = {
    status: 'success',
    data: {
      isProfileComplete: user.isProfileComplete,
      completionPercentage,
      missingFields,
      userDetails: userDetails || null
    }
  };
  
  console.log('✅ Sending profile completion status response:', responseData);
  
  res.status(200).json(responseData);
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
