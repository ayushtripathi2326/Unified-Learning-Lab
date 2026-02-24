const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { CORS_ORIGIN, NODE_ENV, FRONTEND_URL } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const resultRoutes = require('./routes/results');
const adminRoutes = require('./routes/admin');
const chatbotRoutes = require('./routes/chatbot');

const app = express();

// Ensure Express respects the real client IP when behind proxies/load balancers
app.set('trust proxy', 1);

// Parse allowed CORS origins from environment + always include production URLs
const envOrigins = (CORS_ORIGIN || '').split(',').map(origin => origin.trim()).filter(Boolean);
const productionOrigins = [
    'https://unified-learning-lab.onrender.com',
    'https://unified-learning-lab-backend.onrender.com',
];
// Include FRONTEND_URL if set
if (FRONTEND_URL && !envOrigins.includes(FRONTEND_URL)) {
    envOrigins.push(FRONTEND_URL);
}
// Merge and deduplicate
const allowedOrigins = [...new Set([...envOrigins, ...productionOrigins])];
console.log('Allowed CORS origins:', allowedOrigins);

// Security middleware with enhanced headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", ...allowedOrigins],
        },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

// CORS — restrict to configured origins only
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, curl, health checks)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error(`Origin ${origin} not allowed by CORS`));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control']
    })
);

// Body parser with size limits to prevent DoS
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Logging
if (NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Unified Learning Lab API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            questions: '/api/questions',
            results: '/api/results',
            admin: '/api/admin',
            chatbot: '/api/chatbot'
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
