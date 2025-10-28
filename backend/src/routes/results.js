const express = require('express');
const {
    submitResult,
    getUserResults,
    getResult,
    getAllResults,
} = require('../controllers/resultController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getAllResults)
    .post(protect, submitResult);

router.get('/user', protect, getUserResults);
router.get('/:id', protect, getResult);

module.exports = router;
