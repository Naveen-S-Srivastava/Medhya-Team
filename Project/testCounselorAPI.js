import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/usermodel.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for testing');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const testCounselorAPI = async () => {
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

    // Create a test token
    const token = jwt.sign(
      { id: oauthCounselor._id, role: oauthCounselor.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('✅ Created test token');

    // Test the API endpoints
    const baseURL = 'http://localhost:5000/api';
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Test profile endpoint
    console.log('\n🔍 Testing profile endpoint...');
    try {
      const profileResponse = await fetch(`${baseURL}/counselor-dashboard/profile`, {
        method: 'GET',
        headers
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('✅ Profile endpoint working:', profileData.status);
      } else {
        console.log('❌ Profile endpoint failed:', profileResponse.status);
        const errorText = await profileResponse.text();
        console.log('Error details:', errorText);
      }
    } catch (error) {
      console.log('❌ Profile endpoint error:', error.message);
    }

    // Test overview endpoint
    console.log('\n🔍 Testing overview endpoint...');
    try {
      const overviewResponse = await fetch(`${baseURL}/counselor-dashboard/overview`, {
        method: 'GET',
        headers
      });
      
      if (overviewResponse.ok) {
        const overviewData = await overviewResponse.json();
        console.log('✅ Overview endpoint working:', overviewData.status);
        console.log('📊 Data summary:');
        console.log(`   - Today's appointments: ${overviewData.data.todayAppointments.length}`);
        console.log(`   - Upcoming appointments: ${overviewData.data.upcomingAppointments.length}`);
        console.log(`   - Recent messages: ${overviewData.data.recentMessages.length}`);
        console.log(`   - Unread messages: ${overviewData.data.unreadCount}`);
        console.log(`   - Recent payments: ${overviewData.data.recentPayments.length}`);
      } else {
        console.log('❌ Overview endpoint failed:', overviewResponse.status);
        const errorText = await overviewResponse.text();
        console.log('Error details:', errorText);
      }
    } catch (error) {
      console.log('❌ Overview endpoint error:', error.message);
    }

    // Test sessions endpoint
    console.log('\n🔍 Testing sessions endpoint...');
    try {
      const sessionsResponse = await fetch(`${baseURL}/counselor-dashboard/sessions`, {
        method: 'GET',
        headers
      });
      
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        console.log('✅ Sessions endpoint working:', sessionsData.status);
        console.log(`📅 Total sessions: ${sessionsData.data.appointments.length}`);
      } else {
        console.log('❌ Sessions endpoint failed:', sessionsResponse.status);
        const errorText = await sessionsResponse.text();
        console.log('Error details:', errorText);
      }
    } catch (error) {
      console.log('❌ Sessions endpoint error:', error.message);
    }

    // Test messages endpoint
    console.log('\n🔍 Testing messages endpoint...');
    try {
      const messagesResponse = await fetch(`${baseURL}/counselor-dashboard/messages`, {
        method: 'GET',
        headers
      });
      
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        console.log('✅ Messages endpoint working:', messagesData.status);
        console.log(`💬 Total messages: ${messagesData.data.messages.length}`);
      } else {
        console.log('❌ Messages endpoint failed:', messagesResponse.status);
        const errorText = await messagesResponse.text();
        console.log('Error details:', errorText);
      }
    } catch (error) {
      console.log('❌ Messages endpoint error:', error.message);
    }

    // Test payments endpoint
    console.log('\n🔍 Testing payments endpoint...');
    try {
      const paymentsResponse = await fetch(`${baseURL}/counselor-dashboard/payments`, {
        method: 'GET',
        headers
      });
      
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        console.log('✅ Payments endpoint working:', paymentsData.status);
        console.log(`💰 Total payments: ${paymentsData.data.payments.length}`);
        console.log(`💵 Total earnings: ₹${paymentsData.data.totalEarnings}`);
      } else {
        console.log('❌ Payments endpoint failed:', paymentsResponse.status);
        const errorText = await paymentsResponse.text();
        console.log('Error details:', errorText);
      }
    } catch (error) {
      console.log('❌ Payments endpoint error:', error.message);
    }

  } catch (error) {
    console.error('❌ Error testing API:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run the test
connectDB().then(() => {
  testCounselorAPI();
});
