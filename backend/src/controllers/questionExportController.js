const Question = require('../models/Question');

exports.exportQuestions = async (req, res) => {
  try {
    const {
      category,
      difficulty,
      search,
      dateRange,
      format = 'json',
      includeInactive = false
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (includeInactive === 'true') {
      delete filter.isActive;
    }
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    
    // Search in question text and options
    if (search) {
      filter.$or = [
        { text: { $regex: search, $options: 'i' } },
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
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }
      
      if (startDate) {
        filter.createdAt = { $gte: startDate };
      }
    }

    // Fetch questions
    const questions = await Question.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    if (questions.length === 0) {
      return res.status(404).json({ 
        message: 'No questions found matching the specified criteria' 
      });
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const categoryFilter = category ? `_${category}` : '';
    const difficultyFilter = difficulty ? `_${difficulty}` : '';
    
    if (format === 'csv') {
      // Export as CSV
      const csvHeader = [
        'ID',
        'Text',
        'Category', 
        'Difficulty',
        'Option 1',
        'Option 2', 
        'Option 3',
        'Option 4',
        'Correct Answer (0-3)',
        'Tags',
        'Explanation',
        'Time Limit (seconds)',
        'Points',
        'Active',
        'Created Date',
        'Updated Date'
      ].join(',') + '\n';
      
      const csvRows = questions.map(q => {
        const escapeCsv = (str) => {
          if (str === null || str === undefined) return '';
          const stringValue = String(str);
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        };
        
        return [
          escapeCsv(q._id),
          escapeCsv(q.text),
          escapeCsv(q.category),
          escapeCsv(q.difficulty),
          escapeCsv(q.options[0] || ''),
          escapeCsv(q.options[1] || ''),
          escapeCsv(q.options[2] || ''),
          escapeCsv(q.options[3] || ''),
          q.correct || 0,
          escapeCsv((q.tags || []).join('; ')),
          escapeCsv(q.explanation || ''),
          q.timeLimit || 60,
          q.points || 1,
          q.isActive !== false ? 'Yes' : 'No',
          escapeCsv(q.createdAt ? new Date(q.createdAt).toISOString() : ''),
          escapeCsv(q.updatedAt ? new Date(q.updatedAt).toISOString() : '')
        ].join(',');
      }).join('\n');

      const csvContent = csvHeader + csvRows;
      const filename = `questions_export${categoryFilter}${difficultyFilter}_${timestamp}.csv`;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', Buffer.byteLength(csvContent, 'utf8'));
      
      return res.send(csvContent);
      
    } else if (format === 'xlsx') {
      // Export as Excel (requires xlsx package)
      try {
        const XLSX = require('xlsx');
        
        const worksheetData = questions.map(q => ({
          'ID': q._id.toString(),
          'Text': q.text,
          'Category': q.category,
          'Difficulty': q.difficulty,
          'Option 1': q.options[0] || '',
          'Option 2': q.options[1] || '',
          'Option 3': q.options[2] || '',
          'Option 4': q.options[3] || '',
          'Correct Answer': q.correct || 0,
          'Tags': (q.tags || []).join('; '),
          'Explanation': q.explanation || '',
          'Time Limit': q.timeLimit || 60,
          'Points': q.points || 1,
          'Active': q.isActive !== false ? 'Yes' : 'No',
          'Created Date': q.createdAt ? new Date(q.createdAt).toISOString() : '',
          'Updated Date': q.updatedAt ? new Date(q.updatedAt).toISOString() : ''
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');

        const filename = `questions_export${categoryFilter}${difficultyFilter}_${timestamp}.xlsx`;
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', buffer.length);
        
        return res.send(buffer);
        
      } catch (xlsxError) {
        console.warn('XLSX export failed, falling back to JSON:', xlsxError.message);
        // Fall through to JSON export
      }
    }

    // Default: Export as JSON
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalQuestions: questions.length,
        filters: {
          category: category || 'all',
          difficulty: difficulty || 'all',
          search: search || null,
          dateRange: dateRange || 'all',
          includeInactive: includeInactive === 'true'
        }
      },
      questions: questions.map(q => ({
        text: q.text,
        category: q.category,
        difficulty: q.difficulty,
        options: q.options,
        correct: q.correct,
        tags: q.tags || [],
        explanation: q.explanation || '',
        timeLimit: q.timeLimit || 60,
        points: q.points || 1,
        // Include metadata for re-import
        _metadata: {
          id: q._id,
          isActive: q.isActive,
          createdAt: q.createdAt,
          updatedAt: q.updatedAt
        }
      }))
    };

    const filename = `questions_export${categoryFilter}${difficultyFilter}_${timestamp}.json`;
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.json(exportData);

  } catch (err) {
    console.error('Error exporting questions:', err);
    res.status(500).json({ 
      message: 'Failed to export questions: ' + err.message 
    });
  }
};

// Export questions in template format for easy editing
exports.exportTemplate = async (req, res) => {
  try {
    const { category = 'Aptitude' } = req.query;
    
    const template = [
      {
        text: "Sample question text here?",
        category: category,
        difficulty: "medium",
        options: [
          "Option A - First choice",
          "Option B - Second choice", 
          "Option C - Third choice",
          "Option D - Fourth choice"
        ],
        correct: 0,
        tags: ["sample", "template"],
        explanation: "Explanation of why this answer is correct",
        timeLimit: 60,
        points: 1
      },
      {
        text: "Another sample question?",
        category: category,
        difficulty: "easy",
        options: [
          "First option",
          "Second option",
          "Third option", 
          "Fourth option"
        ],
        correct: 1,
        tags: ["example"],
        explanation: "Brief explanation here",
        timeLimit: 45,
        points: 1
      }
    ];

    const filename = `question_template_${category.toLowerCase()}.json`;
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.json(template);

  } catch (err) {
    console.error('Error generating template:', err);
    res.status(500).json({ 
      message: 'Failed to generate template: ' + err.message 
    });
  }
};