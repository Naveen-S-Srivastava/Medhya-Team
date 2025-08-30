import mongoose from 'mongoose';
import User from './models/usermodel.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function checkUserRoles() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected ✅");

    // Get all users with their roles
    const users = await User.find({}, 'email role googleId firstName lastName createdAt');
    
    console.log("\n📋 All users in database:");
    console.log("=".repeat(80));
    
    if (users.length === 0) {
      console.log("No users found in database");
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   Role: ${user.role || 'NOT SET'}`);
        console.log(`   Google OAuth: ${user.googleId ? 'Yes' : 'No'}`);
        console.log(`   Name: ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`);
        console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
        console.log("-".repeat(40));
      });
    }

    // Count by role
    const roleCounts = {};
    users.forEach(user => {
      const role = user.role || 'NOT SET';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    console.log("\n📊 Role Distribution:");
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`   ${role}: ${count} users`);
    });

    // Check for specific demo users
    const demoUsers = users.filter(user => 
      user.email === 'admin@institution.edu' || 
      user.email === 'student@university.edu' ||
      user.email === 'counselor@institution.edu' ||
      user.email === 'admin@mindcare.com'
    );

    if (demoUsers.length > 0) {
      console.log("\n🎯 Demo Users:");
      demoUsers.forEach(user => {
        console.log(`   ${user.email}: ${user.role || 'NOT SET'}`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error("Error checking user roles ❌", err);
    process.exit(1);
  }
}

checkUserRoles();
