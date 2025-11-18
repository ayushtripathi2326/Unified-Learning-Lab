const Question = require('../models/Question');

exports.bulkImportQuestions = async (req, res) => {
  try {
    const { questions } = req.body;
    
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Invalid questions data' });
    }

    const results = {
      imported: 0,
      failed: 0,
      errors: [],
      duplicates: 0
    };

    const validCategories = ['Aptitude', 'Coding', 'OS', 'DBMS', 'Networks', 'Quantitative', 'Verbal', 'Logical', 'GK'];
    const validDifficulties = ['easy', 'medium', 'hard'];

    // Process questions in batches for better performance
    const batchSize = 10;
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (questionData, batchIndex) => {
        const questionIndex = i + batchIndex + 1;
        
        try {
          // Validate required fields
          if (!questionData.text && !questionData.question) {
            throw new Error('Question text is required');
          }
          
          if (!questionData.category) {
            throw new Error('Category is required');
          }
          
          if (!validCategories.includes(questionData.category)) {
            throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
          }
          
          if (!questionData.options || !Array.isArray(questionData.options) || questionData.options.length !== 4) {
            throw new Error('Must have exactly 4 options');
          }
          
          if (questionData.correct === undefined || questionData.correct < 0 || questionData.correct > 3) {
            throw new Error('Correct answer must be 0, 1, 2, or 3');
          }

          if (questionData.difficulty && !validDifficulties.includes(questionData.difficulty)) {
            throw new Error(`Invalid difficulty. Must be one of: ${validDifficulties.join(', ')}`);
          }

          // Check for duplicates
          const existingQuestion = await Question.findOne({
            text: questionData.text || questionData.question,
            category: questionData.category
          });

          if (existingQuestion) {
            results.duplicates++;
            results.errors.push(`Question ${questionIndex}: Duplicate question found`);
            return;
          }

          // Normalize and validate question data
          const normalizedQuestion = {
            text: (questionData.text || questionData.question).trim(),
            category: questionData.category,
            difficulty: questionData.difficulty || 'medium',
            options: questionData.options.map(opt => opt.trim()),
            correct: parseInt(questionData.correct),
            tags: Array.isArray(questionData.tags) ? questionData.tags.filter(tag => tag.trim()) : [],
            explanation: (questionData.explanation || '').trim(),
            timeLimit: questionData.timeLimit ? Math.max(10, Math.min(300, parseInt(questionData.timeLimit))) : 60,
            points: questionData.points ? Math.max(0.5, Math.min(10, parseFloat(questionData.points))) : 1,
            isActive: true,
            createdBy: req.user?.id
          };

          // Validate options are not empty
          if (normalizedQuestion.options.some(opt => !opt)) {
            throw new Error('All options must be non-empty');
          }

          // Create question
          const question = new Question(normalizedQuestion);
          await question.save();
          
          results.imported++;
        } catch (error) {
          results.failed++;
          results.errors.push(`Question ${questionIndex}: ${error.message}`);
        }
      }));
    }

    // Limit error messages to prevent overwhelming response
    if (results.errors.length > 50) {
      const remainingErrors = results.errors.length - 50;
      results.errors = results.errors.slice(0, 50);
      results.errors.push(`... and ${remainingErrors} more errors`);
    }

    res.json({
      ...results,
      message: `Import completed: ${results.imported} imported, ${results.failed} failed, ${results.duplicates} duplicates`
    });
  } catch (err) {
    console.error('Bulk import error:', err);
    res.status(500).json({ message: 'Bulk import failed: ' + err.message });
  }
};