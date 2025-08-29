import ActivityLog from "../models/activityLogModel.js";

export const createActivity = async (req, res) => {
  try {
    const activity = new ActivityLog(req.body);
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getActivitiesForUser = async (req, res) => {
  try {
    const { page = 1, limit = 20, action } = req.query;
    const query = { user: req.params.userId };
    if (action) query.action = action;
    const logs = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    const total = await ActivityLog.countDocuments(query);
    res.json({ data: logs, page: Number(page), limit: Number(limit), total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


