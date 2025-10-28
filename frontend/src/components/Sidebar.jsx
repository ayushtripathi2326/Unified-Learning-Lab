import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">📚 Learning Modules</h3>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Main</h4>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard')}`}>
                <span className="sidebar-icon">📊</span>
                <span>Dashboard</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Data Structures</h4>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <Link to="/binary-tree" className={`sidebar-link ${isActive('/binary-tree')}`}>
                <span className="sidebar-icon">🌳</span>
                <span>Binary Tree</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/stack" className={`sidebar-link ${isActive('/stack')}`}>
                <span className="sidebar-icon">📚</span>
                <span>Stack</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/queue" className={`sidebar-link ${isActive('/queue')}`}>
                <span className="sidebar-icon">🎫</span>
                <span>Queue</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/linked-list" className={`sidebar-link ${isActive('/linked-list')}`}>
                <span className="sidebar-icon">🔗</span>
                <span>Linked List</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/hash-table" className={`sidebar-link ${isActive('/hash-table')}`}>
                <span className="sidebar-icon">🗂️</span>
                <span>Hash Table</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/heap" className={`sidebar-link ${isActive('/heap')}`}>
                <span className="sidebar-icon">🔺</span>
                <span>Heap</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Algorithms</h4>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <Link to="/sorting" className={`sidebar-link ${isActive('/sorting')}`}>
                <span className="sidebar-icon">📊</span>
                <span>Sorting Algorithms</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/searching" className={`sidebar-link ${isActive('/searching')}`}>
                <span className="sidebar-icon">🔍</span>
                <span>Searching Algorithms</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Tests</h4>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <Link to="/aptitude/Aptitude" className={`sidebar-link ${isActive('/aptitude/Aptitude')}`}>
                <span className="sidebar-icon">🧮</span>
                <span>Aptitude Test</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/aptitude/Coding" className={`sidebar-link ${isActive('/aptitude/Coding')}`}>
                <span className="sidebar-icon">💻</span>
                <span>Coding Test</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/aptitude/DBMS" className={`sidebar-link ${isActive('/aptitude/DBMS')}`}>
                <span className="sidebar-icon">🗄️</span>
                <span>DBMS Test</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/aptitude/OS" className={`sidebar-link ${isActive('/aptitude/OS')}`}>
                <span className="sidebar-icon">⚙️</span>
                <span>OS Test</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/aptitude/Networks" className={`sidebar-link ${isActive('/aptitude/Networks')}`}>
                <span className="sidebar-icon">🌐</span>
                <span>Networks Test</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Machine Learning</h4>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <Link to="/cnn" className={`sidebar-link ${isActive('/cnn')}`}>
                <span className="sidebar-icon">🧠</span>
                <span>CNN Visualizer</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Skills</h4>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <Link to="/typing-speed" className={`sidebar-link ${isActive('/typing-speed')}`}>
                <span className="sidebar-icon">⌨️</span>
                <span>Typing Speed</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Assistance</h4>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <Link to="/chatbot" className={`sidebar-link ${isActive('/chatbot')}`}>
                <span className="sidebar-icon">🤖</span>
                <span>AI Assistant</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
