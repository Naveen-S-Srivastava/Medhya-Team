import mongoose from "mongoose";
const assessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { 
    type: String, 
    enum: ["PHQ-9", "GAD-7", "GHQ-12"], 
    required: true 
  },
  score: { type: Number, required: true },
  responses: { type: [Number], required: true },
  date: { type: Date, default: Date.now }
});

const Assessment = mongoose.model("Assessment", assessmentSchema);
export default Assessment;
