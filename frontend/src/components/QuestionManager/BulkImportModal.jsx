import React, { useState } from 'react';

const BulkImportModal = ({ categories, onImport, onClose }) => {
  const [importMethod, setImportMethod] = useState('paste');
  const [jsonData, setJsonData] = useState('');
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [previewData, setPreviewData] = useState(null);

  const categoryOptions = [
    'Aptitude', 'Coding', 'OS', 'DBMS', 'Networks', 
    'Quantitative', 'Verbal', 'Logical', 'GK'
  ];

  const validateQuestions = (questions) => {
    const errors = [];
    
    if (!Array.isArray(questions)) {
      errors.push('Data must be an array of questions');
      return errors;
    }

    questions.forEach((q, index) => {
      const questionNum = index + 1;
      
      if (!q.text && !q.question) {
        errors.push(`Question ${questionNum}: Missing question text`);
      }
      
      if (!q.category) {
        errors.push(`Question ${questionNum}: Missing category`);
      } else if (!categoryOptions.includes(q.category)) {
        errors.push(`Question ${questionNum}: Invalid category "${q.category}"`);
      }
      
      if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) {
        errors.push(`Question ${questionNum}: Must have exactly 4 options`);
      }
      
      if (q.correct === undefined || q.correct < 0 || q.correct > 3) {
        errors.push(`Question ${questionNum}: Correct answer must be 0, 1, 2, or 3`);
      }
      
      if (q.difficulty && !['easy', 'medium', 'hard'].includes(q.difficulty)) {
        errors.push(`Question ${questionNum}: Invalid difficulty "${q.difficulty}"`);
      }
    });

    return errors;
  };

  const handleJsonValidation = () => {
    try {
      const parsed = JSON.parse(jsonData);
      const errors = validateQuestions(parsed);
      
      setValidationErrors(errors);
      
      if (errors.length === 0) {
        setPreviewData(parsed.slice(0, 3)); // Show first 3 questions as preview
      } else {
        setPreviewData(null);
      }
    } catch (err) {
      setValidationErrors(['Invalid JSON format: ' + err.message]);
      setPreviewData(null);
    }
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      
      try {
        if (uploadedFile.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          setJsonData(JSON.stringify(parsed, null, 2));
        } else if (uploadedFile.name.endsWith('.csv')) {
          const csvData = parseCSV(text);
          setJsonData(JSON.stringify(csvData, null, 2));
        }
      } catch (err) {
        setValidationErrors(['Error reading file: ' + err.message]);
      }
    };
    
    reader.readAsText(uploadedFile);
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const questions = [];
    
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts = line.match(/(\".*?\"|[^\",]+)(?=\s*,|\s*$)/g);
      if (!parts || parts.length < 7) continue;
      
      questions.push({
        text: parts[0].replace(/^\"|\"$/g, '').trim(),
        category: parts[1].replace(/^\"|\"$/g, '').trim(),
        difficulty: parts[2].replace(/^\"|\"$/g, '').trim() || 'medium',
        options: [
          parts[3].replace(/^\"|\"$/g, '').trim(),
          parts[4].replace(/^\"|\"$/g, '').trim(),
          parts[5].replace(/^\"|\"$/g, '').trim(),
          parts[6].replace(/^\"|\"$/g, '').trim()
        ],
        correct: parseInt(parts[7]) || 0
      });
    }
    
    return questions;
  };

  const handleImport = async () => {
    if (validationErrors.length > 0) {
      alert('Please fix validation errors before importing');
      return;
    }

    try {
      setImporting(true);
      const questions = JSON.parse(jsonData);
      const result = await onImport(questions);
      
      if (result.success) {
        alert(`✅ Successfully imported ${result.imported} questions!${result.failed > 0 ? `\n⚠️ ${result.failed} questions failed to import.` : ''}`);
        onClose();
      } else {
        alert('❌ Import failed: ' + result.error);
      }
    } catch (err) {
      alert('❌ Import failed: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  const generateSampleData = (category = 'Aptitude') => {
    return JSON.stringify([
      {
        text: "What is 2 + 2?",
        category: category,
        difficulty: "easy",
        options: ["2", "3", "4", "5"],
        correct: 2,
        tags: ["basic", "arithmetic"],
        explanation: "Simple addition: 2 + 2 = 4"
      },
      {
        text: "What is the capital of France?",
        category: "GK",
        difficulty: "medium",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2,
        tags: ["geography", "capitals"],
        explanation: "Paris is the capital and largest city of France"
      }
    ], null, 2);
  };

  const aiPromptTemplate = `Generate 25 questions for [CATEGORY] in this exact JSON format:

[
  {
    "text": "Question text here?",
    "category": "Aptitude",
    "difficulty": "easy",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correct": 0,
    "tags": ["tag1", "tag2"],
    "explanation": "Why this is correct..."
  }
]

Categories: ${categoryOptions.join(', ')}
Difficulty: easy, medium, hard
Important: "correct" is the index (0-3) of the right answer`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-xlarge bulk-import-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📥 Bulk Import Questions</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Import Method Tabs */}
          <div className="import-tabs">
            <button
              className={`tab ${importMethod === 'paste' ? 'active' : ''}`}
              onClick={() => setImportMethod('paste')}
            >
              📋 Paste JSON
            </button>
            <button
              className={`tab ${importMethod === 'file' ? 'active' : ''}`}
              onClick={() => setImportMethod('file')}
            >
              📁 Upload File
            </button>
            <button
              className={`tab ${importMethod === 'ai' ? 'active' : ''}`}
              onClick={() => setImportMethod('ai')}
            >
              🤖 AI Generate
            </button>
          </div>

          <div className="import-content">
            {/* Paste JSON Method */}
            {importMethod === 'paste' && (
              <div className="paste-method">
                <div className="method-header">
                  <h4>📋 Paste JSON Data</h4>
                  <p>Copy and paste your questions in JSON format</p>
                </div>
                
                <div className="json-input-section">
                  <div className="input-header">
                    <label>JSON Data:</label>
                    <div className="input-actions">
                      <button
                        className="btn btn-small"
                        onClick={() => setJsonData(generateSampleData())}
                      >
                        📝 Load Sample
                      </button>
                      <button
                        className="btn btn-small"
                        onClick={handleJsonValidation}
                      >
                        ✅ Validate
                      </button>
                    </div>
                  </div>
                  
                  <textarea
                    className="json-textarea"
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    placeholder="Paste your JSON data here..."
                    rows={15}
                  />
                </div>
              </div>
            )}

            {/* File Upload Method */}
            {importMethod === 'file' && (
              <div className="file-method">
                <div className="method-header">
                  <h4>📁 Upload File</h4>
                  <p>Upload JSON or CSV files with your questions</p>
                </div>
                
                <div className="file-upload-section">
                  <div className="upload-area">
                    <input
                      type="file"
                      accept=".json,.csv"
                      onChange={handleFileUpload}
                      className="file-input"
                      id="fileUpload"
                    />
                    <label htmlFor="fileUpload" className="upload-label">
                      <div className="upload-icon">📁</div>
                      <div className="upload-text">
                        <strong>Choose File</strong>
                        <span>JSON or CSV files only</span>
                      </div>
                    </label>
                  </div>
                  
                  {file && (
                    <div className="file-info">
                      <span className="file-name">📄 {file.name}</span>
                      <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  )}
                </div>

                <div className="format-examples">
                  <div className="format-example">
                    <h5>📄 JSON Format:</h5>
                    <pre className="code-block">
{`[
  {
    "text": "Question text?",
    "category": "Aptitude",
    "difficulty": "easy",
    "options": ["A", "B", "C", "D"],
    "correct": 2
  }
]`}
                    </pre>
                  </div>
                  
                  <div className="format-example">
                    <h5>📊 CSV Format:</h5>
                    <pre className="code-block">
{`text,category,difficulty,option1,option2,option3,option4,correct
"Question?",Aptitude,easy,A,B,C,D,2`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* AI Generate Method */}
            {importMethod === 'ai' && (
              <div className="ai-method">
                <div className="method-header">
                  <h4>🤖 AI-Powered Generation</h4>
                  <p>Use ChatGPT, Claude, or Gemini to generate questions</p>
                </div>
                
                <div className="ai-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h5>Copy AI Prompt</h5>
                      <div className="prompt-container">
                        <pre className="ai-prompt">{aiPromptTemplate}</pre>
                        <button
                          className="btn btn-copy"
                          onClick={() => {
                            navigator.clipboard.writeText(aiPromptTemplate);
                            alert('✅ Prompt copied to clipboard!');
                          }}
                        >
                          📋 Copy Prompt
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h5>Generate with AI</h5>
                      <div className="ai-links">
                        <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" className="ai-link">
                          🤖 ChatGPT
                        </a>
                        <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="ai-link">
                          🧠 Claude
                        </a>
                        <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="ai-link">
                          💎 Gemini
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h5>Paste AI Response</h5>
                      <textarea
                        className="ai-response-textarea"
                        value={jsonData}
                        onChange={(e) => setJsonData(e.target.value)}
                        placeholder="Paste the AI-generated JSON here..."
                        rows={10}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Validation Results */}
            {validationErrors.length > 0 && (
              <div className="validation-section">
                <h4>⚠️ Validation Errors</h4>
                <div className="error-list">
                  {validationErrors.map((error, index) => (
                    <div key={index} className="error-item">
                      <span className="error-icon">❌</span>
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview */}
            {previewData && (
              <div className="preview-section">
                <h4>👀 Preview (First 3 Questions)</h4>
                <div className="preview-questions">
                  {previewData.map((q, index) => (
                    <div key={index} className="preview-question">
                      <div className="preview-header">
                        <span className="question-number">Q{index + 1}</span>
                        <span className="question-category">{q.category}</span>
                        <span className="question-difficulty">{q.difficulty}</span>
                      </div>
                      <div className="preview-text">{q.text || q.question}</div>
                      <div className="preview-options">
                        {q.options?.map((option, optIndex) => (
                          <div 
                            key={optIndex} 
                            className={`preview-option ${optIndex === q.correct ? 'correct' : ''}`}
                          >
                            {String.fromCharCode(65 + optIndex)}. {option}
                            {optIndex === q.correct && ' ✅'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-info">
            {previewData && (
              <span className="import-info">
                Ready to import {JSON.parse(jsonData).length} questions
              </span>
            )}
          </div>
          <div className="footer-actions">
            <button
              className="btn btn-primary"
              onClick={handleImport}
              disabled={importing || validationErrors.length > 0 || !jsonData.trim()}
            >
              {importing ? '⏳ Importing...' : '📥 Import Questions'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={onClose}
              disabled={importing}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;