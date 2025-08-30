import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/usermodel.js';
import Counselor from './models/counselorModel.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for fixing counselor link');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const fixCounselorLink = async () => {
  try {
    // Find the OAuth counselor user
    const oauthCounselor = await User.findOne({ 
      email: 'ksrajasthan24@gmail.com',
      role: 'counselor'
    });

    if (!oauthCounselor) {
      console.log('❌ OAuth counselor user not found');
      return;
    }

    console.log('✅ Found OAuth counselor:', oauthCounselor.email);
    console.log('   Current counselorProfile:', oauthCounselor.counselorProfile);

    // Get the counselor profile
    const counselor = await Counselor.findOne({ email: oauthCounselor.email });
    
    if (!counselor) {
      console.log('❌ Counselor profile not found');
      return;
    }

    console.log('✅ Found counselor profile:', counselor.name);
    console.log('   Counselor ID:', counselor._id);

    // Update the user to link to the counselor profile
    const updatedUser = await User.findByIdAndUpdate(
      oauthCounselor._id,
      { counselorProfile: counselor._id },
      { new: true }
    );

    console.log('✅ Updated user with counselor profile link');
    console.log('   New counselorProfile:', updatedUser.counselorProfile);

  } catch (error) {
    console.error('❌ Error fixing counselor link:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the fix
connectDB().then(() => {
  fixCounselorLink();
});
