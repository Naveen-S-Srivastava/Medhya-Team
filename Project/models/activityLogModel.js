import mongoose from "mongoose";
const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  activityType:{ 
    type: String, 
    enum: ["resource_view", "peer_post", "chatbot_use", "login"], 
    required: true 
  },
  description: { type: String },
  date: { type: Date, default: Date.now }
});
const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;
