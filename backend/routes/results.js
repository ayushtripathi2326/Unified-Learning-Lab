const express = require('express');
const Result = require('../models/Result');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const results = await Result.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/leaderboard/:category', async (req, res) => {
  try {
    const results = await Result.find({ category: req.params.category })
      .populate('userId', 'name')
      .sort({ percentage: -1, timeTaken: 1 })
      .limit(10);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
