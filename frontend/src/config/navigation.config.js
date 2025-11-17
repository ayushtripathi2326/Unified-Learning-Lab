// Centralized Navigation Configuration
// Manage sidebar and navbar links here

export const sidebarLinks = [
  {
    id: 'dashboard',
    path: '/dashboard',
    icon: '📊',
    label: 'Dashboard',
    requireAuth: true
  },
  {
    id: 'visualizers',
    label: 'Data Structures',
    icon: '🌳',
    isSection: true,
    children: [
      {
        id: 'binary-tree',
        path: '/binary-tree',
        icon: '🌳',
        label: 'Binary Tree'
      },
      {
        id: 'bst',
        path: '/bst',
        icon: '🔍',
        label: 'Binary Search Tree'
      },
      {
        id: 'binary-search',
        path: '/binary-search',
        icon: '🎯',
        label: 'Binary Search'
      },
      {
        id: 'stack-queue',
        path: '/stack-queue',
        icon: '📚',
        label: 'Stack & Queue'
      }
    ]
  },
  {
    id: 'ml',
    label: 'Machine Learning',
    icon: '🧠',
    isSection: true,
    children: [
      {
        id: 'cnn',
        path: '/cnn',
        icon: '🧠',
        label: 'CNN Visualizer'
      }
    ]
  },
  {
    id: 'tests',
    label: 'Practice Tests',
    icon: '📝',
    isSection: true,
    requireAuth: true,
    children: [
      {
        id: 'aptitude',
        path: '/aptitude/Aptitude',
        icon: '🧮',
        label: 'Aptitude'
      },
      {
        id: 'coding',
        path: '/aptitude/Coding',
        icon: '💻',
        label: 'Coding'
      },
      {
        id: 'gk',
        path: '/aptitude/GK',
        icon: '🌍',
        label: 'General Knowledge'
      },
      {
        id: 'dbms',
        path: '/aptitude/DBMS',
        icon: '🗄️',
        label: 'DBMS'
      },
      {
        id: 'os',
        path: '/aptitude/OS',
        icon: '⚙️',
        label: 'Operating System'
      },
      {
        id: 'networks',
        path: '/aptitude/Networks',
        icon: '🌐',
        label: 'Networks'
      },
      {
        id: 'quantitative',
        path: '/aptitude/Quantitative',
        icon: '📐',
        label: 'Quantitative'
      },
      {
        id: 'verbal',
        path: '/aptitude/Verbal',
        icon: '📖',
        label: 'Verbal'
      }
    ]
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: '🛠️',
    isSection: true,
    children: [
      {
        id: 'typing-speed',
        path: '/typing-speed',
        icon: '⌨️',
        label: 'Typing Speed'
      },
      {
        id: 'chatbot',
        path: '/chatbot',
        icon: '🤖',
        label: 'AI Chatbot'
      }
    ]
  },
  {
    id: 'admin',
    path: '/admin',
    icon: '⚙️',
    label: 'Admin Panel',
    requireAuth: true,
    adminOnly: true
  }
];

export const navbarLinks = [
  {
    id: 'home',
    path: '/',
    label: 'Home',
    public: true
  },
  {
    id: 'visualizers',
    label: 'Visualizers',
    public: true,
    dropdown: [
      { path: '/binary-tree', label: 'Binary Tree' },
      { path: '/bst', label: 'BST' },
      { path: '/binary-search', label: 'Binary Search' },
      { path: '/stack-queue', label: 'Stack & Queue' },
      { path: '/cnn', label: 'CNN Visualizer' }
    ]
  },
  {
    id: 'tools',
    label: 'Tools',
    public: true,
    dropdown: [
      { path: '/typing-speed', label: 'Typing Speed' },
      { path: '/chatbot', label: 'AI Chatbot' }
    ]
  }
];
