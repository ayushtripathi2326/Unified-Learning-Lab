const Question = require('../../models/Question');

exports.bulkDeleteQuestions = async (req, res) => {
  try {
    const { questionIds } = req.body;
    
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ message: 'Invalid question IDs provided' });
    }

    // Validate that all IDs are valid MongoDB ObjectIds
    const mongoose = require('mongoose');
    const invalidIds = questionIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    
    if (invalidIds.length > 0) {
      return res.status(400).json({ 
        message: `Invalid question IDs: ${invalidIds.join(', ')}` 
      });
    }

    // Check how many questions exist before deletion
    const existingCount = await Question.countDocuments({
      _id: { $in: questionIds }
    });

    if (existingCount === 0) {
      return res.status(404).json({ 
        message: 'No questions found with the provided IDs' 
      });
    }

    // Perform soft delete by setting isActive to false (recommended)
    // or hard delete based on preference
    const usesSoftDelete = true;

    let result;
    if (usesSoftDelete) {
      // Soft delete - mark as inactive
      result = await Question.updateMany(
        { _id: { $in: questionIds } },
        { 
          isActive: false, 
          deletedAt: new Date(),
          lastModifiedBy: req.user?.id 
        }
      );
      
      res.json({
        success: true,
        deactivated: result.modifiedCount,
        message: `Successfully deactivated ${result.modifiedCount} questions`,
        type: 'soft_delete'
      });
    } else {
      // Hard delete - permanently remove
      result = await Question.deleteMany({
        _id: { $in: questionIds }
      });
      
      res.json({
        success: true,
        deleted: result.deletedCount,
        message: `Successfully deleted ${result.deletedCount} questions`,
        type: 'hard_delete'
      });
    }

    // Log the bulk delete operation
    console.log(`Bulk delete operation by user ${req.user?.id}: ${result.modifiedCount || result.deletedCount} questions affected`);

  } catch (err) {
    console.error('Error in bulk delete:', err);
    res.status(500).json({ 
      message: 'Failed to delete questions: ' + err.message 
    });
  }
};

// Additional method to restore soft-deleted questions
exports.restoreQuestions = async (req, res) => {
  try {
    const { questionIds } = req.body;
    
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ message: 'Invalid question IDs provided' });
    }

    const result = await Question.updateMany(
      { 
        _id: { $in: questionIds },
        isActive: false 
      },
      { 
        isActive: true,
        $unset: { deletedAt: 1 },
        lastModifiedBy: req.user?.id
      }
    );

    res.json({
      success: true,
      restored: result.modifiedCount,
      message: `Successfully restored ${result.modifiedCount} questions`
    });

  } catch (err) {
    console.error('Error restoring questions:', err);
    res.status(500).json({ 
      message: 'Failed to restore questions: ' + err.message 
    });
  }
};

// Method to permanently delete soft-deleted questions
exports.permanentlyDeleteQuestions = async (req, res) => {
  try {
    const { questionIds } = req.body;
    
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ message: 'Invalid question IDs provided' });
    }

    // Only allow permanent deletion of already soft-deleted questions
    const result = await Question.deleteMany({
      _id: { $in: questionIds },
      isActive: false
    });

    res.json({
      success: true,
      deleted: result.deletedCount,
      message: `Permanently deleted ${result.deletedCount} questions`
    });

  } catch (err) {
    console.error('Error permanently deleting questions:', err);
    res.status(500).json({ 
      message: 'Failed to permanently delete questions: ' + err.message 
    });
  }
};