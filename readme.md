# 🧠 Medhya - Mental Health Platform

A comprehensive mental health platform designed for students, featuring counseling services, assessments, crisis management, and wellness resources.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project is a **Digital Mental Health and Psychological Support System for Students in Higher Education**.  
It is designed to help students access timely support through AI-driven tools, automated mental health screenings, secure counselor booking, and insightful analytics for administrators.   
The system integrates:  
- **AI & NLP** for sentiment analysis and intent detection  
- **Automated PHQ-9 & GAD-7 screenings** for depression and anxiety  
- **Decision tree-based referral** to coping strategies or counselors  
- **Secure booking and case management** for counselors  
- **Anonymized analytics dashboard** for administrators
  

## ✨ Features

### 🔐 Authentication & User Management
- **Multi-role System**: Students, Counselors, Admins
- **Google OAuth Integration**: Seamless login with Google accounts
- **JWT Authentication**: Secure token-based authentication
- **Email Verification**: OTP-based email verification system
- **Password Recovery**: Forgot password functionality

### 👥 User Roles

#### 🎓 Students
- Book counseling appointments
- Take mental health assessments
- Access wellness resources
- Join peer support community
- Chat with AI assistant
- View appointment history

#### 👨‍⚕️ Counselors
- Manage appointment schedule
- View student profiles
- Access session notes
- Update availability
- View earnings and statistics

#### 👨‍💼 Admins
- Manage all users and counselors
- Monitor system statistics
- Handle crisis alerts
- Manage resources and content
- View payment history

### 📅 Appointment System
- **Smart Scheduling**: Real-time availability checking
- **Multiple Types**: On-campus and online appointments
- **Time Slot Management**: Dynamic slot generation
- **Counselor Profiles**: Detailed information and ratings
- **Booking History**: Complete appointment tracking

### 🧠 Mental Health Assessments
- **PHQ-9 Depression Screening**: Standardized depression assessment
- **GAD-7 Anxiety Screening**: Generalized anxiety disorder assessment
- **Progress Tracking**: Historical assessment results
- **Score Visualization**: Charts and analytics
- **Recommendations**: Personalized suggestions based on scores

### 🚨 Crisis Management
- **Emergency Alerts**: Real-time crisis notifications
- **Counselor Assignment**: Automatic crisis counselor assignment
- **Priority Handling**: Urgent case management
- **Follow-up Tracking**: Post-crisis monitoring

### 💬 AI Chat Support
- **24/7 Availability**: Round-the-clock mental health support
- **Conversational AI**: Natural language processing
- **Resource Recommendations**: Personalized suggestions
- **Crisis Detection**: Automatic crisis identification

### 👥 Community Features
- **Peer Support Groups**: Student community forums
- **Resource Sharing**: Educational content and tools
- **Anonymous Posting**: Safe space for sharing
- **Moderation System**: Content monitoring and management

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **nodemailer** - Email functionality
- **multer** - File upload handling
- **Fast API** - For integration

### Authentication
- **Google OAuth 2.0** - Social login integration
- **JWT Tokens** - Stateless authentication
- **Refresh Tokens** - Secure token refresh mechanism

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Cloud database

### Machine Learning
- **Logistic Regression** - Training Models
- **LAMA** - For LLM
- **Python Libraries** - For Voice Fetch

## 📁 Project Structure

```
MindCare/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── Components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── ui/             # UI components
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── Project/                # Backend Node.js application
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middlewares/       # Express middlewares
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
└── README.md              # Project documentation
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd Project
npm install
npm start
```

## ⚙️ Environment Setup

### Frontend Environment Variables
Create `.env` file in `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### Backend Environment Variables
Create `.env` file in `Project/`:
```env
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=30d
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth authentication
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/appointments` - Get user appointments

### Counselor Endpoints
- `GET /api/counselors` - Get all counselors
- `GET /api/counselors/:id` - Get counselor details
- `GET /api/counselors/:id/availability` - Get counselor availability
- `PUT /api/counselors/profile` - Update counselor profile

### Appointment Endpoints
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get appointments
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Assessment Endpoints
- `POST /api/assessments/phq9` - Submit PHQ-9 assessment
- `POST /api/assessments/gad7` - Submit GAD-7 assessment
- `GET /api/assessments/history` - Get assessment history

### Crisis Endpoints
- `POST /api/crisis/alerts` - Create crisis alert
- `GET /api/crisis/alerts` - Get crisis alerts
- `PUT /api/crisis/alerts/:id` - Update crisis alert

### Community Endpoints
- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create post
- `PUT /api/community/posts/:id` - Update post
- `DELETE /api/community/posts/:id` - Delete post

### Resource Endpoints
- `GET /api/resources` - Get resources
- `POST /api/resources` - Create resource
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

## 🌐 Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend Deployment (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Configure build command: `npm install`
4. Configure start command: `npm start`

### Database Setup (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Configure network access
3. Create database user
4. Get connection string
5. Update environment variables

## 📖 Usage

### For Students
1. **Register/Login**: Create account or sign in with Google
2. **Complete Profile**: Fill in personal information
3. **Take Assessment**: Complete PHQ-9 or GAD-7 screening
4. **Book Appointment**: Select counselor and time slot
5. **Access Resources**: Browse wellness content and tools
6. **Join Community**: Connect with peer support groups

### For Counselors
1. **Google OAuth**: Sign in with Google account (auto-creates profile)
2. **Update Profile**: Add specializations and availability
3. **Manage Schedule**: View and manage appointments
4. **Session Notes**: Document counseling sessions
5. **View Statistics**: Monitor earnings and performance

### For Admins
1. **Dashboard Access**: Comprehensive system overview
2. **User Management**: Monitor and manage all users
3. **Crisis Management**: Handle emergency situations
4. **Content Management**: Manage resources and announcements
5. **System Analytics**: View platform statistics

## 🔧 Development

### Running in Development
```bash
# Terminal 1 - Backend
cd Project
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Database Seeding
```bash
# Load sample data
cd Project
node loadCounselorData.js
node addMoreCounselors.js
```

### Testing
```bash
# Test API endpoints
cd Project
node testAppointmentAPIs.js
node testCounselorAPI.js
node testJournalAPI.js
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the project files

## 🙏 Acknowledgments

- **Mental Health Resources**: PHQ-9 and GAD-7 assessment tools
- **UI Components**: Radix UI and Lucide React
- **Authentication**: Google OAuth and JWT
- **Database**: MongoDB and Mongoose
- **Deployment**: Vercel and Render

---

**MindCare** - Empowering students with mental health support and resources. 🧠💙
