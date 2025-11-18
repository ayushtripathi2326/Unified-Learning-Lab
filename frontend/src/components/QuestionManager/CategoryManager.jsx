import React, { useState } from 'react';

const CategoryManager = ({ categories, onClose }) => {
  const [customCategories, setCustomCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '',
    description: '',
    color: '#007bff'
  });

  const defaultCategories = [
    { name: 'Aptitude', icon: '🧮', description: 'Numerical reasoning and problem solving', color: '#007bff', isDefault: true },
    { name: 'Coding', icon: '💻', description: 'Programming and algorithms', color: '#28a745', isDefault: true },
    { name: 'OS', icon: '🖥️', description: 'Operating Systems concepts', color: '#6f42c1', isDefault: true },
    { name: 'DBMS', icon: '🗄️', description: 'Database management systems', color: '#fd7e14', isDefault: true },
    { name: 'Networks', icon: '🌐', description: 'Computer networks and protocols', color: '#20c997', isDefault: true },
    { name: 'Quantitative', icon: '📊', description: 'Mathematical and statistical problems', color: '#e83e8c', isDefault: true },
    { name: 'Verbal', icon: '📝', description: 'English language and communication', color: '#6610f2', isDefault: true },
    { name: 'Logical', icon: '🧠', description: 'Logical reasoning and patterns', color: '#dc3545', isDefault: true },
    { name: 'GK', icon: '🌍', description: 'General knowledge and current affairs', color: '#ffc107', isDefault: true }
  ];

  const [allCategories, setAllCategories] = useState([...defaultCategories, ...customCategories]);

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      alert('Category name is required');
      return;
    }

    if (allCategories.some(cat => cat.name.toLowerCase() === newCategory.name.toLowerCase())) {
      alert('Category already exists');
      return;
    }

    const category = {
      ...newCategory,
      id: Date.now(),
      isDefault: false,
      questionCount: 0
    };

    setAllCategories(prev => [...prev, category]);
    setCustomCategories(prev => [...prev, category]);
    setNewCategory({ name: '', icon: '', description: '', color: '#007bff' });
  };

  const handleDeleteCategory = (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    setAllCategories(prev => prev.filter(cat => cat.id !== categoryId));
    setCustomCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const handleUpdateCategory = (categoryId, updates) => {
    setAllCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, ...updates } : cat
    ));
    setCustomCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, ...updates } : cat
    ));
  };

  const predefinedIcons = ['📚', '🔬', '🎨', '🏃', '🎵', '🍳', '🌱', '⚖️', '🏥', '🔧', '📈', '🌟', '🎯', '🔍', '💡'];
  const predefinedColors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large category-manager-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🏷️ Category Management</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Add New Category */}
          <div className="add-category-section">
            <h4>➕ Add New Category</h4>
            <div className="category-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Category Name</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Science, History, Sports..."
                  />
                </div>
                
                <div className="form-group">
                  <label>Icon</label>
                  <div className="icon-input-group">
                    <input
                      type="text"
                      value={newCategory.icon}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="🔬"
                      maxLength="2"
                    />
                    <div className="icon-suggestions">
                      {predefinedIcons.map(icon => (
                        <button
                          key={icon}
                          type="button"
                          className="icon-btn"
                          onClick={() => setNewCategory(prev => ({ ...prev, icon }))}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this category..."
                  />
                </div>
                
                <div className="form-group">
                  <label>Color</label>
                  <div className="color-input-group">
                    <input
                      type="color"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                    />
                    <div className="color-suggestions">
                      {predefinedColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          className="color-btn"
                          style={{ backgroundColor: color }}
                          onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary" onClick={handleAddCategory}>
                ➕ Add Category
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="categories-list-section">
            <h4>📋 All Categories</h4>
            
            <div className="categories-grid">
              {allCategories.map(category => (
                <div key={category.id || category.name} className="category-card">
                  <div className="category-header">
                    <div className="category-icon" style={{ color: category.color }}>
                      {category.icon}
                    </div>
                    <div className="category-info">
                      <h5>{category.name}</h5>
                      <p>{category.description}</p>
                    </div>
                    <div className="category-actions">
                      {!category.isDefault && (
                        <>
                          <button
                            className="btn btn-small btn-edit"
                            onClick={() => {
                              const newName = prompt('New category name:', category.name);
                              if (newName && newName !== category.name) {
                                handleUpdateCategory(category.id, { name: newName });
                              }
                            }}
                            title="Edit category"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-small btn-delete"
                            onClick={() => handleDeleteCategory(category.id)}
                            title="Delete category"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="category-stats">
                    <div className="stat-item">
                      <span className="stat-label">Questions:</span>
                      <span className="stat-value">{category.questionCount || 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Type:</span>
                      <span className={`stat-badge ${category.isDefault ? 'default' : 'custom'}`}>
                        {category.isDefault ? 'Default' : 'Custom'}
                      </span>
                    </div>
                  </div>

                  <div className="category-preview" style={{ borderColor: category.color }}>
                    <div className="preview-badge" style={{ backgroundColor: category.color }}>
                      {category.icon} {category.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Usage Statistics */}
          <div className="category-stats-section">
            <h4>📊 Category Statistics</h4>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏷️</div>
                <div className="stat-content">
                  <h3>{allCategories.length}</h3>
                  <p>Total Categories</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <h3>{defaultCategories.length}</h3>
                  <p>Default Categories</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🎨</div>
                <div className="stat-content">
                  <h3>{customCategories.length}</h3>
                  <p>Custom Categories</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-content">
                  <h3>{allCategories.reduce((sum, cat) => sum + (cat.questionCount || 0), 0)}</h3>
                  <p>Total Questions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Import/Export Categories */}
          <div className="category-tools-section">
            <h4>🔧 Category Tools</h4>
            <div className="tools-grid">
              <div className="tool-card">
                <div className="tool-icon">📤</div>
                <div className="tool-content">
                  <h5>Export Categories</h5>
                  <p>Download your custom categories as JSON</p>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      const dataStr = JSON.stringify(customCategories, null, 2);
                      const dataBlob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'custom-categories.json';
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    📤 Export
                  </button>
                </div>
              </div>
              
              <div className="tool-card">
                <div className="tool-icon">📥</div>
                <div className="tool-content">
                  <h5>Import Categories</h5>
                  <p>Upload categories from JSON file</p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const imported = JSON.parse(event.target.result);
                            if (Array.isArray(imported)) {
                              setCustomCategories(prev => [...prev, ...imported]);
                              setAllCategories(prev => [...prev, ...imported]);
                              alert(`✅ Imported ${imported.length} categories`);
                            }
                          } catch (err) {
                            alert('❌ Invalid JSON file');
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                    style={{ display: 'none' }}
                    id="importCategories"
                  />
                  <label htmlFor="importCategories" className="btn btn-secondary">
                    📥 Import
                  </label>
                </div>
              </div>
              
              <div className="tool-card">
                <div className="tool-icon">🔄</div>
                <div className="tool-content">
                  <h5>Reset Categories</h5>
                  <p>Reset to default categories only</p>
                  <button 
                    className="btn btn-danger"
                    onClick={() => {
                      if (window.confirm('Reset to default categories? This will remove all custom categories.')) {
                        setCustomCategories([]);
                        setAllCategories([...defaultCategories]);
                      }
                    }}
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            ✅ Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;