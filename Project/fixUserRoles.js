import mongoose from 'mongoose';
import User from './models/usermodel.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function fixUserRoles() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected ✅");

    // Fix admin users
    const adminEmails = ['admin@institution.edu', 'admin@mindcare.com'];
    for (const email of adminEmails) {
      const user = await User.findOne({ email });
      if (user && user.role !== 'admin') {
        console.log(`🔧 Fixing role for ${email}: ${user.role} → admin`);
        user.role = 'admin';
        await user.save();
      } else if (user) {
        console.log(`✅ ${email} already has correct role: ${user.role}`);
      } else {
        console.log(`❌ User not found: ${email}`);
      }
    }

    // Fix counselor users
    const counselorEmails = ['counselor@institution.edu'];
    for (const email of counselorEmails) {
      const user = await User.findOne({ email });
      if (user && user.role !== 'counselor') {
        console.log(`🔧 Fixing role for ${email}: ${user.role} → counselor`);
        user.role = 'counselor';
        await user.save();
      } else if (user) {
        console.log(`✅ ${email} already has correct role: ${user.role}`);
      } else {
        console.log(`❌ User not found: ${email}`);
      }
    }

    // Fix student users
    const studentEmails = ['student@university.edu'];
    for (const email of studentEmails) {
      const user = await User.findOne({ email });
      if (user && user.role !== 'student') {
        console.log(`🔧 Fixing role for ${email}: ${user.role} → student`);
        user.role = 'student';
        await user.save();
      } else if (user) {
        console.log(`✅ ${email} already has correct role: ${user.role}`);
      } else {
        console.log(`❌ User not found: ${email}`);
      }
    }

    // Set default role for users without role
    const usersWithoutRole = await User.find({ role: { $exists: false } });
    if (usersWithoutRole.length > 0) {
      console.log(`\n🔧 Setting default role for ${usersWithoutRole.length} users without role`);
      for (const user of usersWithoutRole) {
        // Default to student for users without role
        user.role = 'student';
        await user.save();
        console.log(`   Set role 'student' for ${user.email}`);
      }
    }

    console.log("\n✅ Role fixing completed!");
    process.exit(0);
  } catch (err) {
    console.error("Error fixing user roles ❌", err);
    process.exit(1);
  }
}

fixUserRoles();
