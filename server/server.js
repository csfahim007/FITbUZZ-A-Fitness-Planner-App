require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// 1. Configure allowed origins
const allowedOrigins = [
  process.env.CORS_ORIGIN || 'https://fitbuzz-frontend.onrender.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

// 2. CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Allowed origin:', origin);
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      console.log('🔍 Available origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept',
    'Origin',
    'Cache-Control',
    'X-File-Name'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// 3. Apply CORS first - CRITICAL ORDER
app.use(cors(corsOptions));

// 4. Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// 5. Security middleware (after CORS)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: false
}));

// 6. Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 7. Security sanitization
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// 8. General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true, // Important for Render.com
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  }
});

// 9. Apply general rate limiting to all API routes
app.use('/api/', apiLimiter);

// 10. Health check endpoint (before other routes)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    allowedOrigins: allowedOrigins,
    corsEnabled: true
  });
});

// 11. API routes (DO NOT apply authLimiter here - it's already in authRoutes)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/exercises', require('./routes/exerciseRoutes'));
app.use('/api/nutrition', require('./routes/nutritionRoutes'));

// 12. 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// 13. Global error handler (must be last)
app.use(errorHandler);

// 14. Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log('🌐 Allowed CORS origins:', allowedOrigins);
  console.log('🔒 Security middleware enabled');
});

// 15. Graceful shutdown
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});