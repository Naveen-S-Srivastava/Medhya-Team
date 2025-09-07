import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import userDetailsRoutes from "./routes/userDetailsRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import crisisRoutes from "./routes/crisisRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import counselorRoutes from "./routes/counselorRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import counselorDashboardRoutes from "./routes/counselorDashboardRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enhanced CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow all origins if CORS_DEBUG is set to 'true'
    if (process.env.CORS_DEBUG === 'true') {
      console.log('🔓 CORS_DEBUG enabled - allowing all origins');
      return callback(null, true);
    }

    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔓 Development mode - allowing all origins');
      return callback(null, true);
    }
    
    // Allow all origins if explicitly set in environment
    if (process.env.ALLOW_ALL_ORIGINS === 'true') {
      console.log('🔓 ALLOW_ALL_ORIGINS enabled - allowing all origins');
      return callback(null, true);
    }

    // Get allowed origins from environment variables
    const allowedOriginsFromEnv = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : [];

    const frontendUrl = process.env.FRONTEND_URL;
    
    console.log('🔍 CORS origin check for:', origin);
    console.log('  - Environment origins:', allowedOriginsFromEnv);
    console.log('  - Frontend URL:', frontendUrl);

    // Combine hardcoded origins with environment-based origins
    const allowedOrigins = [
      // Local development
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174',
      'http://localhost:5175',

      // Vercel deployments
      'https://mindcare-frontend.vercel.app',
      'https://mindcare.vercel.app',
      'https://mindcare-frontend-git-main-sarafkushagra.vercel.app',
      'https://mindcare-git-auth-sarafkushagra.vercel.app',

      // Netlify deployments
      'https://mindcare-frontend.netlify.app',
      'https://mindcare.netlify.app',
      'https://mindcare.netlify.com',

      // Render deployments (common patterns)
      'https://mindcare.onrender.com',
      'https://mindcare-backend.onrender.com',
      'https://mindcare-api.onrender.com',
      'https://mindcare-17y9.onrender.com',

      // Railway deployments
      'https://mindcare.up.railway.app',
      'https://mindcare-production.up.railway.app',

      // Heroku deployments
      'https://mindcare.herokuapp.com',
      'https://mindcare-backend.herokuapp.com',

      // Custom domains
      'https://mindcare.app',
      'https://www.mindcare.app',
      'https://api.mindcare.app',

      // Environment-based origins
      ...allowedOriginsFromEnv,
      frontendUrl
    ].filter(Boolean); // Remove any undefined/null values
    
    console.log('  - Combined allowed origins:', allowedOrigins);

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS allowed origin (exact match):', origin);
      return callback(null, true);
    }

    // Allow if origin matches common deployment patterns
    const deploymentPatterns = [
      /^https:\/\/mindcare.*\.vercel\.app$/,
      /^https:\/\/mindcare.*\.netlify\.app$/,
      /^https:\/\/mindcare.*\.onrender\.com$/,
      /^https:\/\/mindcare-17y9\.onrender\.com$/,
      /^https:\/\/mindcare.*\.up\.railway\.app$/,
      /^https:\/\/mindcare.*\.herokuapp\.com$/,
      /^https:\/\/.*\.mindcare\.app$/
    ];

    const isAllowedPattern = deploymentPatterns.some(pattern => pattern.test(origin));
    if (isAllowedPattern) {
      console.log('✅ CORS allowed origin (pattern match):', origin);
      return callback(null, true);
    }

    // If origin is not allowed, reject with error
    console.log('❌ CORS blocked origin:', origin);
    console.log('📋 Allowed origins:', allowedOrigins);
    console.log('🔍 Checking deployment patterns...');
    
    // Log which pattern check failed for debugging
    deploymentPatterns.forEach((pattern, index) => {
      const matches = pattern.test(origin);
      console.log(`  Pattern ${index + 1} (${pattern}): ${matches ? '✅ MATCH' : '❌ NO MATCH'}`);
    });
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ]
};

app.use(cors(corsOptions));

// CORS debugging middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log('🌐 Request received:', {
    method: req.method,
    url: req.url,
    origin: origin,
    userAgent: req.headers['user-agent']
  });
  
  // Additional CORS headers for deployment platforms
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ Preflight request handled for origin:', origin);
    res.sendStatus(200);
    return;
  }

  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));
app.use("/api/users", userRoutes);
app.use("/api/user-details", userDetailsRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/crisis", crisisRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/counselors", counselorRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/counselor-dashboard", counselorDashboardRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "MindCare API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// CORS test endpoint
app.get("/api/cors-test", (req, res) => {
  const origin = req.headers.origin;
  console.log('🧪 CORS test endpoint called from origin:', origin);
  
  res.status(200).json({
    status: "success",
    message: "CORS test successful",
    origin: origin,
    timestamp: new Date().toISOString(),
    corsInfo: {
      allowedOrigins: process.env.ALLOWED_ORIGINS,
      frontendUrl: process.env.FRONTEND_URL,
      nodeEnv: process.env.NODE_ENV,
      corsDebug: process.env.CORS_DEBUG
    },
    requestHeaders: req.headers,
    serverInfo: {
      corsOptions: {
        credentials: corsOptions.credentials,
        methods: corsOptions.methods,
        allowedHeaders: corsOptions.allowedHeaders
      }
    }
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "MindCare API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Handle 404 errors
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  
  // Special handling for CORS errors
  if (err.message === 'Not allowed by CORS') {
    console.error('🚫 CORS Error Details:');
    console.error('  Origin:', req.headers.origin);
    console.error('  Method:', req.method);
    console.error('  URL:', req.url);
    console.error('  User-Agent:', req.headers['user-agent']);
    
    return res.status(403).json({
      status: 'error',
      message: 'CORS Error: Origin not allowed',
      details: {
        origin: req.headers.origin,
        method: req.method,
        url: req.url,
        allowedOrigins: process.env.ALLOWED_ORIGINS,
        frontendUrl: process.env.FRONTEND_URL,
        nodeEnv: process.env.NODE_ENV
      }
    });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid ID format'
    });
  }
  
  // Use statusCode instead of status for HTTP status code
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  
  res.status(statusCode).json({
    status,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
