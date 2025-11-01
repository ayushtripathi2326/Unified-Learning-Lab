const express = require('express');
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getStats,
    getAllQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getAllResults
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.get('/stats', getStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Question management
router.get('/questions', getAllQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

// Results
router.get('/results', getAllResults);

module.exports = router;
