const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { JWT_SECRET, JWT_REFRESH_SECRET } = require('../config/env');
const User = require('../../models/User');

/**
 * Middleware to protect routes - requires valid JWT token
 */
exports.protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user from token
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User account is deactivated',
            });
        }

        // Check if account is locked
        if (user.isLocked) {
            return res.status(401).json({
                success: false,
                message: 'Account is temporarily locked due to multiple failed login attempts',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired',
                code: 'TOKEN_EXPIRED'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }
};

/**
 * Middleware to check user roles
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`,
            });
        }
        next();
    };
};

/**
 * Middleware to check user permissions
 */
exports.checkPermission = (...permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        const hasPermission = permissions.some(permission =>
            req.user.permissions && req.user.permissions.includes(permission)
        );

        if (!hasPermission && !req.user.permissions.includes('admin')) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions to access this route',
            });
        }

        next();
    };
};

/**
 * Middleware to check if email is verified
 */
exports.requireEmailVerification = (req, res, next) => {
    if (!req.user.isEmailVerified) {
        return res.status(403).json({
            success: false,
            message: 'Please verify your email to access this resource',
        });
    }
    next();
};

/**
 * Optional authentication - doesn't fail if no token
 */
exports.optionalAuth = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (user && user.isActive && !user.isLocked) {
            req.user = user;
        }
    } catch (error) {
        // Continue without user if token is invalid
    }

    next();
};
