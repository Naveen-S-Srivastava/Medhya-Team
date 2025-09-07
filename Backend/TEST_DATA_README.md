# Counselor Dashboard Test Data

This document explains how to create and use test data for the counselor dashboard.

## 🚀 Quick Start

### 1. Create Test Data

Run the following command from the Backend directory:

```bash
npm run create-test-data
```

Or directly:

```bash
node scripts/createTestData.js
```

### 2. Test Login Credentials

After running the script, you can login to the counselor dashboard with:

- **Email**: `anjali.sharma@medhya.com`
- **Password**: `password123`
- **Role**: `counselor`

## 📊 Test Data Created

The script creates the following test data:

### 👩‍⚕️ Test Counselor
- **Name**: Dr. Anjali Sharma
- **Email**: anjali.sharma@medhya.com
- **Specializations**: CBT, Stress Management, Anxiety Disorders
- **Languages**: English, Hindi, Marathi
- **Experience**: 12 years
- **Rating**: 4.8/5 (25 reviews)

### 👥 Test Students (5 students)
- Rohan Verma
- Priya Patel
- Amit Singh
- Sneha Gupta
- Kavya Reddy

### 📅 Test Appointments (6 appointments)
- **Today**: 2 appointments (1 confirmed, 1 pending)
- **Tomorrow**: 2 confirmed appointments
- **Day after tomorrow**: 1 pending appointment
- **Yesterday**: 1 completed appointment

### 💬 Test Messages (5 messages)
- 3 unread messages from students
- 2 read messages (1 from counselor, 1 from student)
- Mix of confirmations, questions, and thank you messages

### 💰 Test Payments (5 payments)
- 4 completed payments
- 1 pending payment
- All ₹1500 per session

### 📝 Test Session Notes (2 notes)
- Detailed session summaries
- Progress notes and homework assignments
- Risk assessments and mood ratings

### 📈 Counselor Statistics
- Total sessions: 45
- Completed sessions: 42
- Active students: 8
- Average rating: 4.8
- Monthly and weekly stats

## 🧪 Testing the Dashboard

### Dashboard Overview
- Check if today's appointments show up (should show 2)
- Verify unread message count (should show 3)
- Confirm active students count (should show 5)
- Check monthly sessions count

### Sessions View
- View all appointments with different statuses
- Test confirm/cancel appointment functionality
- Check appointment details and student information

### Messages View
- See all messages with read/unread status
- Test mark as read functionality
- Verify message content and timestamps

### Students View
- View all students with profile information
- Test send message functionality
- Check student contact details

### Payments View
- View payment records with different statuses
- Check payment amounts and dates
- Verify student information in payments

### Profile View
- View counselor profile information
- Check specializations and languages
- Verify experience and education details

## 🔧 Troubleshooting

### If the script fails:
1. Make sure MongoDB is running
2. Check your MONGODB_URI in .env file
3. Ensure all required models are properly defined
4. Check console output for specific error messages

### If data doesn't appear in dashboard:
1. Verify you're logged in with the correct counselor account
2. Check browser console for API errors
3. Ensure backend server is running
4. Verify API endpoints are working

### To reset/clear test data:
```bash
# Connect to MongoDB and clear collections
mongo your_database_name
db.users.deleteMany({email: "anjali.sharma@medhya.com"})
db.counselors.deleteMany({email: "anjali.sharma@medhya.com"})
db.appointments.deleteMany({})
db.messages.deleteMany({})
db.payments.deleteMany({})
db.sessionnotes.deleteMany({})
db.counselorstats.deleteMany({})
```

## 📝 Notes

- The test data is designed to be realistic and comprehensive
- All dates are relative to when you run the script
- The counselor account is fully functional for testing
- Student accounts are created but not used for login (they're for testing relationships)
- All data follows the actual schema requirements

## 🎯 What to Test

1. **Data Loading**: Verify all sections load with real data
2. **Real-time Updates**: Test appointment status changes
3. **Message System**: Test sending and receiving messages
4. **Error Handling**: Check error states and loading indicators
5. **Responsive Design**: Test on different screen sizes
6. **Navigation**: Ensure all tabs work correctly
7. **Profile Management**: Test profile viewing and editing

Happy testing! 🚀
