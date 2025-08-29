import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/usermodel.js";

export const protect = catchAsync(async (req, res, next) => {
  try {
    // Check for Clerk user ID in headers (sent from frontend)
    const clerkId = req.headers['x-clerk-user-id'];

    if (!clerkId) {
      return next(
        new AppError("You are not logged in. Please login to access", 401)
      );
    }

    // Find user by Clerk ID
    const currentUser = await User.findOne({ clerkId });

    if (!currentUser) {
      return next(
        new AppError("User not found. Please complete your profile setup.", 401)
      );
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid authentication", error: err.message });
  }
});

// Alias for backward compatibility
export const isAuthenticated = protect;


export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
