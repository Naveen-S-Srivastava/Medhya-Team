import mongoose from 'mongoose';
import User from './models/usermodel.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function createDemoCounselor() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected ✅");

    // Check if counselor user already exists
    const existingCounselor = await User.findOne({ email: 'counselor@university.edu' });
    if (existingCounselor) {
      console.log("Demo counselor user already exists ✅");
      process.exit(0);
    }

    // Create demo counselor user
    const counselorUser = new User({
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'counselor@university.edu',
      password: 'demo123456',
      passwordConfirm: 'demo123456',
      phone: '+91 98765 43210',
      institutionId: 'UNI001',
      studentId: 'COUNSELOR001',
      course: 'Clinical Psychology',
      year: '2020',
      department: 'Psychology',
      securityQuestion: 'What is your favorite color?',
      securityAnswer: 'Green',
      privacyConsent: true,
      dataProcessingConsent: true,
      emergencyContact: 'Emergency Contact',
      emergencyPhone: '+91 98765 43211',
      mentalHealthConsent: true,
      communicationConsent: true,
      role: 'counselor',
      isEmailVerified: true,
      isVerified: true
    });

    await counselorUser.save();
    console.log("Demo counselor user created successfully ✅");
    console.log("Email: counselor@university.edu");
    console.log("Password: demo123456");
    console.log("Role: counselor");

    process.exit(0);
  } catch (err) {
    console.error("Error creating demo counselor user ❌", err);
    process.exit(1);
  }
}

createDemoCounselor();
