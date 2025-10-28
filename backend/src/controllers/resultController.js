const asyncHandler = require('../utils/asyncHandler');
const Result = require('../../models/Result'); // Using old models location

/**
 * @desc    Submit test result
 * @route   POST /api/results
 * @access  Private
 */
exports.submitResult = asyncHandler(async (req, res) => {
    const result = await Result.create({
        ...req.body,
        user: req.user.id,
    });

    res.status(201).json({
        success: true,
        data: result,
    });
});

/**
 * @desc    Get user results
 * @route   GET /api/results/user
 * @access  Private
 */
exports.getUserResults = asyncHandler(async (req, res) => {
    const results = await Result.find({ user: req.user.id })
        .populate('user', 'name email')
        .sort('-createdAt');

    res.json({
        success: true,
        count: results.length,
        data: results,
    });
});

/**
 * @desc    Get single result
 * @route   GET /api/results/:id
 * @access  Private
 */
exports.getResult = asyncHandler(async (req, res) => {
    const result = await Result.findById(req.params.id).populate('user', 'name email');

    if (!result) {
        return res.status(404).json({
            success: false,
            message: 'Result not found',
        });
    }

    // Make sure user owns result
    if (result.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to access this result',
        });
    }

    res.json({
        success: true,
        data: result,
    });
});

/**
 * @desc    Get all results (admin only)
 * @route   GET /api/results
 * @access  Private/Admin
 */
exports.getAllResults = asyncHandler(async (req, res) => {
    const results = await Result.find()
        .populate('user', 'name email')
        .sort('-createdAt');

    res.json({
        success: true,
        count: results.length,
        data: results,
    });
});
