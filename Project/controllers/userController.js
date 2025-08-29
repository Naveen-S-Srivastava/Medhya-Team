import User from "../models/usermodel.js";
import ActivityLog from "../models/activityLogModel.js";

export const registerUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    try {
      await ActivityLog.create({
        user: user._id,
        action: "user_register",
        metadata: {
          email: user.email,
          userAgent: req.get("user-agent"),
          ip: req.ip
        }
      });
    } catch {}
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
    try {
      await ActivityLog.create({
        user: user._id,
        action: "user_login",
        metadata: {
          email: user.email,
          userAgent: req.get("user-agent"),
          ip: req.ip
        }
      });
    } catch {}
    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("assessments")
      .populate("appointments");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


