import React, { useState, useEffect } from 'react';

const QuestionForm = ({ question, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    text: '',
    category: 'Aptitude',
    difficulty: 'medium',
    options: ['', '', '', ''],
    correct: 0,
    tags: [],
    explanation: '',
    timeLimit: 60,
    points: 1
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState('');

  const categoryOptions = [
    'Aptitude', 'Coding', 'OS', 'DBMS', 'Networks', 
    'Quantitative', 'Verbal', 'Logical', 'GK'
  ];

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', color: '#4CAF50' },
    { value: 'medium', label: 'Medium', color: '#FF9800' },
    { value: 'hard', label: 'Hard', color: '#F44336' }
  ];

  useEffect(() => {
    if (question) {
      setFormData({
        text: question.text || question.question || '',
        category: question.category || 'Aptitude',
        difficulty: question.difficulty || 'medium',
        options: question.options || ['', '', '', ''],
        correct: question.correct || 0,
        tags: question.tags || [],
        explanation: question.explanation || '',
        timeLimit: question.timeLimit || 60,
        points: question.points || 1
      });
    }
  }, [question]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.text.trim()) {
      newErrors.text = 'Question text is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    formData.options.forEach((option, index) => {
      if (!option.trim()) {
        newErrors[`option${index}`] = `Option ${index + 1} is required`;
      }
    });

    if (formData.correct < 0 || formData.correct > 3) {
      newErrors.correct = 'Correct answer must be between 0 and 3';
    }

    if (formData.timeLimit < 10 || formData.timeLimit > 300) {
      newErrors.timeLimit = 'Time limit must be between 10 and 300 seconds';
    }

    if (formData.points < 0.5 || formData.points > 10) {
      newErrors.points = 'Points must be between 0.5 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);
    try {
      const result = await onSave(question?._id, formData);
      if (result.success) {
        onClose();
      } else {
        setErrors({ submit: result.error });
      }
    } catch (err) {
      setErrors({ submit: 'Failed to save question' });
    } finally {
      setSaving(false);
    }
  };

  const previewQuestion = () => {
    return (
      <div className="question-preview">
        <h4>📋 Preview</h4>
        <div className="preview-content">
          <div className="preview-question">
            <strong>Q:</strong> {formData.text || 'Enter question text...'}
          </div>
          <div className="preview-options">
            {formData.options.map((option, index) => (
              <div 
                key={index} 
                className={`preview-option ${index === formData.correct ? 'correct' : ''}`}
              >
                <span className="option-label">{String.fromCharCode(65 + index)}.</span>
                <span className="option-text">{option || `Option ${index + 1}...`}</span>
                {index === formData.correct && <span className="correct-mark">✅</span>}
              </div>
            ))}
          </div>
          <div className="preview-meta">
            <span className="meta-item">📂 {formData.category}</span>
            <span className="meta-item">⚡ {formData.difficulty}</span>
            <span className="meta-item">⏱️ {formData.timeLimit}s</span>
            <span className="meta-item">🎯 {formData.points} pts</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large question-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{question ? '✏️ Edit Question' : '➕ Add New Question'}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="question-form">
            <div className="form-layout">
              {/* Left Column - Form Fields */}
              <div className="form-column">
                {/* Question Text */}
                <div className="form-group">
                  <label htmlFor="questionText">
                    📝 Question Text <span className="required">*</span>
                  </label>
                  <textarea
                    id="questionText"
                    rows="4"
                    value={formData.text}
                    onChange={(e) => handleInputChange('text', e.target.value)}
                    placeholder="Enter your question here..."
                    className={errors.text ? 'error' : ''}
                  />
                  {errors.text && <span className="error-text">{errors.text}</span>}
                </div>

                {/* Category and Difficulty */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category">
                      🏷️ Category <span className="required">*</span>
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className={errors.category ? 'error' : ''}
                    >
                      {categoryOptions.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && <span className="error-text">{errors.category}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="difficulty">⚡ Difficulty</label>
                    <select
                      id="difficulty"
                      value={formData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    >
                      {difficultyOptions.map(diff => (
                        <option key={diff.value} value={diff.value}>
                          {diff.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Options */}
                <div className="form-group">
                  <label>📋 Answer Options <span className="required">*</span></label>
                  <div className="options-container">
                    {formData.options.map((option, index) => (
                      <div key={index} className="option-input-group">
                        <span className="option-label">{String.fromCharCode(65 + index)}.</span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}...`}
                          className={errors[`option${index}`] ? 'error' : ''}
                        />
                        <input
                          type="radio"
                          name="correct"
                          checked={formData.correct === index}
                          onChange={() => handleInputChange('correct', index)}
                          title="Mark as correct answer"
                        />
                        {errors[`option${index}`] && (
                          <span className="error-text">{errors[`option${index}`]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.correct && <span className="error-text">{errors.correct}</span>}
                </div>

                {/* Advanced Settings */}
                <div className="form-group">
                  <label className="section-label">⚙️ Advanced Settings</label>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="timeLimit">⏱️ Time Limit (seconds)</label>
                      <input
                        type="number"
                        id="timeLimit"
                        min="10"
                        max="300"
                        value={formData.timeLimit}
                        onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value))}
                        className={errors.timeLimit ? 'error' : ''}
                      />
                      {errors.timeLimit && <span className="error-text">{errors.timeLimit}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="points">🎯 Points</label>
                      <input
                        type="number"
                        id="points"
                        min="0.5"
                        max="10"
                        step="0.5"
                        value={formData.points}
                        onChange={(e) => handleInputChange('points', parseFloat(e.target.value))}
                        className={errors.points ? 'error' : ''}
                      />
                      {errors.points && <span className="error-text">{errors.points}</span>}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="form-group">
                  <label>🏷️ Tags</label>
                  <div className="tags-input">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button type="button" onClick={addTag} className="add-tag-btn">
                      ➕
                    </button>
                  </div>
                  <div className="tags-list">
                    {formData.tags.map(tag => (
                      <span key={tag} className="tag">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}>✕</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div className="form-group">
                  <label htmlFor="explanation">💡 Explanation (Optional)</label>
                  <textarea
                    id="explanation"
                    rows="3"
                    value={formData.explanation}
                    onChange={(e) => handleInputChange('explanation', e.target.value)}
                    placeholder="Explain why this is the correct answer..."
                  />
                </div>
              </div>

              {/* Right Column - Preview */}
              <div className="preview-column">
                {previewQuestion()}
              </div>
            </div>

            {errors.submit && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {errors.submit}
              </div>
            )}

            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? '⏳ Saving...' : (question ? '💾 Update Question' : '➕ Create Question')}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={saving}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;