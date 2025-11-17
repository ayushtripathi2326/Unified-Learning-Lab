#!/usr/bin/env node

// Simple startup script for the backend
console.log('🚀 Starting Unified Learning Lab Backend...');

// Load environment variables
require('dotenv').config();

// Check required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars);
    process.exit(1);
}

// Start the server
try {
    require('./src/server.js');
} catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
}