require('dotenv').config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-lab',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '15m', // Short-lived access token
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
    JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '7d', // Long-lived refresh token
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    COOKIE_EXPIRE: process.env.COOKIE_EXPIRE || 7, // Days
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@learninglab.com',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
