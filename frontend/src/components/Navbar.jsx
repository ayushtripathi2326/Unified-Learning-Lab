import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout, toggleSidebar }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = () => {
    setIsUserDropdownOpen(false);
    onLogout();
  };

  const handleChatbotClick = () => {
    navigate('/chatbot');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {user && (
          <button onClick={toggleSidebar} className="sidebar-toggle" title="Toggle Sidebar">
            ☰
          </button>
        )}
        <Link to="/" className="navbar-brand">
          🎓 Unified Learning Lab
        </Link>
      </div>

      <button className="navbar-toggle" onClick={toggleMenu}>
        ☰
      </button>

      <ul className={`navbar-nav ${isMenuOpen ? 'open' : ''}`}>
        {user && (
          <>
            <li>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`} onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/binary-tree" className={`nav-link ${isActive('/binary-tree')}`} onClick={() => setIsMenuOpen(false)}>
                Binary Tree
              </Link>
            </li>
            <li>
              <Link to="/binary-search" className={`nav-link ${isActive('/binary-search')}`} onClick={() => setIsMenuOpen(false)}>
                Binary Search
              </Link>
            </li>
            <li>
              <Link to="/stack-queue" className={`nav-link ${isActive('/stack-queue')}`} onClick={() => setIsMenuOpen(false)}>
                Stack & Queue
              </Link>
            </li>
            <li>
              <Link to="/cnn" className={`nav-link ${isActive('/cnn')}`} onClick={() => setIsMenuOpen(false)}>
                CNN Visualizer
              </Link>
            </li>
          </>
        )}
      </ul>

      <div className="navbar-right">
        {user ? (
          <>
            <button
              className="ai-assistant-btn"
              onClick={handleChatbotClick}
              title="AI Learning Assistant"
            >
              🤖
            </button>
            <div className="user-menu" ref={dropdownRef}>
              <button className="user-info" onClick={toggleUserDropdown}>
                <span className="user-icon">👤</span>
                <span className="user-name">{user.name}</span>
                <span className="dropdown-arrow">{isUserDropdownOpen ? '▲' : '▼'}</span>
              </button>
              {isUserDropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-user-icon">👤</div>
                    <div className="dropdown-user-info">
                      <div className="dropdown-user-name">{user.name}</div>
                      <div className="dropdown-user-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button onClick={() => { setIsUserDropdownOpen(false); navigate('/dashboard'); }} className="dropdown-item">
                    <span className="dropdown-icon">📊</span>
                    Dashboard
                  </button>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    <span className="dropdown-icon">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" className="btn-login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
