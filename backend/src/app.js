const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { CORS_ORIGIN, NODE_ENV } = require('./config/env');
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

// Security middleware
app.use(helmet());

// CORS
const allowedOrigins = (CORS_ORIGIN || '').split(',').map(origin => origin.trim()).filter(Boolean);
console.log('Allowed CORS origins:', allowedOrigins);

// CORS - Allow all origins in production for now
app.use(
    cors({
        origin: true, // Allow all origins
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
    })
);

// Additional CORS headers for preflight
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
