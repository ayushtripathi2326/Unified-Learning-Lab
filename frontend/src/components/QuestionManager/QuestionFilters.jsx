import React from 'react';

const QuestionFilters = ({ filters, setFilters, categories, stats }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      difficulty: '',
      search: '',
      dateRange: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const categoryOptions = [
    'Aptitude', 'Coding', 'OS', 'DBMS', 'Networks', 
    'Quantitative', 'Verbal', 'Logical', 'GK'
  ];

  return (
    <div className="question-filters">
      <div className="filters-row">
        <div className="filter-group">
          <label>🔍 Search</label>
          <input
            type="text"
            placeholder="Search questions..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>🏷️ Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categoryOptions.map(cat => (
              <option key={cat} value={cat}>
                {cat} ({stats.byCategory[cat] || 0})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>⚡ Difficulty</label>
          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="easy">Easy ({stats.byDifficulty.easy || 0})</option>
            <option value="medium">Medium ({stats.byDifficulty.medium || 0})</option>
            <option value="hard">Hard ({stats.byDifficulty.hard || 0})</option>
          </select>
        </div>

        <div className="filter-group">
          <label>📅 Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="filter-group">
          <label>📊 Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="createdAt">Date Created</option>
            <option value="text">Question Text</option>
            <option value="category">Category</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </div>

        <div className="filter-group">
          <label>🔄 Order</label>
          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <div className="filter-actions">
          <button
            className="btn btn-clear"
            onClick={clearFilters}
            title="Clear all filters"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="quick-filters">
        <span className="filter-label">Quick Filters:</span>
        
        <button
          className={`filter-chip ${filters.dateRange === 'week' ? 'active' : ''}`}
          onClick={() => handleFilterChange('dateRange', filters.dateRange === 'week' ? '' : 'week')}
        >
          📅 This Week
        </button>
        
        <button
          className={`filter-chip ${filters.difficulty === 'easy' ? 'active' : ''}`}
          onClick={() => handleFilterChange('difficulty', filters.difficulty === 'easy' ? '' : 'easy')}
        >
          🟢 Easy
        </button>
        
        <button
          className={`filter-chip ${filters.difficulty === 'hard' ? 'active' : ''}`}
          onClick={() => handleFilterChange('difficulty', filters.difficulty === 'hard' ? '' : 'hard')}
        >
          🔴 Hard
        </button>
        
        <button
          className={`filter-chip ${filters.category === 'Coding' ? 'active' : ''}`}
          onClick={() => handleFilterChange('category', filters.category === 'Coding' ? '' : 'Coding')}
        >
          💻 Coding
        </button>
        
        <button
          className={`filter-chip ${filters.category === 'Aptitude' ? 'active' : ''}`}
          onClick={() => handleFilterChange('category', filters.category === 'Aptitude' ? '' : 'Aptitude')}
        >
          🧮 Aptitude
        </button>
      </div>
    </div>
  );
};

export default QuestionFilters;