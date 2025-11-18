// Centralized Route Configuration
// Add/remove/modify routes here instead of editing App.jsx

export const routes = [
  {
    path: '/',
    component: 'Home',
    public: true,
    title: 'Home'
  },
  {
    path: '/login',
    component: 'Login',
    public: true,
    title: 'Login'
  },
  {
    path: '/forgot-password',
    component: 'ForgotPassword',
    public: true,
    title: 'Forgot Password'
  },
  {
    path: '/reset-password/:token',
    component: 'ResetPassword',
    public: true,
    title: 'Reset Password'
  },
  {
    path: '/dashboard',
    component: 'Dashboard',
    protected: true,
    title: 'Dashboard'
  },
  {
    path: '/admin',
    component: 'Admin',
    protected: true,
    adminOnly: true,
    title: 'Admin Panel'
  },
  {
    path: '/binary-tree',
    component: 'BinaryTree',
    public: true,
    title: 'Binary Tree Visualizer',
    category: 'visualizer'
  },
  {
    path: '/bst',
    component: 'BST',
    public: true,
    title: 'Binary Search Tree',
    category: 'visualizer'
  },
  {
    path: '/binary-search',
    component: 'BinarySearch',
    public: true,
    title: 'Binary Search',
    category: 'visualizer'
  },
  {
    path: '/stack-queue',
    component: 'StackQueue',
    public: true,
    title: 'Stack & Queue',
    category: 'visualizer'
  },
  {
    path: '/cnn',
    component: 'CNNVisualizer',
    public: true,
    title: 'CNN Visualizer',
    category: 'visualizer'
  },
  {
    path: '/typing-speed',
    component: 'TypingSpeed',
    public: true,
    title: 'Typing Speed Test',
    category: 'tool'
  },
  {
    path: '/aptitude/:category',
    component: 'AptitudeTest',
    protected: true,
    title: 'Aptitude Test',
    category: 'test'
  },
  {
    path: '/chatbot',
    component: 'Chatbot',
    public: true,
    title: 'AI Chatbot',
    category: 'tool'
  },
  {
    path: '/coding-test',
    component: 'CodingTest',
    public: true,
    title: 'Coding Test',
    category: 'test'
  }
];
