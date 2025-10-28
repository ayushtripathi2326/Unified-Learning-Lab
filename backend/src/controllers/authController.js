const asyncHandler = require('../utils/asyncHandler');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const {
    JWT_SECRET,
    JWT_EXPIRE,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRE,
    COOKIE_EXPIRE,
    FRONTEND_URL
} = require('../config/env');

/**
 * Helper function to send token response
 */
const sendTokenResponse = (user, statusCode, res) => {
    // Create access token
    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
    );

    // Create refresh token
    const refreshToken = user.generateRefreshToken();
    user.save({ validateBeforeSave: false });

    const cookieOptions = {
        expires: new Date(Date.now() + COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict'
    };

    res
        .status(statusCode)
        .cookie('token', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json({
            success: true,
            token: accessToken,
            refreshToken: refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                permissions: user.permissions
            },
        });
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields',
        });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
        });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
        return res.status(400).json({
            success: false,
            message: 'User already exists with this email',
        });
    }

    // Create user
    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        permissions: ['read'] // Default permission
    });

    // Generate email verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // TODO: Send verification email
    // const verificationUrl = `${FRONTEND_URL}/verify-email/${verificationToken}`;
    // await sendEmail({ ... });

    // Send token response
    sendTokenResponse(user, 201, res);
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide email and password',
        });
    }

    // Find user and include password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
    }

    // Check if account is locked
    if (user.isLocked) {
        return res.status(423).json({
            success: false,
            message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.',
        });
    }

    // Check if account is active
    if (!user.isActive) {
        return res.status(403).json({
            success: false,
            message: 'Account has been deactivated. Please contact support.',
        });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        // Increment login attempts
        await user.incLoginAttempts();

        return res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Send token response
    sendTokenResponse(user, 200, res);
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
exports.refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'No refresh token provided',
        });
    }

    try {
        // Hash the refresh token
        const hashedToken = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        // Find user with this refresh token
        const user = await User.findOne({ refreshToken: hashedToken });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token',
            });
        }

        // Send new tokens
        sendTokenResponse(user, 200, res);
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid refresh token',
        });
    }
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');

    res.json({
        success: true,
        data: user,
    });
});

/**
 * @desc    Update user details
 * @route   PUT /api/auth/updatedetails
 * @access  Private
 */
exports.updateDetails = asyncHandler(async (req, res) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });

    res.json({
        success: true,
        data: user,
    });
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.comparePassword(req.body.currentPassword))) {
        return res.status(401).json({
            success: false,
            message: 'Current password is incorrect',
        });
    }

    // Validate new password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(req.body.newPassword)) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
        });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgotpassword
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        // Don't reveal if user exists
        return res.json({
            success: true,
            message: 'If an account exists, a password reset email has been sent',
        });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;

    // TODO: Send email with reset link
    // await sendEmail({ ... });

    res.json({
        success: true,
        message: 'If an account exists, a password reset email has been sent',
        // Remove in production:
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
});

/**
 * @desc    Reset password
 * @route   PUT /api/auth/resetpassword/:resettoken
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid or expired reset token',
        });
    }

    // Validate new password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(req.body.password)) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
        });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
});

/**
 * @desc    Verify email
 * @route   GET /api/auth/verifyemail/:token
 * @access  Public
 */
exports.verifyEmail = asyncHandler(async (req, res) => {
    // Get hashed token
    const emailVerificationToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        emailVerificationToken,
        emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid or expired verification token',
        });
    }

    // Update user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    res.json({
        success: true,
        message: 'Email verified successfully',
    });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res) => {
    // Clear refresh token from database
    await User.findByIdAndUpdate(req.user.id, { refreshToken: undefined });

    res
        .cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        })
        .cookie('refreshToken', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        })
        .json({
            success: true,
            message: 'Logged out successfully',
        });
});
