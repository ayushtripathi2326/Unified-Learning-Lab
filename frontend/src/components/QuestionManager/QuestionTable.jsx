import React, { useState } from 'react';

const QuestionTable = ({ questions, loading, onEdit, onDelete }) => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedQuestions(questions.map(q => q._id));
    } else {
      setSelectedQuestions([]);
    }
  };

  const handleSelectQuestion = (questionId) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#757575';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Aptitude': '🧮',
      'Coding': '💻',
      'DBMS': '🗄️',
      'OS': '🖥️',
      'Networks': '🌐',
      'Quantitative': '📊',
      'Verbal': '📝',
      'Logical': '🧠',
      'GK': '🌍'
    };
    return icons[category] || '❓';
  };

  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="question-table-container">
      {/* Bulk Actions */}
      {selectedQuestions.length > 0 && (
        <div className="bulk-actions">
          <span className="selected-count">
            {selectedQuestions.length} question{selectedQuestions.length !== 1 ? 's' : ''} selected
          </span>
          <div className="bulk-buttons">
            <button
              className="btn btn-danger"
              onClick={() => {
                if (window.confirm(`Delete ${selectedQuestions.length} questions?`)) {
                  // Handle bulk delete
                  setSelectedQuestions([]);
                }
              }}
            >
              🗑️ Delete Selected
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedQuestions([])}
            >
              ❌ Clear Selection
            </button>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="questions-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input
                  type="checkbox"
                  checked={selectedQuestions.length === questions.length && questions.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Question</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Options</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  <div className="no-data-content">
                    <span className="no-data-icon">📝</span>
                    <h3>No questions found</h3>
                    <p>Try adjusting your filters or add some questions</p>
                  </div>
                </td>
              </tr>
            ) : (
              questions.map((question) => (
                <React.Fragment key={question._id}>
                  <tr className={selectedQuestions.includes(question._id) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedQuestions.includes(question._id)}
                        onChange={() => handleSelectQuestion(question._id)}
                      />
                    </td>
                    <td className="question-text-col">
                      <div className="question-preview">
                        <span className="question-text">
                          {truncateText(question.text || question.question)}
                        </span>
                        <button
                          className="expand-btn"
                          onClick={() => setExpandedQuestion(
                            expandedQuestion === question._id ? null : question._id
                          )}
                          title="View full question"
                        >
                          {expandedQuestion === question._id ? '🔼' : '🔽'}
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">
                        <span className="category-icon">
                          {getCategoryIcon(question.category)}
                        </span>
                        {question.category}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="difficulty-badge"
                        style={{ backgroundColor: getDifficultyColor(question.difficulty) }}
                      >
                        {question.difficulty || 'medium'}
                      </span>
                    </td>
                    <td className="options-col">
                      <span className="options-count">
                        {question.options?.length || 0} options
                      </span>
                      <span className="correct-answer">
                        ✓ Option {(question.correct || 0) + 1}
                      </span>
                    </td>
                    <td className="date-col">
                      {new Date(question.createdAt).toLocaleDateString()}
                    </td>
                    <td className="actions-col">
                      <div className="action-buttons">
                        <button
                          className="btn btn-edit"
                          onClick={() => onEdit(question)}
                          title="Edit question"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => onDelete(question._id, question.category)}
                          title="Delete question"
                        >
                          🗑️
                        </button>
                        <button
                          className="btn btn-duplicate"
                          onClick={() => {
                            const duplicated = { ...question, text: `${question.text} (Copy)` };
                            onEdit(duplicated);
                          }}
                          title="Duplicate question"
                        >
                          📋
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Question Details */}
                  {expandedQuestion === question._id && (
                    <tr className="expanded-row">
                      <td colSpan="7">
                        <div className="question-details">
                          <div className="detail-section">
                            <h4>📝 Full Question:</h4>
                            <p className="full-question-text">{question.text || question.question}</p>
                          </div>
                          
                          <div className="detail-section">
                            <h4>📋 Options:</h4>
                            <div className="options-list">
                              {question.options?.map((option, index) => (
                                <div 
                                  key={index} 
                                  className={`option-item ${index === question.correct ? 'correct' : ''}`}
                                >
                                  <span className="option-label">
                                    {String.fromCharCode(65 + index)}.
                                  </span>
                                  <span className="option-text">{option}</span>
                                  {index === question.correct && (
                                    <span className="correct-indicator">✅ Correct</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="detail-section">
                            <h4>ℹ️ Metadata:</h4>
                            <div className="metadata-grid">
                              <div className="metadata-item">
                                <strong>ID:</strong> {question._id}
                              </div>
                              <div className="metadata-item">
                                <strong>Created:</strong> {new Date(question.createdAt).toLocaleString()}
                              </div>
                              {question.updatedAt && (
                                <div className="metadata-item">
                                  <strong>Updated:</strong> {new Date(question.updatedAt).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination could be added here */}
      <div className="table-footer">
        <div className="results-info">
          Showing {questions.length} question{questions.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default QuestionTable;