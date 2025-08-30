import mongoose from 'mongoose';
import User from './models/usermodel.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function testPersistentAuth() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected ✅");

    // Check if demo users exist
    const demoUsers = [
      { email: 'student@university.edu', role: 'student' },
      { email: 'counselor@institution.edu', role: 'counselor' },
      { email: 'admin@institution.edu', role: 'admin' }
    ];

    console.log("\n🔍 Checking demo users for persistent authentication test:");
    console.log("=".repeat(60));

    for (const demoUser of demoUsers) {
      const user = await User.findOne({ email: demoUser.email });
      if (user) {
        console.log(`✅ ${demoUser.email} (${demoUser.role}): EXISTS`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Password: ${demoUser.role === 'student' ? 'demo123456' : demoUser.role === 'counselor' ? 'counselor123456' : 'admin123456'}`);
      } else {
        console.log(`❌ ${demoUser.email} (${demoUser.role}): NOT FOUND`);
      }
      console.log("-".repeat(40));
    }

    console.log("\n📋 Testing Instructions:");
    console.log("=".repeat(60));
    console.log("1. Start the backend server: node server.js");
    console.log("2. Start the frontend: npm run dev");
    console.log("3. Login with any demo user:");
    console.log("   - Student: student@university.edu / demo123456");
    console.log("   - Counselor: counselor@institution.edu / counselor123456");
    console.log("   - Admin: admin@institution.edu / admin123456");
    console.log("4. After login, refresh the page (F5 or Ctrl+R)");
    console.log("5. You should remain logged in and not be redirected to login page");
    console.log("6. Check browser localStorage for 'token' and 'refreshToken'");
    console.log("7. Test logout functionality");
    console.log("8. After logout, refresh page - should redirect to login");

    console.log("\n🔧 Token Management:");
    console.log("=".repeat(60));
    console.log("• Access Token: 7 days expiration");
    console.log("• Refresh Token: 30 days expiration");
    console.log("• Automatic token refresh on 401 errors");
    console.log("• Tokens stored in localStorage");
    console.log("• Automatic cleanup on logout");

    process.exit(0);
  } catch (err) {
    console.error("Error testing persistent auth ❌", err);
    process.exit(1);
  }
}

testPersistentAuth();
