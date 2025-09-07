import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: "../.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the models
import Counselor from '../models/counselorModel.js';
import User from '../models/usermodel.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Load sample data
const loadCounselorData = async () => {
  try {
    // Read the sample data file
    const sampleDataPath = path.join(__dirname, '..', 'jsonFiles', 'counselors_sample.json');
    const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));

    // Clear existing counselors
    await Counselor.deleteMany({});
    console.log('Cleared existing counselors');

    // Process each counselor and create associated user account
    const counselors = [];
    for (const counselorData of sampleData) {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: counselorData.email });

        if (!user) {
          // Create user account for counselor
          const userData = {
            email: counselorData.email,
            password: 'counselor123', // Default password
            passwordConfirm: 'counselor123',
            role: 'counselor',
            isVerified: true,
            isProfileComplete: true
          };

          user = await User.create(userData);
          console.log(`Created user account for counselor: ${counselorData.email}`);
        }

        // Create counselor with user account reference
        const counselorWithUser = {
          ...counselorData,
          userAccount: user._id
        };

        const counselor = await Counselor.create(counselorWithUser);
        counselors.push(counselor);

        // Update user with counselor profile reference
        user.counselorProfile = counselor._id;
        await user.save();

        console.log(`Created counselor: ${counselorData.name}`);

      } catch (error) {
        console.error(`Error creating counselor ${counselorData.name}:`, error.message);
      }
    }

    console.log(`Successfully loaded ${counselors.length} counselors`);

    // Log some statistics
    const stats = await Counselor.aggregate([
      {
        $group: {
          _id: null,
          totalCounselors: { $sum: 1 },
          activeCounselors: { $sum: { $cond: ['$isActive', 1, 0] } },
          averageRating: { $avg: '$rating' },
          totalSpecializations: { $addToSet: '$specialization' },
          totalLanguages: { $addToSet: '$languages' }
        }
      }
    ]);

    if (stats.length > 0) {
      const stat = stats[0];
      console.log('\nCounselor Statistics:');
      console.log(`Total Counselors: ${stat.totalCounselors}`);
      console.log(`Active Counselors: ${stat.activeCounselors}`);
      console.log(`Average Rating: ${stat.averageRating?.toFixed(1) || 'N/A'}`);
    }

    // Specialization statistics
    const specializationStats = await Counselor.aggregate([
      { $unwind: '$specialization' },
      {
        $group: {
          _id: '$specialization',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\nCounselors by Specialization:');
    specializationStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} counselors`);
    });

    // Language statistics
    const languageStats = await Counselor.aggregate([
      { $unwind: '$languages' },
      {
        $group: {
          _id: '$languages',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\nCounselors by Language:');
    languageStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} counselors`);
    });

    // Appointment type statistics
    const typeStats = await Counselor.aggregate([
      {
        $group: {
          _id: '$appointmentType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\nCounselors by Appointment Type:');
    typeStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} counselors`);
    });

    console.log('\n✅ Counselor data loaded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error loading counselor data:', error);
    process.exit(1);
  }
};

// Run the script
connectDB().then(() => {
  loadCounselorData();
});
