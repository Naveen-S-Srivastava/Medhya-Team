import mongoose from 'mongoose';
import User from '../models/usermodel.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function createAdminUser() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected ✅");

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@mindcare.com' });
    if (existingAdmin) {
      console.log("Admin user already exists, updating with password ✅");
      
      // Update the existing admin user with a password
      existingAdmin.password = 'admin123';
      existingAdmin.passwordConfirm = 'admin123';
      existingAdmin.googleId = undefined; // Remove Google ID to allow password login
      await existingAdmin.save();
      
      console.log("Admin user updated successfully ✅");
      console.log("Email: admin@mindcare.com");
      console.log("Password: admin123");
      console.log("Role: admin");
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@mindcare.com',
      password: 'admin123',
      passwordConfirm: 'admin123',
      phone: '1234567890',
      institutionId: 'ADMIN001',
      studentId: 'ADMIN001',
      course: 'Administration',
      year: '1',
      department: 'IT',
      securityQuestion: 'What is your favorite color?',
      securityAnswer: 'Blue',
      privacyConsent: true,
      dataProcessingConsent: true,
      emergencyContact: 'Emergency Contact',
      emergencyPhone: '1234567890',
      mentalHealthConsent: true,
      communicationConsent: true,
      role: 'admin',
      isEmailVerified: true,
      isVerified: true
    });

    await adminUser.save();
    console.log("Admin user created successfully ✅");
    console.log("Email: admin@mindcare.com");
    console.log("Password: admin123");
    console.log("Role: admin");

    process.exit(0);
  } catch (err) {
    console.error("Error creating admin user ❌", err);
    process.exit(1);
  }
}

createAdminUser();
