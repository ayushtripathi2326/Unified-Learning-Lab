import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import BinaryTree from './pages/BinaryTree';
import BinarySearch from './pages/BinarySearch';
import StackQueue from './pages/StackQueue';
import Stack from './pages/Stack';
import Queue from './pages/Queue';
import LinkedList from './pages/LinkedList';
import HashTable from './pages/HashTable';
import Heap from './pages/Heap';
import SortingVisualizer from './pages/SortingVisualizer';
import SearchingVisualizer from './pages/SearchingVisualizer';
import AptitudeTest from './pages/AptitudeTest';
import CNNVisualizer from './pages/CNNVisualizer';
import TypingSpeed from './pages/TypingSpeed';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import './App.css';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} toggleSidebar={toggleSidebar} />
        <div className="main-container">
          {user && (
            <Sidebar className={sidebarOpen ? '' : 'collapsed'} />
          )}
          <div className={`content ${!user || !sidebarOpen ? 'full-width' : ''}`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
              <Route path="/binary-tree" element={<BinaryTree />} />
              <Route path="/binary-search" element={<BinarySearch />} />
              <Route path="/stack-queue" element={<StackQueue />} />
              <Route path="/stack" element={<Stack />} />
              <Route path="/queue" element={<Queue />} />
              <Route path="/linked-list" element={<LinkedList />} />
              <Route path="/hash-table" element={<HashTable />} />
              <Route path="/heap" element={<Heap />} />
              <Route path="/sorting" element={<SortingVisualizer />} />
              <Route path="/searching" element={<SearchingVisualizer />} />
              <Route path="/aptitude/:category" element={<AptitudeTest user={user} />} />
              <Route path="/cnn" element={<CNNVisualizer />} />
              <Route path="/typing-speed" element={<TypingSpeed />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
