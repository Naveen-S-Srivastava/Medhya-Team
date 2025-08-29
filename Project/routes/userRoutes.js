import express from "express";
import { registerUser, loginUser, getProfile } from "../controllers/userController.js";
const { signup, verifyAccount, resentOTP, login, logout, forgetPassword, resetPassword } = require('../controllers/auth');
const { isAuthenticated, restrictTo } = require('../middlewares/auth');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();
// auths routes

router.post("/signup",signup);
router.post("/verify", isAuthenticated, verifyAccount);
router.post('/resend-otp', isAuthenticated, resentOTP);
router.post('/login',login);
router.post('/logout', logout);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);

router.get("/:id", getProfile);

export default router;
