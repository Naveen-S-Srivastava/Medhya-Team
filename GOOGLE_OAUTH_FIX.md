# 🔧 Google OAuth Configuration Fix

## 🚨 **Problem: "Access blocked: this app request is invalid"**

This error occurs because your Google OAuth configuration doesn't include your production domain in the authorized redirect URIs.

## ✅ **Solution: Update Google OAuth Configuration**

### **Step 1: Go to Google Cloud Console**

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID and click on it

### **Step 2: Update Authorized JavaScript Origins**

Add these URLs to **Authorized JavaScript origins**:

```
# Development
http://localhost:5173
http://localhost:3000
http://localhost:5174
http://localhost:5175

# Production (replace with your actual domain)
https://your-app-name.vercel.app
https://your-app-name.netlify.app
https://your-custom-domain.com
```

### **Step 3: Update Authorized Redirect URIs**

Add these URLs to **Authorized redirect URIs**:

```
# Development
http://localhost:5173
http://localhost:3000
http://localhost:5174
http://localhost:5175

# Production (replace with your actual domain)
https://your-app-name.vercel.app
https://your-app-name.netlify.app
https://your-custom-domain.com
```

### **Step 4: Environment Variables**

Make sure your frontend has the correct Google Client ID:

**For Development (`frontend/.env.local`):**
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**For Production (Vercel/Netlify Environment Variables):**
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## 🔧 **Alternative Solution: Dynamic OAuth Configuration**

If you want to handle this automatically, I can create a dynamic OAuth configuration that detects the environment:

### **Option 1: Environment-Based Client IDs**

Create separate OAuth client IDs for development and production:

1. **Development Client ID**: Only allows localhost origins
2. **Production Client ID**: Only allows your production domain

### **Option 2: Single Client ID with Multiple Origins**

Use one client ID but add all your domains to the authorized origins.

## 🚀 **Quick Fix Steps:**

### **1. Update Google Cloud Console**
- Add your production domain to authorized origins
- Add your production domain to redirect URIs
- Save the changes

### **2. Set Environment Variables**
- Add `VITE_GOOGLE_CLIENT_ID` to your deployment platform
- Use the same client ID for both development and production

### **3. Test the Fix**
- Deploy your application
- Try Google OAuth login
- Should work without "access blocked" error

## 🎯 **Common Production Domains:**

### **Vercel:**
```
https://your-app-name.vercel.app
```

### **Netlify:**
```
https://your-app-name.netlify.app
```

### **Custom Domain:**
```
https://yourdomain.com
```

## ✅ **Verification:**

After updating the configuration:

1. **Wait 5-10 minutes** for Google to propagate changes
2. **Test in development** - should still work
3. **Test in production** - should now work
4. **Check browser console** - no more OAuth errors

## 🚨 **Important Notes:**

- **Changes take time**: Google OAuth changes can take 5-10 minutes to propagate
- **Exact domain match**: The domain must match exactly (including https://)
- **No trailing slashes**: Don't add trailing slashes to the URIs
- **Environment variables**: Make sure your deployment platform has the correct environment variables

## 🎉 **Expected Result:**

After applying these fixes, Google OAuth should work in both development and production without the "access blocked" error.
