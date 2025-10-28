const express = require('express');
const {
    register,
    login,
    refreshToken,
    getMe,
    updateDetails,
    updatePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
    authLimiter,
    passwordResetLimiter,
    registrationLimiter
} = require('../middleware/rateLimiter');
const {
    registerValidation,
    loginValidation,
    updateDetailsValidation,
    updatePasswordValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    validate
} = require('../middleware/inputValidation');

const router = express.Router();

// Public routes with rate limiting and validation
router.post('/register', registrationLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/refresh', authLimiter, refreshToken);
router.post('/forgotpassword', passwordResetLimiter, forgotPasswordValidation, validate, forgotPassword);
router.put('/resetpassword/:resettoken', passwordResetLimiter, resetPasswordValidation, validate, resetPassword);
router.get('/verifyemail/:token', verifyEmail);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetailsValidation, validate, updateDetails);
router.put('/updatepassword', protect, updatePasswordValidation, validate, updatePassword);
router.post('/logout', protect, logout);

module.exports = router;
