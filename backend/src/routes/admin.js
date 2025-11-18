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

// Enhanced Question management
router.get('/questions', getAllQuestions);
router.get('/questions/stats', require('../controllers/questionStatsController').getQuestionStats);
router.get('/questions/export', require('../controllers/questionExportController').exportQuestions);
router.get('/questions/template', require('../controllers/questionExportController').exportTemplate);
router.post('/questions', createQuestion);
router.post('/questions/bulk-import', require('../controllers/bulkImportController').bulkImportQuestions);
router.post('/questions/bulk-delete', require('../controllers/bulkDeleteController').bulkDeleteQuestions);
router.post('/questions/restore', require('../controllers/bulkDeleteController').restoreQuestions);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

// Category management
router.get('/categories', require('../controllers/categoryController').getCategories);
router.get('/categories/stats', require('../controllers/categoryController').getCategoryStats);
router.get('/categories/:category/questions', require('../controllers/categoryController').getQuestionsByCategory);

// Results
router.get('/results', getAllResults);

module.exports = router;
