import express from "express";
import ActivityLog from "../models/activityLogModel.js";

const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const activity = new ActivityLog(req.body);
    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get("/:userId", async (req, res) => {
  try {
    const logs = await ActivityLog.find({ user: req.params.userId });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
