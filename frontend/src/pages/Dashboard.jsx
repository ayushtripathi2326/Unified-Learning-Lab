import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard({ user }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/results/user/${user.id}`)
        .then(res => {
          setResults(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  const quickLinks = [
    { title: 'Binary Tree', path: '/binary-tree', icon: '🌳', color: '#10b981' },
    { title: 'Binary Search', path: '/binary-search', icon: '🔍', color: '#3b82f6' },
    { title: 'Stack & Queue', path: '/stack-queue', icon: '📚', color: '#8b5cf6' },
    { title: 'CNN Visualizer', path: '/cnn', icon: '🧠', color: '#ec4899' },
    { title: 'Aptitude Test', path: '/aptitude/Aptitude', icon: '🧮', color: '#f59e0b' },
    { title: 'Coding Test', path: '/aptitude/Coding', icon: '💻', color: '#06b6d4' }
  ];

  const getAverageScore = () => {
    if (results.length === 0) return 0;
    return (results.reduce((acc, r) => acc + r.percentage, 0) / results.length).toFixed(1);
  };

  const getBestScore = () => {
    if (results.length === 0) return 0;
    return Math.max(...results.map(r => r.percentage));
  };

  const getRecentActivity = () => {
    return results.slice(0, 5);
  };

  return (
    <div className="dashboard">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="welcome-title">
            Welcome back, <span className="user-name">{user?.name || 'Student'}!</span>
          </h1>
          <p className="welcome-subtitle">Ready to continue your learning journey?</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-container">
        <div className="stat-card primary" style={{'--stat-index': 0}}>
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{results.length}</div>
            <div className="stat-label">Tests Completed</div>
          </div>
        </div>

        <div className="stat-card success" style={{'--stat-index': 1}}>
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">{getAverageScore()}%</div>
            <div className="stat-label">Average Score</div>
          </div>
        </div>

        <div className="stat-card warning" style={{'--stat-index': 2}}>
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-value">{getBestScore()}%</div>
            <div className="stat-label">Best Score</div>
          </div>
        </div>

        <div className="stat-card info" style={{'--stat-index': 3}}>
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{results.length > 0 ? 'Active' : 'Start'}</div>
            <div className="stat-label">Learning Status</div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="quick-access-section">
        <h2 className="section-title">
          <span className="title-icon">⚡</span>
          Quick Access
        </h2>
        <div className="quick-links-grid">
          {quickLinks.map((link, idx) => (
            <Link
              to={link.path}
              key={idx}
              className="quick-link-card"
              style={{'--link-color': link.color, '--link-index': idx}}
            >
              <div className="quick-link-icon">{link.icon}</div>
              <div className="quick-link-title">{link.title}</div>
              <div className="quick-link-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-section">
        <h2 className="section-title">
          <span className="title-icon">📋</span>
          Recent Activity
        </h2>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your results...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No test results yet</h3>
            <p>Start taking tests to see your progress here!</p>
            <Link to="/aptitude/Aptitude" className="btn btn-primary">
              Take Your First Test
            </Link>
          </div>
        ) : (
          <div className="results-table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Test Category</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {getRecentActivity().map((result, idx) => (
                  <tr key={idx} className="result-row">
                    <td className="category-cell">
                      <span className="category-badge">{result.category}</span>
                    </td>
                    <td className="score-cell">{result.score}/{result.total}</td>
                    <td className="percentage-cell">
                      <div className="percentage-bar-container">
                        <div
                          className="percentage-bar"
                          style={{width: `${result.percentage}%`}}
                        ></div>
                        <span className="percentage-text">{result.percentage}%</span>
                      </div>
                    </td>
                    <td className="date-cell">
                      {new Date(result.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="status-cell">
                      <span className={`status-badge ${result.percentage >= 70 ? 'pass' : 'fail'}`}>
                        {result.percentage >= 70 ? '✓ Pass' : '✗ Fail'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Learning Tips */}
      <div className="tips-section">
        <h2 className="section-title">
          <span className="title-icon">💡</span>
          Learning Tips
        </h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <h3>Practice Regularly</h3>
            <p>Consistent practice leads to better retention and understanding</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📖</div>
            <h3>Understand Concepts</h3>
            <p>Focus on understanding rather than memorization</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔄</div>
            <h3>Review Mistakes</h3>
            <p>Learn from errors to improve your performance</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
