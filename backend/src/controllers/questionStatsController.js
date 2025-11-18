const Question = require('../../models/Question');

exports.getQuestionStats = async (req, res) => {
  try {
    const [
      totalQuestions,
      categoryStats,
      difficultyStats,
      recentQuestions,
      tagStats
    ] = await Promise.all([
      Question.countDocuments({ isActive: true }),
      Question.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Question.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$difficulty', count: { $sum: 1 } } }
      ]),
      Question.countDocuments({
        isActive: true,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      Question.aggregate([
        { $match: { isActive: true, tags: { $exists: true, $ne: [] } } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    // Convert arrays to objects for easier frontend consumption
    const categoryMap = {};
    categoryStats.forEach(stat => {
      categoryMap[stat._id] = stat.count;
    });

    const difficultyMap = {};
    difficultyStats.forEach(stat => {
      difficultyMap[stat._id] = stat.count;
    });

    const topTags = tagStats.map(tag => ({
      name: tag._id,
      count: tag.count
    }));

    res.json({
      total: totalQuestions,
      byCategory: categoryMap,
      byDifficulty: difficultyMap,
      recentlyAdded: recentQuestions,
      topTags,
      averageTimeLimit: await Question.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, avg: { $avg: '$timeLimit' } } }
      ]).then(result => result[0]?.avg || 60),
      averagePoints: await Question.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, avg: { $avg: '$points' } } }
      ]).then(result => result[0]?.avg || 1)
    });
  } catch (err) {
    console.error('Error fetching question stats:', err);
    res.status(500).json({ message: 'Failed to fetch question statistics' });
  }
};