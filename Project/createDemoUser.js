import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/usermodel.js';

dotenv.config();

const createDemoUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mindcare');
    console.log('✅ Connected to MongoDB');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'student@university.edu' });
    if (existingUser) {
      console.log('✅ Demo user already exists');
      process.exit(0);
    }

    // Create demo user
    const demoUser = await User.create({
      firstName: 'Demo',
      lastName: 'Student',
      username: 'demo_student',
      email: 'student@university.edu',
      phone: '9876543210',
      dateOfBirth: new Date('2000-01-01'),
      gender: 'prefer-not-to-say',
      institutionId: 'iit-delhi',
      studentId: '2024CS001',
      course: 'Computer Science',
      year: '3rd Year',
      department: 'Computer Science',
      password: 'demo123456',
      passwordConfirm: 'demo123456',
      securityQuestion: 'What is your favorite color?',
      securityAnswer: 'blue',
      privacyConsent: true,
      dataProcessingConsent: true,
      emergencyContact: 'Demo Parent',
      emergencyPhone: '9876543211',
      mentalHealthConsent: true,
      isEmailVerified: true,
      isVerified: true
    });

    console.log('✅ Demo user created successfully:', demoUser.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating demo user:', error.message);
    process.exit(1);
  }
};

createDemoUser();
