# Profile Completion Implementation - MindCare

## Overview

This implementation creates a two-step user onboarding process:

1. **Basic Authentication**: Users only provide email/password or use Google OAuth
2. **Profile Completion**: Users must complete detailed profile information to access full features

## Architecture Changes

### Backend Changes

#### 1. New UserDetails Model (`Project/models/userDetailsModel.js`)
- Stores detailed user profile information separately from basic auth
- Includes personal, academic, security, and consent information
- Tracks profile completion status
- Has validation for required fields

#### 2. Updated User Model (`Project/models/usermodel.js`)
- Simplified to only contain basic auth information
- Added `isProfileComplete` field to track completion status
- Removed detailed profile fields (moved to UserDetails)

#### 3. New UserDetails Controller (`Project/controllers/userDetailsController.js`)
- `getUserDetails`: Retrieve user details
- `createOrUpdateUserDetails`: Create or update user details
- `markProfileComplete`: Mark profile as complete after validation
- `getProfileCompletionStatus`: Get completion percentage and missing fields
- `deleteUserDetails`: Delete user details (admin only)

#### 4. New UserDetails Routes (`Project/routes/userDetailsRoutes.js`)
- All routes require authentication
- RESTful endpoints for CRUD operations
- Profile completion endpoint

#### 5. Updated Auth Controller (`Project/controllers/auth.js`)
- Simplified signup to only handle basic auth (email/password)
- Creates minimal user records with `isProfileComplete: false`
- Updated email templates to mention profile completion

#### 6. Updated Google OAuth (`Project/controllers/userController.js`)
- Creates minimal user records for new Google OAuth users
- Sets `isProfileComplete: false` by default

#### 7. New Profile Completion Middleware (`Project/middlewares/profileCompletion.js`)
- `requireProfileCompletion`: Restrict access to complete profiles only
- `checkProfileStatus`: Add profile status to request
- `allowLimitedAccess`: Allow access with limited functionality
- `redirectIncompleteProfiles`: Redirect incomplete profiles

#### 8. Server Updates (`Project/server.js`)
- Added userDetailsRoutes to API endpoints

### Frontend Changes

#### 1. New Profile Completion Component (`frontend/src/Components/ProfileCompletion.jsx`)
- Multi-step form for completing user profile
- Validates required fields at each step
- Integrates with backend API to save and mark profile complete
- Redirects to dashboard upon completion

#### 2. New Simple Signup Component (`frontend/src/Components/SimpleSignup.jsx`)
- Basic signup form (email, password, role only)
- Redirects to profile completion after account creation
- Simplified user experience

#### 3. New Limited Dashboard (`frontend/src/Components/LimitedDashboard.jsx`)
- Shows restricted access for incomplete profiles
- Displays locked features with explanations
- Prominent call-to-action to complete profile
- Educational content about why profile completion is important

#### 4. Updated Navbar (`frontend/src/Components/Navbar.jsx`)
- Shows profile completion status in user menu
- Orange indicator for incomplete profiles
- Quick access to profile completion
- Visual alerts and prompts

#### 5. Updated Router (`frontend/src/Router.jsx`)
- Added profile completion route
- Updated to use SimpleSignup instead of complex SignUp

#### 6. Updated API Service (`frontend/src/services/api.js`)
- Added userDetailsAPI endpoints
- Proper integration with backend routes

#### 7. Updated Auth Hook (`frontend/src/hooks/useAuth.js`)
- Uses backend `isProfileComplete` status
- Proper handling of profile completion state

#### 8. Updated App.jsx (`frontend/src/App.jsx`)
- Added limited dashboard route
- Updated login redirect logic to show appropriate dashboard
- Handles profile completion flow

## User Flow

### New User Signup
1. User visits `/signup`
2. Fills basic info (email, password, role)
3. Account created with `isProfileComplete: false`
4. Redirected to email verification
5. After verification, redirected to `/complete-profile`
6. User completes detailed profile information
7. Profile marked as complete
8. Redirected to full dashboard

