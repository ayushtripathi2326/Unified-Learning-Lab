require('dotenv').config();

// Validate critical secrets at startup
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('FATAL: JWT_SECRET must be set in .env and be at least 32 characters');
}
if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.length < 32) {
    throw new Error('FATAL: JWT_REFRESH_SECRET must be set in .env and be at least 32 characters');
}

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-lab',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || '15m',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '7d',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    COOKIE_EXPIRE: process.env.COOKIE_EXPIRE || 7,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@learninglab.com',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
