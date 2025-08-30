import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import crisisRoutes from "./routes/crisisRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import counselorRoutes from "./routes/counselorRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import counselorDashboardRoutes from "./routes/counselorDashboardRoutes.js";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));
app.use("/api/users", userRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/crisis", crisisRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/counselors", counselorRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/counselor-dashboard", counselorDashboardRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
