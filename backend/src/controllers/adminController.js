const asyncHandler = require('../utils/asyncHandler');
const User = require('../../models/User');
const Question = require('../../models/Question');
const Result = require('../../models/Result');

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
        .select('-password -refreshToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await User.countDocuments();

    res.json({
        success: true,
        data: users,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

/**
 * @desc    Get user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
exports.getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password -refreshToken');

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    res.json({
        success: true,
        data: user
    });
});

/**
 * @desc    Update user
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
exports.updateUser = asyncHandler(async (req, res) => {
    const { name, email, role, isActive, permissions } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isActive !== 'undefined') user.isActive = isActive;
    if (permissions) user.permissions = permissions;

    await user.save();

    res.json({
        success: true,
        data: user
    });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    // Don't allow deleting yourself
    if (user._id.toString() === req.user.id) {
        return res.status(400).json({
            success: false,
            message: 'You cannot delete your own account'
        });
    }

    await user.deleteOne();

    res.json({
        success: true,
        message: 'User deleted successfully'
    });
});

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
exports.getStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalQuestions = await Question.countDocuments();
    const totalResults = await Result.countDocuments();

    // Get user registrations by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const usersByMonth = await User.aggregate([
        {
            $match: {
                createdAt: { $gte: sixMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 }
        }
    ]);

    // Get users by role
    const usersByRole = await User.aggregate([
        {
            $group: {
                _id: '$role',
                count: { $sum: 1 }
            }
        }
    ]);

    // Recent users
    const recentUsers = await User.find()
        .select('name email role createdAt')
        .sort({ createdAt: -1 })
        .limit(5);

    res.json({
        success: true,
        data: {
            overview: {
                totalUsers,
                activeUsers,
                totalQuestions,
                totalResults
            },
            usersByMonth,
            usersByRole,
            recentUsers
        }
    });
});

/**
 * @desc    Get all questions
 * @route   GET /api/admin/questions
 * @access  Private/Admin
 */
exports.getAllQuestions = asyncHandler(async (req, res) => {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const questions = await Question.find(filter).sort({ createdAt: -1 });

    res.json({
        success: true,
        data: questions
    });
});

/**
 * @desc    Create question
 * @route   POST /api/admin/questions
 * @access  Private/Admin
 */
exports.createQuestion = asyncHandler(async (req, res) => {
    const question = await Question.create(req.body);

    res.status(201).json({
        success: true,
        data: question
    });
});

/**
 * @desc    Update question
 * @route   PUT /api/admin/questions/:id
 * @access  Private/Admin
 */
exports.updateQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!question) {
        return res.status(404).json({
            success: false,
            message: 'Question not found'
        });
    }

    res.json({
        success: true,
        data: question
    });
});

/**
 * @desc    Delete question
 * @route   DELETE /api/admin/questions/:id
 * @access  Private/Admin
 */
exports.deleteQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);

    if (!question) {
        return res.status(404).json({
            success: false,
            message: 'Question not found'
        });
    }

    await question.deleteOne();

    res.json({
        success: true,
        message: 'Question deleted successfully'
    });
});

/**
 * @desc    Get all results
 * @route   GET /api/admin/results
 * @access  Private/Admin
 */
exports.getAllResults = asyncHandler(async (req, res) => {
    const results = await Result.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(100);

    res.json({
        success: true,
        data: results
    });
});
