const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  category: { type: String, required: true, enum: ['Aptitude', 'Coding', 'OS', 'DBMS', 'Networks', 'Quantitative', 'Verbal', 'Logical', 'GK'] },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct: { type: Number, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
