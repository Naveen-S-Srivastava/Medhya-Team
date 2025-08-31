# Deployment Guide - Fixed Issues

## 🚨 **Issues Fixed:**

### **1. Page Refresh 404 Error (Client-Side Routing)**
- ✅ Added `_redirects` file for Netlify
- ✅ Added `vercel.json` for Vercel
- ✅ Updated Vite config for proper SPA handling

### **2. Backend Deployment Issues**
- ✅ Enhanced CORS configuration for production
- ✅ Added proper error handling
- ✅ Added health check endpoint
- ✅ Added global error handler

### **3. Environment Configuration**
- ✅ Enhanced environment detection for multiple deployment platforms
- ✅ Added debug logging for development
- ✅ Better fallback handling

## Environment-Based API Configuration

This project automatically detects the environment and uses the appropriate API URL:

- **Development (localhost)**: Uses `http://localhost:5000/api`
- **Production**: Uses `https://mindcare-17y9.onrender.com/api`

## How It Works

The application automatically detects the environment based on the `window.location.hostname`:

1. **Local Development**: When running on `localhost` or `127.0.0.1`, it uses the local backend
2. **Production**: When deployed, it automatically uses the production API
3. **Multiple Platforms**: Supports Vercel, Netlify, GitHub Pages, and custom domains

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

### 3. Deployment Configuration Files
- `frontend/public/_redirects` - Netlify routing
- `frontend/public/vercel.json` - Vercel routing
- `frontend/vite.config.js` - Build configuration

## Development Workflow

### Local Development
1. Start your local backend server on port 5000
2. Run the frontend: `npm run dev`
3. The app will automatically use `http://localhost:5000/api`

### Production Deployment

#### Option 1: Vercel
```bash
cd frontend
npm run build
npm run deploy:vercel
```

#### Option 2: Netlify
```bash
cd frontend
npm run build
npm run deploy:netlify
```

#### Option 3: Manual Deployment
1. Build the project: `npm run build`
2. Upload the `dist` folder to your hosting service
3. Configure routing to serve `index.html` for all routes

## Backend Deployment

### Environment Variables
Create a `.env` file in the `Project` directory:

```env
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here

# Server Configuration
PORT=5000
NODE_ENV=production
```

### Deploy to Render
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically on push

## Testing

### Local Testing
- Start local backend: `cd Project && npm start`
- Start frontend: `cd frontend && npm run dev`
- Verify API calls go to `localhost:5000`

### Production Testing
- Deploy frontend to any hosting service
- Verify API calls go to `mindcare-17y9.onrender.com`
- Test page refresh functionality

## Troubleshooting

### Page Refresh 404 Error
**Problem**: Refreshing a page shows 404 error
**Solution**: 
- Ensure `_redirects` file is in `public` folder (Netlify)
- Ensure `vercel.json` is in root folder (Vercel)
- Configure hosting service to serve `index.html` for all routes

### API Calls Not Working
**Problem**: API calls fail in production
**Solution**:
1. Check browser console for CORS errors
2. Verify the correct API URL is being used
3. Ensure backend CORS allows your frontend domain
4. Check if the backend server is running

### Environment Detection Issues
**Problem**: Wrong API URL being used
**Solution**:
1. Check browser console for environment logs
2. Verify `window.location.hostname` is correct
3. Update environment configuration if needed

## Health Check

Test your deployment with these endpoints:

- **Frontend**: Your deployed frontend URL
- **Backend Health**: `https://mindcare-17y9.onrender.com/api/health`
- **Backend Root**: `https://mindcare-17y9.onrender.com/`

## Benefits

1. **Automatic Environment Detection**: No manual configuration needed
2. **Seamless Development**: Works locally without changes
3. **Production Ready**: Automatically switches to production API when deployed
4. **Multiple Platform Support**: Works on Vercel, Netlify, GitHub Pages, etc.
5. **Centralized Configuration**: Easy to maintain and update
6. **Error Handling**: Consistent error handling across all API calls
7. **Page Refresh Support**: No more 404 errors on refresh

## Future Enhancements

1. **Environment Variables**: Could be enhanced to use `.env` files for more flexibility
2. **Multiple Environments**: Could support staging, testing, etc.
3. **Feature Flags**: Could add feature flags based on environment
4. **Analytics**: Could add different analytics configurations per environment
5. **CDN Integration**: Could add CDN for static assets
6. **Performance Monitoring**: Could add performance monitoring tools
