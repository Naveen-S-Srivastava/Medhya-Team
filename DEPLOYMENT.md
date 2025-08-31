# Deployment Guide

## Environment-Based API Configuration

This project automatically detects the environment and uses the appropriate API URL:

- **Development (localhost)**: Uses `http://localhost:5000/api`
- **Production**: Uses `https://mindcare-17y9.onrender.com/api`

## How It Works

The application automatically detects the environment based on the `window.location.hostname`:

1. **Local Development**: When running on `localhost` or `127.0.0.1`, it uses the local backend
2. **Production**: When deployed, it automatically uses the production API

## Configuration Files

### 1. Environment Configuration (`frontend/src/config/environment.js`)
```javascript
export const getApiBaseUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  return 'https://mindcare-17y9.onrender.com/api';
};
```

### 2. API Service (`frontend/src/services/api.js`)
Centralized API calls with automatic environment detection and error handling.

### 3. Updated Components
All components now use the centralized API configuration:
- `useAuth.js` - Authentication hooks
- `SignUp.jsx` - Registration component
- Other components as needed

## Development Workflow

### Local Development
1. Start your local backend server on port 5000
2. Run the frontend: `npm run dev`
3. The app will automatically use `http://localhost:5000/api`

### Production Deployment
1. Deploy your frontend to any hosting service (Vercel, Netlify, etc.)
2. The app will automatically use `https://mindcare-17y9.onrender.com/api`
3. No environment variables or configuration changes needed

## Benefits

1. **Automatic Environment Detection**: No manual configuration needed
2. **Seamless Development**: Works locally without changes
3. **Production Ready**: Automatically switches to production API when deployed
4. **Centralized Configuration**: Easy to maintain and update
5. **Error Handling**: Consistent error handling across all API calls

## Testing

### Local Testing
- Start local backend: `cd Project && npm start`
- Start frontend: `cd frontend && npm run dev`
- Verify API calls go to `localhost:5000`

### Production Testing
- Deploy frontend to any hosting service
- Verify API calls go to `mindcare-17y9.onrender.com`

## Troubleshooting

### API Calls Not Working
1. Check browser console for errors
2. Verify the correct API URL is being used
3. Ensure the backend server is running (for local development)
4. Check CORS configuration on the backend

### Environment Detection Issues
1. Verify `window.location.hostname` is correct
2. Check if the environment configuration is imported properly
3. Ensure the API service is using the environment configuration

## Future Enhancements

1. **Environment Variables**: Could be enhanced to use `.env` files for more flexibility
2. **Multiple Environments**: Could support staging, testing, etc.
3. **Feature Flags**: Could add feature flags based on environment
4. **Analytics**: Could add different analytics configurations per environment
