const app = require('./app');
const connectDB = require('./config/database');
const { PORT, NODE_ENV } = require('./config/env');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! Shutting down...');
    logger.error(err.name, err.message);
    process.exit(1);
});

// Connect to database with free tier optimizations
connectDB();

// Keep connection alive for free tier
setInterval(() => {
    // Simple keep-alive without mongoose dependency
    console.log('Keep-alive ping');
}, 30000);

// Start server
const server = app.listen(PORT, () => {
    logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! Shutting down...');
    logger.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Graceful shutdown for zero downtime
process.on('SIGTERM', () => {
    logger.info('SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated!');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT RECEIVED. Shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated!');
        process.exit(0);
    });
});
