const Question = require('../../models/Question');

exports.getCategories = async (req, res) => {
  try {
    // Get all unique categories from questions
    const categories = await Question.distinct('category', { isActive: true });
    
    // Get question counts for each category
    const categoryStats = await Question.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Create category objects with metadata
    const categoryData = categories.map(category => {
      const stats = categoryStats.find(stat => stat._id === category);
      return {
        name: category,
        questionCount: stats ? stats.count : 0,
        icon: getCategoryIcon(category),
        description: getCategoryDescription(category),
        color: getCategoryColor(category)
      };
    });

    // Sort by question count (descending)
    categoryData.sort((a, b) => b.questionCount - a.questionCount);

    res.json(categoryData);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

// Helper function to get category icon
function getCategoryIcon(category) {
  const icons = {
    'Aptitude': '🧮',
    'Coding': '💻',
    'OS': '🖥️',
    'DBMS': '🗄️',
    'Networks': '🌐',
    'Quantitative': '📊',
    'Verbal': '📝',
    'Logical': '🧠',
    'GK': '🌍'
  };
  return icons[category] || '❓';
}

// Helper function to get category description
function getCategoryDescription(category) {
  const descriptions = {
    'Aptitude': 'Numerical reasoning and problem-solving skills',
    'Coding': 'Programming concepts, algorithms, and data structures',
    'OS': 'Operating system concepts and principles',
    'DBMS': 'Database management systems and SQL',
    'Networks': 'Computer networks, protocols, and communication',
    'Quantitative': 'Mathematical and statistical problem solving',
    'Verbal': 'English language, grammar, and communication skills',
    'Logical': 'Logical reasoning and pattern recognition',
    'GK': 'General knowledge and current affairs'
  };
  return descriptions[category] || 'General questions in this category';
}

// Helper function to get category color
function getCategoryColor(category) {
  const colors = {
    'Aptitude': '#007bff',
    'Coding': '#28a745',
    'OS': '#6f42c1',
    'DBMS': '#fd7e14',
    'Networks': '#20c997',
    'Quantitative': '#e83e8c',
    'Verbal': '#6610f2',
    'Logical': '#dc3545',
    'GK': '#ffc107'
  };
  return colors[category] || '#6c757d';
}

// Get category statistics with detailed breakdown
exports.getCategoryStats = async (req, res) => {
  try {
    const stats = await Question.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: {
            category: '$category',
            difficulty: '$difficulty'
          },
          count: { $sum: 1 },
          avgTimeLimit: { $avg: '$timeLimit' },
          avgPoints: { $avg: '$points' },
          totalTags: { $sum: { $size: { $ifNull: ['$tags', []] } } }
        }
      },
      {
        $group: {
          _id: '$_id.category',
          totalQuestions: { $sum: '$count' },
          difficulties: {
            $push: {
              difficulty: '$_id.difficulty',
              count: '$count',
              avgTimeLimit: '$avgTimeLimit',
              avgPoints: '$avgPoints'
            }
          },
          avgTimeLimit: { $avg: '$avgTimeLimit' },
          avgPoints: { $avg: '$avgPoints' },
          totalTags: { $sum: '$totalTags' }
        }
      },
      { $sort: { totalQuestions: -1 } }
    ]);

    const enrichedStats = stats.map(stat => ({
      category: stat._id,
      totalQuestions: stat.totalQuestions,
      difficulties: stat.difficulties,
      avgTimeLimit: Math.round(stat.avgTimeLimit),
      avgPoints: Math.round(stat.avgPoints * 10) / 10,
      totalTags: stat.totalTags,
      icon: getCategoryIcon(stat._id),
      description: getCategoryDescription(stat._id),
      color: getCategoryColor(stat._id)
    }));

    res.json(enrichedStats);
  } catch (err) {
    console.error('Error fetching category stats:', err);
    res.status(500).json({ message: 'Failed to fetch category statistics' });
  }
};

// Get questions by category with pagination
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      difficulty, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    const filter = { 
      category: category, 
      isActive: true 
    };
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [questions, total] = await Promise.all([
      Question.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v')
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
      },
      category: {
        name: category,
        icon: getCategoryIcon(category),
        description: getCategoryDescription(category),
        color: getCategoryColor(category)
      }
    });
  } catch (err) {
    console.error('Error fetching questions by category:', err);
    res.status(500).json({ message: 'Failed to fetch questions for category' });
  }
};