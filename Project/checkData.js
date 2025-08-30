import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/usermodel.js';
import Counselor from './models/counselorModel.js';
import Appointment from './models/appointmentModel.js';
import Message from './models/messageModel.js';
import Payment from './models/paymentModel.js';
import SessionNote from './models/sessionNoteModel.js';
import CounselorStats from './models/counselorStatsModel.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for checking data');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const checkData = async () => {
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
    console.log('   User ID:', oauthCounselor._id);
    console.log('   Counselor Profile ID:', oauthCounselor.counselorProfile);

    // Get the counselor profile
    const counselor = await Counselor.findOne({ email: oauthCounselor.email });
    
    if (!counselor) {
      console.log('❌ Counselor profile not found');
      return;
    }

    console.log('✅ Found counselor profile:', counselor.name);
    console.log('   Counselor ID:', counselor._id);

    // Check appointments
    const appointments = await Appointment.find({ counselor: counselor._id });
    console.log(`📅 Appointments for counselor: ${appointments.length}`);
    if (appointments.length > 0) {
      console.log('   Sample appointment:', {
        id: appointments[0]._id,
        student: appointments[0].student,
        date: appointments[0].date,
        status: appointments[0].status
      });
    }

    // Check messages
    const messages = await Message.find({
      $or: [
        { sender: counselor._id, senderModel: 'Counselor' },
        { recipient: counselor._id, recipientModel: 'Counselor' }
      ]
    });
    console.log(`💬 Messages for counselor: ${messages.length}`);
    if (messages.length > 0) {
      console.log('   Sample message:', {
        id: messages[0]._id,
        sender: messages[0].sender,
        recipient: messages[0].recipient,
        content: messages[0].content.substring(0, 50) + '...'
      });
    }

    // Check payments
    const payments = await Payment.find({ counselor: counselor._id });
    console.log(`💰 Payments for counselor: ${payments.length}`);
    if (payments.length > 0) {
      console.log('   Sample payment:', {
        id: payments[0]._id,
        amount: payments[0].amount,
        status: payments[0].paymentStatus,
        student: payments[0].student
      });
    }

    // Check session notes
    const sessionNotes = await SessionNote.find({ counselor: counselor._id });
    console.log(`📝 Session notes for counselor: ${sessionNotes.length}`);

    // Check counselor stats
    const stats = await CounselorStats.findOne({ counselor: counselor._id });
    console.log(`📊 Counselor stats: ${stats ? 'Found' : 'Not found'}`);
    if (stats) {
      console.log('   Stats:', {
        totalSessions: stats.totalSessions,
        completedSessions: stats.completedSessions,
        averageRating: stats.averageRating
      });
    }

    // Check if there are any appointments with the user ID instead of counselor ID
    const appointmentsWithUserId = await Appointment.find({ counselor: oauthCounselor._id });
    console.log(`🔍 Appointments with user ID: ${appointmentsWithUserId.length}`);

    // Check if there are any messages with the user ID
    const messagesWithUserId = await Message.find({
      $or: [
        { sender: oauthCounselor._id, senderModel: 'Counselor' },
        { recipient: oauthCounselor._id, recipientModel: 'Counselor' }
      ]
    });
    console.log(`🔍 Messages with user ID: ${messagesWithUserId.length}`);

    // Check if there are any payments with the user ID
    const paymentsWithUserId = await Payment.find({ counselor: oauthCounselor._id });
    console.log(`🔍 Payments with user ID: ${paymentsWithUserId.length}`);

  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run the check
connectDB().then(() => {
  checkData();
});
