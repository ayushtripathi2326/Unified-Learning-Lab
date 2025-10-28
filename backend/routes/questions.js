const express = require('express');
const Question = require('../models/Question');
const router = express.Router();

router.get('/:category', async (req, res) => {
  try {
    const questions = await Question.find({ category: req.params.category }).select('-correct');
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/submit', async (req, res) => {
  try {
    const { category, answers } = req.body;
    const questions = await Question.find({ category });
    let score = 0;
    questions.forEach(q => {
      if (answers[q._id.toString()] === q.correct) score++;
    });
    res.json({ score, total: questions.length, percentage: ((score / questions.length) * 100).toFixed(2) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
