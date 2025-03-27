/**
 * Main Application Entry Point
 * Sets up Express server with middleware and routes
 */

// Load Environment Variables
require("dotenv").config();

// Import Required Modules
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dbgr = require("debug")("development: app");
const MongoStore = require("connect-mongo");
const helmet = require("helmet");
const compression = require("compression");

// Import Configuration & Environment Variables
const connectionDB = require("./config/db");
const { 
  NODE_ENV, 
  EXPRESS_SESSION_SECRET, 
  BASE_URL, 
  PORT,
  MONGO_URI 
} = require("./config/environment");

// Connect to Database
connectionDB();

// Initialize Express App
const app = express();

// Security Headers Middleware with optimized CSP
if (NODE_ENV === 'production') {
    app.use(helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "default-src": ["'self'"],
                "script-src": ["'self'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
                "style-src": ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
                "img-src": ["'self'", "data:", "https://img.icons8.com"],
                "font-src": ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"],
                "object-src": ["'none'"],
                "upgrade-insecure-requests": []
            }
        },
        frameguard: { action: 'sameorigin' },
        dnsPrefetchControl: { allow: true }
    }));
} else {
    app.use(helmet({
        contentSecurityPolicy: false
    }));
}

// Compression Middleware with optimized settings
app.use(compression({
    level: 6,
    threshold: 10 * 1024, // Only compress responses above 10KB
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

// Request Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session Configuration with optimized settings
app.use(session({
  secret: EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    ttl: 24 * 60 * 60,
    autoRemove: 'native',
    touchAfter: 24 * 3600,
    collectionName: 'sessions',
    stringify: false
  }),
  cookie: {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}));

// Static Files & View Engine with caching
const staticOptions = {
  maxAge: NODE_ENV === 'production' ? '7d' : 0,
  etag: true,
  lastModified: true
};
app.use(express.static(path.join(__dirname, "public"), staticOptions));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Request Logging in Development
if (NODE_ENV !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// Authentication Middleware
const loggedIn = require("./middlewares/check-user-logged-in");
app.use(loggedIn);

// Define Routes
const userRoute = require("./routes/user.routes");
const productsRoute = require("./routes/products.routes");
const adminRoute = require("./routes/admin.routes");
const accountRoute = require("./routes/account.routes");

// Home Route with caching
app.get("/", (req, res) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes cache
  res.render("index");
});

// Mount Route Handlers
app.use("/user", userRoute);
app.use("/products", productsRoute);
app.use("/account", accountRoute);
app.use("/admin-haha", adminRoute);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).render('error', {
    message: 'Page Not Found',
    error: { status: 404 }
  });
});

// Global Error Handling
const errorHandler = require("./middlewares/error-handler");
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
  dbgr(`✅ Server running on ${BASE_URL}`);
  
  if (NODE_ENV === 'production') {
    console.log(`Server running in production mode`);
  } else {
    console.log(`Server running in ${NODE_ENV} mode at ${BASE_URL}`);
  }
});

// Optimize server shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});