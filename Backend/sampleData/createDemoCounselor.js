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
    const existingCounselor = await User.findOne({ email: 'counselor@institution.edu' });
    if (existingCounselor) {
      console.log("Counselor user already exists ✅");
      console.log("Email: counselor@institution.edu");
      console.log("Role: counselor");
      process.exit(0);
    }

    // Create counselor user
    const counselorUser = new User({
      firstName: 'Demo',
      lastName: 'Counselor',
      email: 'counselor@institution.edu',
      password: 'counselor123456',
      passwordConfirm: 'counselor123456',
      phone: '9876543210',
      institutionId: 'COUNSELOR001',
      studentId: 'COUNSELOR001',
      course: 'Professional Counseling',
      year: '1',
      department: 'Mental Health',
      securityQuestion: 'What is your favorite color?',
      securityAnswer: 'Green',
      privacyConsent: true,
      dataProcessingConsent: true,
      emergencyContact: 'Emergency Contact',
      emergencyPhone: '9876543210',
      mentalHealthConsent: true,
      communicationConsent: true,
      role: 'counselor',
      // isEmailVerified: true,
      isVerified: true
    });

    await counselorUser.save();
    console.log("Counselor user created successfully ✅");
    console.log("Email: counselor@institution.edu");
    console.log("Password: counselor123456");
    console.log("Role: counselor");

    process.exit(0);
  } catch (err) {
    console.error("Error creating counselor user ❌", err);
    process.exit(1);
  }
}

createDemoCounselor();
