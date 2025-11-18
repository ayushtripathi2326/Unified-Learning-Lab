import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import QuestionForm from './QuestionForm';
import QuestionFilters from './QuestionFilters';
import QuestionTable from './QuestionTable';
import BulkImportModal from './BulkImportModal';
import CategoryManager from './CategoryManager';
import './QuestionManager.css';

const QuestionManager = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: '',
    dateRange: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [stats, setStats] = useState({
    total: 0,
    byCategory: {},
    byDifficulty: {},
    recentlyAdded: 0
  });

  const API_BASE = '/admin';

  // Fetch questions with filters
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await apiClient.get(`${API_BASE}/questions?${params}`);
      setQuestions(response.data);
      setFilteredQuestions(response.data);
      calculateStats(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch questions');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (questionsData) => {
    const byCategory = {};
    const byDifficulty = {};
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    let recentlyAdded = 0;

    questionsData.forEach(q => {
      byCategory[q.category] = (byCategory[q.category] || 0) + 1;
      byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
      
      if (new Date(q.createdAt) > weekAgo) {
        recentlyAdded++;
      }
    });

    setStats({
      total: questionsData.length,
      byCategory,
      byDifficulty,
      recentlyAdded
    });
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...questions];

    if (filters.category) {
      filtered = filtered.filter(q => q.category === filters.category);
    }

    if (filters.difficulty) {
      filtered = filtered.filter(q => q.difficulty === filters.difficulty);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(q => 
        q.text.toLowerCase().includes(searchTerm) ||
        q.options.some(opt => opt.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.dateRange) {
      const now = new Date();
      let cutoffDate;
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          cutoffDate = null;
      }
      
      if (cutoffDate) {
        filtered = filtered.filter(q => new Date(q.createdAt) >= cutoffDate);
      }
    }

    filtered.sort((a, b) => {
      let aVal = a[filters.sortBy];
      let bVal = b[filters.sortBy];
      
      if (filters.sortBy === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (filters.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredQuestions(filtered);
  };

  // Handle question operations
  const handleCreateQuestion = async (questionData) => {
    try {
      await apiClient.post(`${API_BASE}/questions`, questionData);
      setShowQuestionForm(false);
      setSelectedQuestion(null);
      fetchQuestions();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to create question' };
    }
  };

  const handleUpdateQuestion = async (questionId, questionData) => {
    try {
      await apiClient.put(`${API_BASE}/questions/${questionId}`, questionData);
      setShowQuestionForm(false);
      setSelectedQuestion(null);
      fetchQuestions();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to update question' };
    }
  };

  const handleDeleteQuestion = async (questionId, category) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await apiClient.delete(`${API_BASE}/questions/${questionId}?category=${category}`);
      fetchQuestions();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to delete question' };
    }
  };

  const handleBulkImport = async (questionsData) => {
    try {
      const response = await apiClient.post(`${API_BASE}/questions/bulk-import`, {
        questions: questionsData
      });
      
      setShowBulkImport(false);
      fetchQuestions();
      
      return {
        success: true,
        imported: response.data.imported,
        failed: response.data.failed,
        errors: response.data.errors
      };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to import questions'
      };
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, questions]);

  return (
    <div className="question-manager">
      <div className="question-manager-header">
        <div className="header-content">
          <h2>❓ Advanced Question Management</h2>
          <p>Manage questions across all categories with powerful filtering and bulk operations</p>
        </div>
        
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowCategoryManager(true)}
          >
            🏷️ Categories
          </button>
          <button
            className="btn btn-import"
            onClick={() => setShowBulkImport(true)}
          >
            📥 Bulk Import
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedQuestion(null);
              setShowQuestionForm(true);
            }}
          >
            ➕ Add Question
          </button>
        </div>
      </div>

      <div className="stats-dashboard">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Questions</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🆕</div>
          <div className="stat-content">
            <h3>{stats.recentlyAdded}</h3>
            <p>Added This Week</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <h3>{Object.keys(stats.byCategory).length}</h3>
            <p>Categories</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{filteredQuestions.length}</h3>
            <p>Filtered Results</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <QuestionFilters
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        stats={stats}
      />

      <QuestionTable
        questions={filteredQuestions}
        loading={loading}
        onEdit={(question) => {
          setSelectedQuestion(question);
          setShowQuestionForm(true);
        }}
        onDelete={handleDeleteQuestion}
      />

      {showQuestionForm && (
        <QuestionForm
          question={selectedQuestion}
          categories={categories}
          onSave={selectedQuestion ? handleUpdateQuestion : handleCreateQuestion}
          onClose={() => {
            setShowQuestionForm(false);
            setSelectedQuestion(null);
          }}
        />
      )}

      {showBulkImport && (
        <BulkImportModal
          categories={categories}
          onImport={handleBulkImport}
          onClose={() => setShowBulkImport(false)}
        />
      )}

      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onClose={() => setShowCategoryManager(false)}
        />
      )}
    </div>
  );
};

export default QuestionManager;