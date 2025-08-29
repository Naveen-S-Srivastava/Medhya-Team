import express from "express";
import {
  syncClerkUser,
  getUserByClerkId,
  updateUserProfile,
  completeUserProfile,
  getUserProfile
} from "../controllers/clerkController.js";

const router = express.Router();

// Clerk user synchronization and management routes
router.post("/sync", syncClerkUser);
router.get("/user/:clerkId", getUserByClerkId);
router.patch("/user/:clerkId", updateUserProfile);
router.post("/user/:clerkId/complete-profile", completeUserProfile);
router.get("/user/:clerkId/profile", getUserProfile);

export default router;
