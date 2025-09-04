import CrisisAlert from "../models/crisisAlertModel.js";
import ActivityLog from "../models/activityLogModel.js";

export const createCrisisAlert = async (req, res) => {
  try {
    const alert = new CrisisAlert(req.body);
    await alert.save();
    try {
      await ActivityLog.create({
        user: req.body.studentId || null,
        action: "crisis_create",
        metadata: { alertId: alert.alertId, severity: alert.severity, source: alert.source }
      });
    } catch {}
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listCrisisAlerts = async (req, res) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.severity) query.severity = req.query.severity;
    const alerts = await CrisisAlert.find(query).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCrisisStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const alert = await CrisisAlert.findByIdAndUpdate(id, { status }, { new: true });
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    try {
      await ActivityLog.create({
        user: null,
        action: "crisis_status_update",
        metadata: { id, status }
      });
    } catch {}
    res.json(alert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


