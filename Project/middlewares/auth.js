import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/usermodel.js";

export const isAuthenticated = catchAsync(async (req, res, next) => {
 try{ const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(
      new AppError("You are not logged in. Please login to access", 401)
    );
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decode.id);

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does not exist", 401)
    );
  }

//   if (!currentUser.isVerified) {
//     return next(new AppError("Please verify your email to continue.", 403));
//   }

  req.user = currentUser;

  next();
} catch (err) {
  return res.status(401).json({ message: "Invalid token, authorization denied" });
}
});


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
