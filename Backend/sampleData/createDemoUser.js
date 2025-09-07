import mongoose from 'mongoose';
import User from '../models/usermodel.js';
import Counselor from '../models/counselorModel.js';
import dotenv from 'dotenv';

dotenv.config({ path: "../.env" });

const MONGO_URI = process.env.MONGO_URI;

async function createDemoUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected ✅");

    // Demo users data with different roles for full portal access
    const demoUsers = [
      {
        // Admin User - Full access to all admin features
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
        isVerified: true,
        isProfileComplete: true
      },
      {
        // Counselor User - Access to counselor dashboard and features
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'counselor@mindcare.com',
        password: 'counselor123',
        passwordConfirm: 'counselor123',
        phone: '2345678901',
        institutionId: 'COUNSELOR001',
        studentId: 'COUNSELOR001',
        course: 'Psychology',
        year: 'PhD',
        department: 'Counseling',
        securityQuestion: 'What is your favorite color?',
        securityAnswer: 'Green',
        privacyConsent: true,
        dataProcessingConsent: true,
        emergencyContact: 'Emergency Services',
        emergencyPhone: '2345678901',
        mentalHealthConsent: true,
        communicationConsent: true,
        role: 'counselor',
        isVerified: true,
        isProfileComplete: true
      },
      {
        // Student User - Access to student features
        firstName: 'John',
        lastName: 'Doe',
        email: 'student@mindcare.com',
        password: 'student123',
        passwordConfirm: 'student123',
        phone: '3456789012',
        institutionId: 'iit-delhi',
        studentId: 'CS2024001',
        course: 'B.Tech - Computer Science',
        year: '3',
        department: 'Computer Science',
        securityQuestion: 'What is your favorite color?',
        securityAnswer: 'Red',
        privacyConsent: true,
        dataProcessingConsent: true,
        emergencyContact: 'Parent Name',
        emergencyPhone: '3456789012',
        mentalHealthConsent: true,
        communicationConsent: true,
        role: 'student',
        isVerified: true,
        isProfileComplete: true
      },
      {
        // Additional Student User for testing
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'student2@mindcare.com',
        password: 'student123',
        passwordConfirm: 'student123',
        phone: '4567890123',
        institutionId: 'du-north',
        studentId: 'PSY2024002',
        course: 'BA - Psychology',
        year: '2',
        department: 'Psychology',
        securityQuestion: 'What is your favorite color?',
        securityAnswer: 'Purple',
        privacyConsent: true,
        dataProcessingConsent: true,
        emergencyContact: 'Guardian Name',
        emergencyPhone: '4567890123',
        mentalHealthConsent: true,
        communicationConsent: true,
        role: 'student',
        isVerified: true,
        isProfileComplete: true
      }
    ];

    console.log("Creating demo users with full portal access...");

    for (const userData of demoUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`User ${userData.email} already exists ✅`);
        continue;
      }

      // Create user
      const user = new User(userData);
      await user.save();

      // If counselor, create counselor profile
      if (userData.role === 'counselor') {
        const counselorProfile = new Counselor({
          user: user._id,
          specialization: ['Anxiety', 'Depression', 'Stress Management'],
          experience: 8,
          qualifications: ['PhD in Clinical Psychology', 'Licensed Professional Counselor'],
          bio: 'Experienced clinical psychologist specializing in mental health support for students.',
          availability: {
            monday: { start: '09:00', end: '17:00' },
            tuesday: { start: '09:00', end: '17:00' },
            wednesday: { start: '09:00', end: '17:00' },
            thursday: { start: '09:00', end: '17:00' },
            friday: { start: '09:00', end: '17:00' }
          },
          rating: 4.8,
          totalSessions: 150,
          languages: ['English', 'Hindi'],
          emergencyContact: userData.emergencyPhone,
          isActive: true
        });
        await counselorProfile.save();

        // Update user with counselor profile reference
        user.counselorProfile = counselorProfile._id;
        await user.save();
      }

      console.log(`✅ Created ${userData.role} user: ${userData.email}`);
      console.log(`   Password: ${userData.password}`);
      console.log(`   Role: ${userData.role}`);
      console.log('');
    }

    console.log("🎉 Demo users created successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👑 ADMIN ACCESS:");
    console.log("   Email: admin@mindcare.com");
    console.log("   Password: admin123");
    console.log("   Access: Full admin panel, user management, counselor management");
    console.log("");
    console.log("👩‍⚕️ COUNSELOR ACCESS:");
    console.log("   Email: counselor@mindcare.com");
    console.log("   Password: counselor123");
    console.log("   Access: Counselor dashboard, appointment management, session notes");
    console.log("");
    console.log("🎓 STUDENT ACCESS:");
    console.log("   Email: student@mindcare.com");
    console.log("   Password: student123");
    console.log("   Access: Student portal, assessments, appointments, chat");
    console.log("");
    console.log("🎓 STUDENT 2 ACCESS:");
    console.log("   Email: student2@mindcare.com");
    console.log("   Password: student123");
    console.log("   Access: Student portal, assessments, appointments, chat");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating demo users:", err);
    process.exit(1);
  }
}

createDemoUsers();
