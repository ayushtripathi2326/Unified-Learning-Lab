const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true, 
    enum: ['Aptitude', 'Coding', 'OS', 'DBMS', 'Networks', 'Quantitative', 'Verbal', 'Logical', 'GK'] 
  },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct: { type: Number, required: true, min: 0, max: 3 },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  tags: [{ type: String, trim: true }],
  explanation: { type: String, default: '' },
  timeLimit: { type: Number, default: 60, min: 10, max: 300 },
  points: { type: Number, default: 1, min: 0.5, max: 10 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Add indexes for better query performance
QuestionSchema.index({ category: 1, difficulty: 1 });
QuestionSchema.index({ tags: 1 });
QuestionSchema.index({ createdAt: -1 });
QuestionSchema.index({ text: 'text', options: 'text' }); // Text search index

// Add virtual for question age
QuestionSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Add method to check if question is recent
QuestionSchema.methods.isRecent = function() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return this.createdAt > weekAgo;
};

// Add static method for advanced search
QuestionSchema.statics.advancedSearch = function(filters) {
  const query = this.find();
  
  if (filters.category) query.where('category', filters.category);
  if (filters.difficulty) query.where('difficulty', filters.difficulty);
  if (filters.tags && filters.tags.length > 0) query.where('tags').in(filters.tags);
  if (filters.search) {
    query.where({
      $or: [
        { text: { $regex: filters.search, $options: 'i' } },
        { options: { $elemMatch: { $regex: filters.search, $options: 'i' } } }
      ]
    });
  }
  
  return query;
};

module.exports = mongoose.model('Question', QuestionSchema);
