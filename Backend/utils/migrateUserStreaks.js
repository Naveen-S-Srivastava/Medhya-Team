import mongoose from 'mongoose';
import User from '../models/usermodel.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for migration');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Migration function to initialize streak fields for existing users
const migrateUserStreaks = async () => {
  try {
    console.log('🔄 Starting user streak migration...');

    // Find all users that don't have streak fields initialized
    const usersToUpdate = await User.find({
      $or: [
        { currentStreak: { $exists: false } },
        { longestStreak: { $exists: false } },
        { currentStreak: null },
        { longestStreak: null }
      ]
    });

    console.log(`📊 Found ${usersToUpdate.length} users that need streak field initialization`);

    for (const user of usersToUpdate) {
      console.log(`🔄 Updating user ${user._id} (${user.email})`);

      // Initialize streak fields
      user.currentStreak = user.currentStreak || 0;
      user.longestStreak = user.longestStreak || 0;
      user.lastStreakDate = user.lastStreakDate || null;

      await user.save();
      console.log(`✅ Updated user ${user._id}: currentStreak=${user.currentStreak}, longestStreak=${user.longestStreak}`);
    }

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

// Run the migration
const runMigration = async () => {
  await connectDB();
  await migrateUserStreaks();
  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
  process.exit(0);
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export default migrateUserStreaks;