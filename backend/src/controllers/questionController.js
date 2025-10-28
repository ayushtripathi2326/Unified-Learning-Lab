const asyncHandler = require('../utils/asyncHandler');
const Question = require('../../models/Question'); // Using old models location

/**
 * @desc    Get all questions
 * @route   GET /api/questions
 * @access  Public
 */
exports.getQuestions = asyncHandler(async (req, res) => {
    const { topic, difficulty } = req.query;

    let filter = {};
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter);

    res.json({
        success: true,
        count: questions.length,
        data: questions,
    });
});

/**
 * @desc    Get single question
 * @route   GET /api/questions/:id
 * @access  Public
 */
exports.getQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);

    if (!question) {
        return res.status(404).json({
            success: false,
            message: 'Question not found',
        });
    }

    res.json({
        success: true,
        data: question,
    });
});

/**
 * @desc    Create question
 * @route   POST /api/questions
 * @access  Private/Admin
 */
exports.createQuestion = asyncHandler(async (req, res) => {
    const question = await Question.create(req.body);

    res.status(201).json({
        success: true,
        data: question,
    });
});

/**
 * @desc    Update question
 * @route   PUT /api/questions/:id
 * @access  Private/Admin
 */
exports.updateQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!question) {
        return res.status(404).json({
            success: false,
            message: 'Question not found',
        });
    }

    res.json({
        success: true,
        data: question,
    });
});

/**
 * @desc    Delete question
 * @route   DELETE /api/questions/:id
 * @access  Private/Admin
 */
exports.deleteQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
        return res.status(404).json({
            success: false,
            message: 'Question not found',
        });
    }

    res.json({
        success: true,
        data: {},
    });
});
