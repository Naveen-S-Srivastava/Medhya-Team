import mongoose from 'mongoose';
import Payment from './models/paymentModel.js';
import User from './models/usermodel.js';
import Appointment from './models/appointmentModel.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function createSamplePayments() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected ✅");

    // Find counselor user
    const counselor = await User.findOne({ email: 'counselor@institution.edu' });
    if (!counselor) {
      console.log("❌ Counselor user not found. Please create counselor user first.");
      process.exit(1);
    }

    // Find some student users
    const students = await User.find({ role: 'student' }).limit(5);
    if (students.length === 0) {
      console.log("❌ No student users found. Please create student users first.");
      process.exit(1);
    }

    console.log(`✅ Found counselor: ${counselor.firstName} ${counselor.lastName}`);
    console.log(`✅ Found ${students.length} students`);

    // Create sample appointments first
    const appointments = [];
    const sessionTypes = ['online', 'oncampus'];
    const paymentMethods = ['online', 'cash', 'bank_transfer', 'upi'];
    const reasons = [
      'Anxiety & Stress Management',
      'Academic Stress',
      'Relationship Issues',
      'Depression Support',
      'Career Guidance',
      'Personal Development'
    ];

    // Generate appointments for the last 3 months
    for (let i = 0; i < 20; i++) {
      const student = students[Math.floor(Math.random() * students.length)];
      const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
      const reason = reasons[Math.floor(Math.random() * reasons.length)];
      
      // Random date within last 3 months
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));
      
      const appointment = new Appointment({
        student: student._id,
        counselor: counselor._id,
        institutionId: 'iit-delhi',
        appointmentType: sessionType,
        date: date,
        timeSlot: `${Math.floor(Math.random() * 12) + 9}:00`,
        urgencyLevel: Math.random() > 0.8 ? 'urgent' : 'routine',
        reason: reason,
        status: 'completed',
        confirmationEmailSent: true,
        bookedAt: new Date(date.getTime() - 24 * 60 * 60 * 1000) // Booked 1 day before
      });

      appointments.push(appointment);
    }

    // Save appointments
    await Appointment.insertMany(appointments);
    console.log(`✅ Created ${appointments.length} appointments`);

    // Create payments for completed appointments
    const payments = [];
    const ratePerHour = 1500; // ₹1500 per hour

    for (const appointment of appointments) {
      const sessionDuration = 60; // 60 minutes
      const amount = (ratePerHour * sessionDuration) / 60; // ₹1500 for 1 hour
      const commission = 15; // 15% platform commission
      const platformFee = (amount * commission) / 100;
      const counselorEarnings = amount - platformFee;
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      // Generate transaction ID
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const payment = new Payment({
        appointment: appointment._id,
        counselor: counselor._id,
        student: appointment.student,
        amount: amount,
        currency: 'INR',
        paymentMethod: paymentMethod,
        paymentStatus: Math.random() > 0.1 ? 'completed' : 'pending', // 90% completed
        sessionType: appointment.appointmentType,
        sessionDuration: sessionDuration,
        ratePerHour: ratePerHour,
        commission: commission,
        counselorEarnings: counselorEarnings,
        platformFee: platformFee,
        paymentDate: appointment.date,
        transactionId: transactionId,
        notes: `Session for ${appointment.reason}`,
        processedAt: appointment.date,
        processedBy: counselor._id
      });

      payments.push(payment);
    }

    // Save payments
    await Payment.insertMany(payments);
    console.log(`✅ Created ${payments.length} payments`);

    // Calculate and display summary
    const totalEarnings = payments.reduce((sum, payment) => sum + payment.counselorEarnings, 0);
    const completedPayments = payments.filter(p => p.paymentStatus === 'completed').length;
    const pendingPayments = payments.filter(p => p.paymentStatus === 'pending').length;

    console.log("\n📊 Payment Summary:");
    console.log("=".repeat(40));
    console.log(`Total Payments: ${payments.length}`);
    console.log(`Completed: ${completedPayments}`);
    console.log(`Pending: ${pendingPayments}`);
    console.log(`Total Earnings: ₹${totalEarnings.toFixed(2)}`);
    console.log(`Average per Session: ₹${(totalEarnings / payments.length).toFixed(2)}`);

    console.log("\n✅ Sample payment data created successfully!");
    console.log("You can now test the payment history feature in the counselor dashboard.");

    process.exit(0);
  } catch (err) {
    console.error("Error creating sample payments ❌", err);
    process.exit(1);
  }
}

createSamplePayments();
