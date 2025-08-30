import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/usermodel.js";
import JournalEntry from "./models/journalModel.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected for journal API testing");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const testJournalAPI = async () => {
  try {
    // Find a student user
    const student = await User.findOne({ role: "student" });
    
    if (!student) {
      console.log("❌ No student user found for testing");
      return;
    }

    console.log(`📝 Testing journal API for student: ${student.firstName} ${student.lastName}`);

    // Test 1: Check if journal entries exist
    const existingEntries = await JournalEntry.find({ user: student._id });
    console.log(`📊 Found ${existingEntries.length} existing journal entries`);

    // Test 2: Check today's entry
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayEntry = await JournalEntry.findOne({
      user: student._id,
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (todayEntry) {
      console.log("✅ Today's journal entry found:", {
        id: todayEntry._id,
        mood: todayEntry.mood,
        wellnessScore: todayEntry.wellnessScore,
        createdAt: todayEntry.createdAt
      });
    } else {
      console.log("ℹ️ No journal entry for today");
    }

    // Test 3: Check weekly progress
    const weekStart = new Date();
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const weeklyEntries = await JournalEntry.find({
      user: student._id,
      createdAt: {
        $gte: weekStart,
        $lt: weekEnd
      }
    }).sort({ createdAt: 1 });

    console.log(`📅 Weekly entries (${weekStart.toDateString()} to ${new Date(weekEnd.getTime() - 1).toDateString()}): ${weeklyEntries.length}`);

    // Test 4: Check journal statistics
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await JournalEntry.aggregate([
      {
        $match: {
          user: student._id,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          avgMoodScore: { $avg: '$moodScore' },
          avgWellnessScore: { $avg: '$wellnessScore' }
        }
      }
    ]);

    if (stats.length > 0) {
      console.log("📈 Journal statistics:", {
        totalEntries: stats[0].totalEntries,
        avgMoodScore: Math.round(stats[0].avgMoodScore * 10) / 10,
        avgWellnessScore: Math.round(stats[0].avgWellnessScore * 10) / 10
      });
    } else {
      console.log("📈 No journal statistics available");
    }

    console.log("✅ Journal API testing completed successfully");

  } catch (error) {
    console.error("❌ Error testing journal API:", error);
  }
};

const main = async () => {
  await connectDB();
  await testJournalAPI();
  await mongoose.disconnect();
  console.log("✅ Journal API testing completed");
};

main();
