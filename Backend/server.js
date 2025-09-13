// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import adminRoutes from "./routes/adminRoutes.js";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";
// import userRoutes from "./routes/userRoutes.js";
// import userDetailsRoutes from "./routes/userDetailsRoutes.js";
// import assessmentRoutes from "./routes/assessmentRoutes.js";
// import appointmentRoutes from "./routes/appointmentRoutes.js";
// import activityRoutes from "./routes/activityRoutes.js";
// import chatRoutes from "./routes/chatRoutes.js";
// import crisisRoutes from "./routes/crisisRoutes.js";
// import resourceRoutes from "./routes/resourceRoutes.js";
// import counselorRoutes from "./routes/counselorRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";
// import communityRoutes from "./routes/communityRoutes.js";
// import journalRoutes from "./routes/journalRoutes.js";
// import counselorDashboardRoutes from "./routes/counselorDashboardRoutes.js";

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // Enhanced CORS configuration for production
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);

//     // Allow all origins if CORS_DEBUG is set to 'true'
//     if (process.env.CORS_DEBUG === 'true') {
//       console.log('🔓 CORS_DEBUG enabled - allowing all origins');
//       return callback(null, true);
//     }

//     // In development, allow all origins
//     if (process.env.NODE_ENV !== 'production') {
//       console.log('🔓 Development mode - allowing all origins');
//       return callback(null, true);
//     }
    
//     // Allow all origins if explicitly set in environment
//     if (process.env.ALLOW_ALL_ORIGINS === 'true') {
//       console.log('🔓 ALLOW_ALL_ORIGINS enabled - allowing all origins');
//       return callback(null, true);
//     }

//     // Get allowed origins from environment variables
//     const allowedOriginsFromEnv = process.env.ALLOWED_ORIGINS
//       ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
//       : [];

//     const frontendUrl = process.env.FRONTEND_URL;
    
//     console.log('🔍 CORS origin check for:', origin);
//     console.log('  - Environment origins:', allowedOriginsFromEnv);
//     console.log('  - Frontend URL:', frontendUrl);

//     // Combine hardcoded origins with environment-based origins
//     const allowedOrigins = [
//       // Environment-based origins
//       ...allowedOriginsFromEnv,
//       frontendUrl
//     ].filter(Boolean); // Remove any undefined/null values
    
//     console.log('  - Combined allowed origins:', allowedOrigins);

//     // Check if origin is in allowed list
//     if (allowedOrigins.includes(origin)) {
//       console.log('✅ CORS allowed origin (exact match):', origin);
//       return callback(null, true);
//     }


//     // If origin is not allowed, reject with error
//     console.log('❌ CORS blocked origin:', origin);
//     console.log('📋 Allowed origins:', allowedOrigins);
//     console.log('🔍 Checking deployment patterns...');
    
//     // Log which pattern check failed for debugging
//     deploymentPatterns.forEach((pattern, index) => {
//       const matches = pattern.test(origin);
//       console.log(`  Pattern ${index + 1} (${pattern}): ${matches ? '✅ MATCH' : '❌ NO MATCH'}`);
//     });
    
//     callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true,
//   optionsSuccessStatus: 200,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: [
//     'Content-Type',
//     'Authorization',
//     'X-Requested-With',
//     'Accept',
//     'Origin',
//     'Access-Control-Request-Method',
//     'Access-Control-Request-Headers'
//   ]
// };

// app.use(cors(corsOptions));

// // CORS debugging middleware
// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   console.log('🌐 Request received:', {
//     method: req.method,
//     url: req.url,
//     origin: origin,
//     userAgent: req.headers['user-agent']
//   });
  
//   // Additional CORS headers for deployment platforms
//   if (origin) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');

//   // Handle preflight requests
//   if (req.method === 'OPTIONS') {
//     console.log('✅ Preflight request handled for origin:', origin);
//     res.sendStatus(200);
//     return;
//   }

//   next();
// });

// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch(err => console.error("❌ MongoDB error:", err));
// app.use("/api/users", userRoutes);
// app.use("/api/user-details", userDetailsRoutes);
// app.use("/api/assessments", assessmentRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/activity", activityRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/crisis", crisisRoutes);
// app.use("/api/resources", resourceRoutes);
// app.use("/api/counselors", counselorRoutes);
// app.use("/api/payments", paymentRoutes);
// app.use("/api/community", communityRoutes);
// app.use("/api/journal", journalRoutes);
// app.use("/api/counselor-dashboard", counselorDashboardRoutes);
// app.use("/api/admin", adminRoutes);

// // Health check endpoint
// app.get("/api/health", (req, res) => {
//   res.status(200).json({
//     status: "success",
//     message: "MindCare API is running",
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || 'development'
//   });
// });

// // CORS test endpoint
// app.get("/api/cors-test", (req, res) => {
//   const origin = req.headers.origin;
//   console.log('🧪 CORS test endpoint called from origin:', origin);
  
//   res.status(200).json({
//     status: "success",
//     message: "CORS test successful",
//     origin: origin,
//     timestamp: new Date().toISOString(),
//     corsInfo: {
//       allowedOrigins: process.env.ALLOWED_ORIGINS,
//       frontendUrl: process.env.FRONTEND_URL,
//       nodeEnv: process.env.NODE_ENV,
//       corsDebug: process.env.CORS_DEBUG
//     },
//     requestHeaders: req.headers,
//     serverInfo: {
//       corsOptions: {
//         credentials: corsOptions.credentials,
//         methods: corsOptions.methods,
//         allowedHeaders: corsOptions.allowedHeaders
//       }
//     }
//   });
// });

