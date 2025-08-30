# MindCare Backend Setup Guide

## Environment Variables Setup

Create a `.env` file in the `Project` directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here

# Email Configuration (optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `http://localhost:3000` (if using different port)
7. Add authorized redirect URIs:
   - `http://localhost:5173` (for development)
8. Copy the Client ID

### 2. Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

## Running the Application

### 1. Create Environment File
First, create a `.env` file in the `Project` directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/mindcare

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_change_in_production

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 2. Create Demo User
Run this command to create a demo user for testing:

```bash
cd Project
node createDemoUser.js
```

### 3. Start Backend
```bash
cd Project
npm install
npm run dev
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

## Authentication Flow

1. **Login Page**: User can login with email/password or Google OAuth
2. **Profile Check**: After login, system checks if user profile is complete
3. **Redirect Logic**:
   - If profile complete → Dashboard (`/contact-choice`)
   - If profile incomplete → UserSignup.jsx → Signup.jsx

## Demo Credentials

- **Student**: `student@university.edu` / `demo123456`
- **Admin**: `admin@institution.edu` / `admin123456`

## API Endpoints

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/google-auth` - Google OAuth
- `GET /api/users/profile` - Get user profile (protected)
- `POST /api/users/logout` - User logout (protected)
