import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [bulkImportFile, setBulkImportFile] = useState(null);

  const API_URL = 'http://localhost:5001/api/admin';
  const token = localStorage.getItem('token');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/stats`, axiosConfig);
      setStats(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users`, axiosConfig);
      console.log('Users response:', response.data);
      setUsers(response.data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all questions
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/questions`, axiosConfig);
      setQuestions(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all results
  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/results`, axiosConfig);
      setResults(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const handleUpdateUser = async (userId, updates) => {
    try {
      await axios.put(`${API_URL}/users/${userId}`, updates, axiosConfig);
      alert('User updated successfully');
      fetchUsers();
      setShowUserModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`${API_URL}/users/${userId}`, axiosConfig);
      alert('User deleted successfully');
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  // Delete question
  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await axios.delete(`${API_URL}/questions/${questionId}`, axiosConfig);
      alert('Question deleted successfully');
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete question');
    }
  };

  // Create question
  const handleCreateQuestion = async (questionData) => {
    try {
      await axios.post(`${API_URL}/questions`, questionData, axiosConfig);
      alert('Question created successfully');
      fetchQuestions();
      setShowQuestionModal(false);
      setSelectedQuestion(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create question');
    }
  };

  // Update question
  const handleUpdateQuestion = async (questionId, questionData) => {
    try {
      await axios.put(`${API_URL}/questions/${questionId}`, questionData, axiosConfig);
      alert('Question updated successfully');
      fetchQuestions();
      setShowQuestionModal(false);
      setSelectedQuestion(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update question');
    }
  };

  // Bulk import questions
  const handleBulkImport = async (questionsArray) => {
    try {
      let successCount = 0;
      let errorCount = 0;

      for (const question of questionsArray) {
        try {
          await axios.post(`${API_URL}/questions`, question, axiosConfig);
          successCount++;
        } catch (err) {
          errorCount++;
          console.error('Error importing question:', err);
        }
      }

      alert(`Import completed!\nSuccessful: ${successCount}\nFailed: ${errorCount}`);
      fetchQuestions();
      setShowBulkImportModal(false);
      setBulkImportFile(null);
    } catch (err) {
      alert('Failed to import questions');
    }
  };

  // Parse CSV file
  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const questions = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Split by comma, but handle commas within quotes
      const parts = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
      if (!parts || parts.length < 7) continue;

      const question = {
        text: parts[0].replace(/^"|"$/g, '').trim(),
        category: parts[1].replace(/^"|"$/g, '').trim(),
        difficulty: parts[2].replace(/^"|"$/g, '').trim(),
        options: [
          parts[3].replace(/^"|"$/g, '').trim(),
          parts[4].replace(/^"|"$/g, '').trim(),
          parts[5].replace(/^"|"$/g, '').trim(),
          parts[6].replace(/^"|"$/g, '').trim()
        ],
        correct: parseInt(parts[7])
      };

      questions.push(question);
    }

    return questions;
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setBulkImportFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;

      try {
        if (file.name.endsWith('.json')) {
          const questions = JSON.parse(text);
          if (Array.isArray(questions)) {
            handleBulkImport(questions);
          } else {
            alert('Invalid JSON format. Expected an array of questions.');
          }
        } else if (file.name.endsWith('.csv')) {
          const questions = parseCSV(text);
          if (questions.length > 0) {
            handleBulkImport(questions);
          } else {
            alert('No valid questions found in CSV file.');
          }
        } else {
          alert('Please upload a JSON or CSV file.');
        }
      } catch (err) {
        alert('Error parsing file: ' + err.message);
      }
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    console.log('Active tab changed:', activeTab);
    console.log('Current token:', token ? 'Token exists' : 'No token');

    if (activeTab === 'dashboard') {
      fetchStats();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'questions') {
      fetchQuestions();
    } else if (activeTab === 'results') {
      fetchResults();
    }
  }, [activeTab]);

  // Dashboard Tab
  const renderDashboard = () => (
    <div className="dashboard-content">
      <h2 className="section-title">📊 Dashboard Overview</h2>

      {stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.overview.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{stats.overview.activeUsers}</h3>
                <p>Active Users</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❓</div>
              <div className="stat-info">
                <h3>{stats.overview.totalQuestions}</h3>
                <p>Total Questions</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-info">
                <h3>{stats.overview.totalResults}</h3>
                <p>Total Results</p>
              </div>
            </div>
          </div>

          <div className="users-by-role">
            <h3>Users by Role</h3>
            <div className="role-cards">
              {stats.usersByRole.map((role) => (
                <div key={role._id} className="role-card">
                  <span className="role-name">{role._id}</span>
                  <span className="role-count">{role.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="recent-users">
            <h3>Recent Users</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className={`badge badge-${user.role}`}>{user.role}</span></td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );

  // Users Tab
  const renderUsers = () => (
    <div className="users-content">
      <h2 className="section-title">👥 User Management</h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td><span className={`badge badge-${user.role}`}>{user.role}</span></td>
              <td>
                <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="action-buttons">
                <button
                  className="btn btn-edit"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowUserModal(true);
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Questions Tab
  const renderQuestions = () => (
    <div className="questions-content">
      <div className="section-header-with-button">
        <h2 className="section-title">❓ Question Management</h2>
        <div className="button-group">
          <button
            className="btn btn-import"
            onClick={() => setShowBulkImportModal(true)}
          >
            📤 Bulk Import
          </button>
          <button
            className="btn btn-add"
            onClick={() => {
              setSelectedQuestion(null);
              setIsEditingQuestion(false);
              setShowQuestionModal(true);
            }}
          >
            ➕ Add Question
          </button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
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
              <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                No questions found. Click "Add New Question" to create one.
              </td>
            </tr>
          ) : (
            questions.map((question) => (
              <tr key={question._id}>
                <td className="question-text">{question.text || question.question}</td>
                <td><span className="badge badge-category">{question.category}</span></td>
                <td><span className={`badge badge-${question.difficulty || 'medium'}`}>{question.difficulty || 'medium'}</span></td>
                <td>{question.options?.length || 0} options</td>
                <td>{new Date(question.createdAt).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <button
                    className="btn btn-edit"
                    onClick={() => {
                      setSelectedQuestion(question);
                      setIsEditingQuestion(true);
                      setShowQuestionModal(true);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDeleteQuestion(question._id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // Results Tab
  const renderResults = () => (
    <div className="results-content">
      <h2 className="section-title">📝 Test Results</h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Category</th>
            <th>Score</th>
            <th>Total Questions</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result._id}>
              <td>{result.userId?.name || 'Unknown'}</td>
              <td><span className="badge badge-category">{result.category}</span></td>
              <td className="score">{result.score}</td>
              <td>{result.totalQuestions}</td>
              <td>{new Date(result.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // User Edit Modal
  const renderUserModal = () => {
    if (!showUserModal || !selectedUser) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>Edit User</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleUpdateUser(selectedUser._id, {
              name: formData.get('name'),
              email: formData.get('email'),
              role: formData.get('role'),
              isActive: formData.get('isActive') === 'true'
            });
          }}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" defaultValue={selectedUser.name} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" defaultValue={selectedUser.email} required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role" defaultValue={selectedUser.role}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="isActive" defaultValue={selectedUser.isActive.toString()}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="modal-buttons">
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" className="btn btn-cancel" onClick={() => setShowUserModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Question Modal (Create/Edit)
  const renderQuestionModal = () => {
    if (!showQuestionModal) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowQuestionModal(false)}>
        <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
          <h3>{isEditingQuestion ? 'Edit Question' : 'Add New Question'}</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            const questionData = {
              text: formData.get('text'),
              category: formData.get('category'),
              difficulty: formData.get('difficulty'),
              options: [
                formData.get('option1'),
                formData.get('option2'),
                formData.get('option3'),
                formData.get('option4')
              ],
              correct: parseInt(formData.get('correct'))
            };

            if (isEditingQuestion && selectedQuestion) {
              handleUpdateQuestion(selectedQuestion._id, questionData);
            } else {
              handleCreateQuestion(questionData);
            }
          }}>
            <div className="form-group">
              <label>Question Text *</label>
              <textarea
                name="text"
                rows="3"
                defaultValue={selectedQuestion?.text || selectedQuestion?.question || ''}
                required
                placeholder="Enter the question..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select name="category" defaultValue={selectedQuestion?.category || 'Aptitude'} required>
                  <option value="Aptitude">Aptitude</option>
                  <option value="Coding">Coding</option>
                  <option value="OS">Operating System</option>
                  <option value="DBMS">DBMS</option>
                  <option value="Networks">Networks</option>
                  <option value="Quantitative">Quantitative</option>
                  <option value="Verbal">Verbal</option>
                  <option value="Logical">Logical</option>
                  <option value="GK">General Knowledge</option>
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty *</label>
                <select name="difficulty" defaultValue={selectedQuestion?.difficulty || 'medium'} required>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Option 1 *</label>
              <input
                type="text"
                name="option1"
                defaultValue={selectedQuestion?.options?.[0] || ''}
                required
                placeholder="First option..."
              />
            </div>

            <div className="form-group">
              <label>Option 2 *</label>
              <input
                type="text"
                name="option2"
                defaultValue={selectedQuestion?.options?.[1] || ''}
                required
                placeholder="Second option..."
              />
            </div>

            <div className="form-group">
              <label>Option 3 *</label>
              <input
                type="text"
                name="option3"
                defaultValue={selectedQuestion?.options?.[2] || ''}
                required
                placeholder="Third option..."
              />
            </div>

            <div className="form-group">
              <label>Option 4 *</label>
              <input
                type="text"
                name="option4"
                defaultValue={selectedQuestion?.options?.[3] || ''}
                required
                placeholder="Fourth option..."
              />
            </div>

            <div className="form-group">
              <label>Correct Answer * (Enter number: 0, 1, 2, or 3)</label>
              <input
                type="number"
                name="correct"
                min="0"
                max="3"
                defaultValue={selectedQuestion?.correct ?? ''}
                required
                placeholder="0 for Option 1, 1 for Option 2, etc."
              />
            </div>

            <div className="modal-buttons">
              <button type="submit" className="btn btn-primary">
                {isEditingQuestion ? 'Update Question' : 'Create Question'}
              </button>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={() => {
                  setShowQuestionModal(false);
                  setSelectedQuestion(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Bulk Import Modal
  const renderBulkImportModal = () => {
    if (!showBulkImportModal) return null;

    const downloadSampleJSON = () => {
      const sample = [
        {
          text: "What is 2 + 2?",
          category: "Aptitude",
          difficulty: "easy",
          options: ["2", "3", "4", "5"],
          correct: 2
        },
        {
          text: "What is the capital of France?",
          category: "GK",
          difficulty: "medium",
          options: ["London", "Berlin", "Paris", "Madrid"],
          correct: 2
        }
      ];

      const dataStr = JSON.stringify(sample, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sample-questions.json';
      link.click();
    };

    const downloadSampleCSV = () => {
      const csv = `text,category,difficulty,option1,option2,option3,option4,correct
"What is 2 + 2?",Aptitude,easy,2,3,4,5,2
"What is the capital of France?",GK,medium,London,Berlin,Paris,Madrid,2
"Which planet is known as Red Planet?",GK,easy,Venus,Mars,Jupiter,Saturn,1`;

      const dataBlob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sample-questions.csv';
      link.click();
    };

    return (
      <div className="modal-overlay" onClick={() => setShowBulkImportModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>📤 Bulk Import Questions</h3>

          <div className="import-info">
            <p>Upload a JSON or CSV file containing multiple questions.</p>

            <div className="format-section">
              <h4>JSON Format:</h4>
              <pre className="code-block">
{`[
  {
    "text": "Question text here?",
    "category": "Aptitude",
    "difficulty": "easy",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correct": 2
  }
]`}
              </pre>
              <button className="btn btn-download" onClick={downloadSampleJSON}>
                💾 Download Sample JSON
              </button>
            </div>

            <div className="format-section">
              <h4>CSV Format:</h4>
              <pre className="code-block">
{`text,category,difficulty,option1,option2,option3,option4,correct
"Question?",Aptitude,easy,Opt1,Opt2,Opt3,Opt4,2`}
              </pre>
              <button className="btn btn-download" onClick={downloadSampleCSV}>
                💾 Download Sample CSV
              </button>
            </div>
          </div>

          <div className="file-upload-section">
            <label htmlFor="bulkUpload" className="file-upload-label">
              📁 Choose File (JSON or CSV)
            </label>
            <input
              id="bulkUpload"
              type="file"
              accept=".json,.csv"
              onChange={handleFileUpload}
              className="file-input"
            />
          </div>

          <div className="modal-buttons">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => {
                setShowBulkImportModal(false);
                setBulkImportFile(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>🔧 Admin Panel</h1>
        <p>Manage users, questions, and view statistics</p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button
          className={`tab ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          ❓ Questions
        </button>
        <button
          className={`tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          📝 Results
        </button>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'questions' && renderQuestions()}
            {activeTab === 'results' && renderResults()}
          </>
        )}
      </div>

      {renderUserModal()}
      {renderQuestionModal()}
      {renderBulkImportModal()}
    </div>
  );
}

export default Admin;
