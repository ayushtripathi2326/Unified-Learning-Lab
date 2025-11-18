const express = require('express');
const Question = require('../models/Question');
const router = express.Router();

// Enhanced question fetching with filters and pagination
router.get('/questions', async (req, res) => {
  try {
    const {
      category,
      difficulty,
      search,
      dateRange,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    
    // Search in question text and options
    if (search) {
      filter.$or = [
        { text: { $regex: search, $options: 'i' } },
        { question: { $regex: search, $options: 'i' } },
        { options: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }
    
    // Date range filter
    if (dateRange) {
      const now = new Date();
      let startDate;
      
      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }
      
      if (startDate) {
        filter.createdAt = { $gte: startDate };
      }
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [questions, total] = await Promise.all([
      Question.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Question.countDocuments(filter)
    ]);

    res.json({
      questions,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
});

// Get question statistics
router.get('/questions/stats', async (req, res) => {
  try {
    const [
      totalQuestions,
      categoryStats,
      difficultyStats,
      recentQuestions
    ] = await Promise.all([
      Question.countDocuments(),
      Question.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      Question.aggregate([
        { $group: { _id: '$difficulty', count: { $sum: 1 } } }
      ]),
      Question.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);

    const categoryMap = {};
    categoryStats.forEach(stat => {
      categoryMap[stat._id] = stat.count;
    });

    const difficultyMap = {};
    difficultyStats.forEach(stat => {
      difficultyMap[stat._id] = stat.count;
    });

    res.json({
      total: totalQuestions,
      byCategory: categoryMap,
      byDifficulty: difficultyMap,
      recentlyAdded: recentQuestions
    });
  } catch (err) {
    console.error('Error fetching question stats:', err);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

// Enhanced bulk import with validation
router.post('/questions/bulk-import', async (req, res) => {
  try {
    const { questions } = req.body;
    
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Invalid questions data' });
    }

    const results = {
      imported: 0,
      failed: 0,
      errors: []
    };

    // Validate and import questions one by one
    for (let i = 0; i < questions.length; i++) {
      const questionData = questions[i];
      
      try {
        // Validate required fields
        if (!questionData.text && !questionData.question) {
          throw new Error('Question text is required');
        }
        
        if (!questionData.category) {
          throw new Error('Category is required');
        }
        
        if (!questionData.options || !Array.isArray(questionData.options) || questionData.options.length !== 4) {
          throw new Error('Must have exactly 4 options');
        }
        
        if (questionData.correct === undefined || questionData.correct < 0 || questionData.correct > 3) {
          throw new Error('Correct answer must be 0, 1, 2, or 3');
        }

        // Normalize question data
        const normalizedQuestion = {
          text: questionData.text || questionData.question,
          category: questionData.category,
          difficulty: questionData.difficulty || 'medium',
          options: questionData.options,
          correct: questionData.correct,
          tags: questionData.tags || [],
          explanation: questionData.explanation || '',
          timeLimit: questionData.timeLimit || 60,
          points: questionData.points || 1
        };

        // Create question
        const question = new Question(normalizedQuestion);
        await question.save();
        
        results.imported++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Question ${i + 1}: ${error.message}`);
      }
    }

    res.json(results);
  } catch (err) {
    console.error('Bulk import error:', err);
    res.status(500).json({ message: 'Bulk import failed' });
  }
});

// Enhanced question creation
router.post('/questions', async (req, res) => {
  try {
    const questionData = {
      text: req.body.text,
      category: req.body.category,
      difficulty: req.body.difficulty || 'medium',
      options: req.body.options,
      correct: req.body.correct,
      tags: req.body.tags || [],
      explanation: req.body.explanation || '',
      timeLimit: req.body.timeLimit || 60,
      points: req.body.points || 1
    };

    const question = new Question(questionData);
    await question.save();
    
    res.status(201).json(question);
  } catch (err) {
    console.error('Error creating question:', err);
    res.status(400).json({ message: err.message });
  }
});

// Enhanced question update
router.put('/questions/:id', async (req, res) => {
  try {
    const updateData = {
      text: req.body.text,
      category: req.body.category,
      difficulty: req.body.difficulty,
      options: req.body.options,
      correct: req.body.correct,
      tags: req.body.tags || [],
      explanation: req.body.explanation || '',
      timeLimit: req.body.timeLimit || 60,
      points: req.body.points || 1
    };

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (err) {
    console.error('Error updating question:', err);
    res.status(400).json({ message: err.message });
  }
});

// Bulk delete questions
router.post('/questions/bulk-delete', async (req, res) => {
  try {
    const { questionIds } = req.body;
    
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ message: 'Invalid question IDs' });
    }

    const result = await Question.deleteMany({
      _id: { $in: questionIds }
    });

    res.json({
      deleted: result.deletedCount,
      message: `Successfully deleted ${result.deletedCount} questions`
    });
  } catch (err) {
    console.error('Error deleting questions:', err);
    res.status(500).json({ message: 'Failed to delete questions' });
  }
});

// Export questions
router.get('/questions/export', async (req, res) => {
  try {
    const {
      category,
      difficulty,
      search,
      dateRange,
      format = 'json'
    } = req.query;

    // Build filter (same as in GET /questions)
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    
    if (search) {
      filter.$or = [
        { text: { $regex: search, $options: 'i' } },
        { question: { $regex: search, $options: 'i' } },
        { options: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }
    
    if (dateRange) {
      const now = new Date();
      let startDate;
      
      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }
      
      if (startDate) {
        filter.createdAt = { $gte: startDate };
      }
    }

    const questions = await Question.find(filter).lean();

    if (format === 'csv') {
      // Convert to CSV
      const csvHeader = 'text,category,difficulty,option1,option2,option3,option4,correct,tags,explanation\n';
      const csvRows = questions.map(q => {
        const escapeCsv = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
        return [
          escapeCsv(q.text || q.question),
          escapeCsv(q.category),
          escapeCsv(q.difficulty),
          escapeCsv(q.options[0] || ''),
          escapeCsv(q.options[1] || ''),
          escapeCsv(q.options[2] || ''),
          escapeCsv(q.options[3] || ''),
          q.correct || 0,
          escapeCsv((q.tags || []).join(';')),
          escapeCsv(q.explanation || '')
        ].join(',');
      }).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=questions.csv');
      res.send(csvHeader + csvRows);
    } else {
      // Return JSON
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=questions.json');
      res.json(questions);
    }
  } catch (err) {
    console.error('Error exporting questions:', err);
    res.status(500).json({ message: 'Failed to export questions' });
  }
});

// Get available categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Question.distinct('category');
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

module.exports = router;