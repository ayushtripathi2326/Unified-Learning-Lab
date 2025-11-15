import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AIChatSidebar from './components/AIChatSidebar';
import { lazy, Suspense } from 'react';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const AptitudeTest = lazy(() => import('./pages/AptitudeTest'));
const BinaryTree = lazy(() => import('./pages/BinaryTree'));
const BST = lazy(() => import('./pages/BST'));
const BinarySearch = lazy(() => import('./pages/BinarySearch'));
const StackQueue = lazy(() => import('./pages/StackQueue'));
const CNNVisualizer = lazy(() => import('./pages/CNNVisualizer'));
const Chatbot = lazy(() => import('./pages/Chatbot'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

import ShortcutOverlay from './components/ShortcutOverlay';
import LoadingSpinner from './components/LoadingSpinner';
import { initBackendWakeup } from './utils/backendWakeup';
import { startKeepAlive, stopKeepAlive } from './utils/keepAlive';
import './App.css';

const GLOBAL_SHORTCUT_SECTIONS = [
  {
    id: 'general-shortcuts',
    title: 'General',
    shortcuts: [
      {
        id: 'shortcut-help',
        keys: ['Shift', '/'],
        description: 'Show or hide this keyboard shortcut guide',
      },
      {
        id: 'shortcut-help-close',
        keys: ['Esc'],
        description: 'Close the keyboard shortcut guide',
      },
    ],
  },
  {
    id: 'ai-shortcuts',
    title: 'AI Assistant',
    shortcuts: [
      {
        id: 'ai-toggle',
        keys: ['Ctrl / Cmd', 'Shift', 'A'],
        description: 'Open or close the AI assistant sidebar',
      },
      {
        id: 'ai-send-message',
        keys: ['Ctrl / Cmd', 'Enter'],
        description: 'Send your message in the AI assistant sidebar',
      },
      {
        id: 'ai-new-line',
        keys: ['Enter'],
        description: 'Insert a new line while composing an AI assistant message',
      },
    ],
  },
];

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start with sidebar closed
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleAiChat = () => {
    setAiChatOpen(!aiChatOpen);
  };

  useEffect(() => {
    // Wake up backend on app load
    initBackendWakeup();
    
    // Start keep-alive for free tier
    startKeepAlive();
    
    const handleGlobalKeydown = (event) => {
      const target = event.target;
      const tagName = target?.tagName;
      const isEditable = target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName);
      const isShortcutCombo = event.key === '?' || (event.key === '/' && event.shiftKey);
      const isAiToggleCombo =
        event.shiftKey &&
        (event.ctrlKey || event.metaKey) &&
        typeof event.key === 'string' &&
        event.key.toLowerCase() === 'a';

      if (isAiToggleCombo) {
        event.preventDefault();
        setAiChatOpen((prev) => !prev);
        return;
      }

      if (isShortcutCombo && !isEditable) {
        event.preventDefault();
        setShowShortcuts((prev) => !prev);
        return;
      }

      if (event.key === 'Escape') {
        setShowShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeydown);

    return () => {
      stopKeepAlive();
      window.removeEventListener('keydown', handleGlobalKeydown);
    };
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="app">
            <Navbar
              user={user}
              onLogout={handleLogout}
              toggleSidebar={toggleSidebar}
              toggleAiChat={toggleAiChat}
            />
            <div className="main-container">
              {user && (
                <Sidebar user={user} className={sidebarOpen ? '' : 'collapsed'} />
              )}
              <div className={`content ${!user || !sidebarOpen ? 'full-width' : ''}`}>
                <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
                  <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login setUser={setUser} />} />
                  <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
                  <Route path="/admin" element={user && user.role === 'admin' ? <Admin /> : <Navigate to="/login" />} />
                  <Route path="/binary-tree" element={<BinaryTree />} />
                  <Route path="/bst" element={<BST />} />
                  <Route path="/binary-search" element={<BinarySearch />} />
                  <Route path="/stack-queue" element={<StackQueue />} />
                  <Route path="/aptitude/:category" element={<AptitudeTest user={user} />} />
                  <Route path="/cnn" element={<CNNVisualizer />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  </Routes>
                </Suspense>
              </div>
            </div>
            <AIChatSidebar isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
            <ShortcutOverlay
              isOpen={showShortcuts}
              onClose={() => setShowShortcuts(false)}
              sections={GLOBAL_SHORTCUT_SECTIONS}
            />
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