### Google OAuth User
1. User clicks Google OAuth
2. If new user, minimal account created with `isProfileComplete: false`
3. Redirected to `/complete-profile`
4. User completes detailed profile information
5. Profile marked as complete
6. Redirected to full dashboard

### Existing User Login
1. User logs in with email/password
2. System checks `isProfileComplete` status
3. If complete: redirected to full dashboard
4. If incomplete: redirected to limited dashboard with profile completion prompts

## Access Control

### Limited Access (Incomplete Profiles)
- Can view limited dashboard
- Cannot access AI chat, appointments, assessments, community
- See locked features with explanations
- Prominent profile completion prompts

### Full Access (Complete Profiles)
- Access to all MindCare features
- Personalized experience based on profile data
- Full dashboard functionality

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (required, unique),
  password: String (optional, for non-OAuth users),
  googleId: String (optional, unique),
  role: String (student/admin/counselor),
  isEmailVerified: Boolean,
  isVerified: Boolean,
  isProfileComplete: Boolean, // NEW FIELD
  // ... other auth fields
}
```

### UserDetails Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required, unique),
  firstName: String (required),
  lastName: String (required),
  username: String (required),
  phone: String (required),
  dateOfBirth: Date (required),
  gender: String (required),
  institutionId: String (required),
  studentId: String (required, unique),
  course: String (required),
  year: String (required),
  department: String,
  securityQuestion: String (required),
  securityAnswer: String (required),
  privacyConsent: Boolean (required),
  dataProcessingConsent: Boolean (required),
  emergencyContact: String (required),
  emergencyPhone: String (required),
  mentalHealthConsent: Boolean (required),
  communicationConsent: Boolean,
  isProfileComplete: Boolean,
  profileCompletedAt: Date,
  // ... additional fields
}
```

## API Endpoints

### User Details
- `GET /api/user-details/:userId` - Get user details
- `POST /api/user-details/:userId` - Create/update user details
- `PUT /api/user-details/:userId` - Update user details
- `PATCH /api/user-details/:userId/complete` - Mark profile complete
- `GET /api/user-details/:userId/status` - Get completion status
- `DELETE /api/user-details/:userId` - Delete user details

## Benefits

1. **Improved User Experience**: Faster initial signup, progressive disclosure
2. **Better Data Quality**: Ensures complete profile information
3. **Personalization**: Full features only after profile completion
4. **Security**: Basic auth first, detailed info later
5. **Flexibility**: Supports both email/password and Google OAuth
6. **Clear User Journey**: Users understand what's needed to unlock features

## Security Considerations

1. **Profile Completion Required**: Full access only after profile completion
2. **Validation**: Backend validates all required fields before marking complete
3. **Authentication**: All profile operations require valid JWT token
4. **Data Separation**: Sensitive profile data stored separately from auth data

## Future Enhancements

1. **Profile Completion Progress**: Show completion percentage
2. **Partial Save**: Allow users to save incomplete profiles
3. **Profile Templates**: Different templates for different user roles
4. **Profile Import**: Import profile data from external sources
5. **Profile Verification**: Additional verification for sensitive information
6. **Profile Updates**: Allow users to update completed profiles

## Testing

1. **New User Flow**: Test complete signup → profile completion → dashboard flow
2. **Google OAuth Flow**: Test OAuth → profile completion → dashboard flow
3. **Incomplete Profile Access**: Verify limited dashboard functionality
4. **Profile Completion**: Test all required fields and validation
5. **Access Control**: Verify feature restrictions for incomplete profiles
6. **Navigation**: Test profile completion prompts throughout the app

## Deployment Notes

1. **Database Migration**: Existing users will have `isProfileComplete: false`
2. **Backward Compatibility**: Old profile data can be migrated to UserDetails
3. **Environment Variables**: Ensure all required environment variables are set
4. **API Versioning**: Consider API versioning for future changes
5. **Monitoring**: Monitor profile completion rates and user experience