// // Root endpoint
// app.get("/", (req, res) => {
//   res.json({
//     message: "MindCare API is running",
//     version: "1.0.0",
//     environment: process.env.NODE_ENV || 'development',
//     timestamp: new Date().toISOString()
//   });
// });

// // Handle 404 errors
// app.use("*", (req, res) => {
//   res.status(404).json({
//     status: "error",
//     message: `Route ${req.originalUrl} not found`
//   });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error('Global error:', err);
  
//   // Special handling for CORS errors
//   if (err.message === 'Not allowed by CORS') {
//     console.error('🚫 CORS Error Details:');
//     console.error('  Origin:', req.headers.origin);
//     console.error('  Method:', req.method);
//     console.error('  URL:', req.url);
//     console.error('  User-Agent:', req.headers['user-agent']);
    
//     return res.status(403).json({
//       status: 'error',
//       message: 'CORS Error: Origin not allowed',
//       details: {
//         origin: req.headers.origin,
//         method: req.method,
//         url: req.url,
//         allowedOrigins: process.env.ALLOWED_ORIGINS,
//         frontendUrl: process.env.FRONTEND_URL,
//         nodeEnv: process.env.NODE_ENV
//       }
//     });
//   }
  
//   if (err.name === 'ValidationError') {
//     return res.status(400).json({
//       status: 'error',
//       message: 'Validation Error',
//       errors: Object.values(err.errors).map(e => e.message)
//     });
//   }
  
//   if (err.name === 'CastError') {
//     return res.status(400).json({
//       status: 'error',
//       message: 'Invalid ID format'
//     });
//   }
  
//   // Use statusCode instead of status for HTTP status code
//   const statusCode = err.statusCode || 500;
//   const status = err.status || 'error';
  
//   res.status(statusCode).json({
//     status,
//     message: err.message || 'Internal server error'
//   });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
// });





import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

// Import your Express routes
import adminRoutes from "./routes/adminRoutes.js";
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
import moodTrackingRoutes from "./routes/moodTrackingRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app and HTTP server
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io server and attach it to the HTTP server
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

// Maps to keep track of users (updated to use socket IDs instead of emails)
const rooms = {}; // { roomId: [ { id } ] }
// Store online users
let onlineCounselors = new Map();
const onlineStudents = new Map();


io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Counselor comes online
  socket.on("counselor-online", (counselorID) => {
    onlineCounselors.set(counselorID, socket.id);
    console.log(`🎯 Counselor ${counselorID} online`);
    io.emit("counselor-status", { counselorID, isOnline: true });
  });

  // Student comes online
  socket.on("student-online", (studentID) => {
    onlineStudents.set(studentID, socket.id);
    console.log(`🎓 Student ${studentID} online`);
    io.emit("student-status", { studentID, isOnline: true });
  });

  // User joins a room
  socket.on("room:join", ({ room }) => {
    if (!rooms[room]) rooms[room] = [];

    if (rooms[room].length >= 2) {
      socket.emit("room:full");
      return;
    }

    rooms[room].push({ id: socket.id });
    socket.join(room);

    const otherUsers = rooms[room].filter((u) => u.id !== socket.id);
    socket.emit("room:join", { room, otherUsers });
    socket.to(room).emit("user:joined", { id: socket.id });
  });

  // Calls
  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  // User leaves the room
  socket.on("room:leave", ({ room }) => {
    leaveRoom(socket, room);
  });

  // Disconnect handling
  socket.on("disconnect", () => {
    // Remove counselor if exists
    for (let [counselorID, sockId] of onlineCounselors.entries()) {
      if (sockId === socket.id) {
        onlineCounselors.delete(counselorID);
        console.log(`❌ Counselor ${counselorID} offline`);
        io.emit("counselor-status", { counselorID, isOnline: false });
      }
    }

    // Remove student if exists
    for (let [studentID, sockId] of onlineStudents.entries()) {
      if (sockId === socket.id) {
        onlineStudents.delete(studentID);
        console.log(`❌ Student ${studentID} offline`);
        io.emit("student-status", { studentID, isOnline: false });
      }
    }

    console.log(`Socket disconnected: ${socket.id}`);

    // Clean up room membership
    for (const room in rooms) {
      const user = rooms[room].find((u) => u.id === socket.id);
      if (user) {
        leaveRoom(socket, room);
      }
    }
  });

  // Helper
  function leaveRoom(socket, room) {
    if (rooms[room]) {
      rooms[room] = rooms[room].filter((u) => u.id !== socket.id);
      socket.to(room).emit("user:left", { id: socket.id });
      if (rooms[room].length === 0) delete rooms[room];
    }
    socket.leave(room);
    console.log(`User ${socket.id} left room ${room}`);
  }
});


// Enhanced CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (process.env.CORS_DEBUG === 'true' || process.env.NODE_ENV !== 'production' || process.env.ALLOW_ALL_ORIGINS === 'true') {
      return callback(null, true);
    }
    const allowedOriginsFromEnv = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) : [];
    const frontendUrl = process.env.FRONTEND_URL;
    const allowedOrigins = [...allowedOriginsFromEnv, frontendUrl].filter(Boolean);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
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
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Standard Express middleware and route setup
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Your API routes
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
app.use("/api/mood", moodTrackingRoutes);
app.use("/api/messages", messageRoutes);

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
  res.status(200).json({
    status: "success",
    message: "CORS test successful",
    origin: origin,
    timestamp: new Date().toISOString()
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
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      status: 'error',
      message: 'CORS Error: Origin not allowed'
    });
  }
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  res.status(statusCode).json({
    status,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});