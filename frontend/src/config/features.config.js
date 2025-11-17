// Feature Flags and Settings
// Enable/disable features without code changes

export const features = {
  // Authentication
  auth: {
    enabled: true,
    allowRegistration: true,
    requireEmailVerification: false,
    passwordReset: true
  },

  // AI Features
  ai: {
    chatbot: true,
    aiSidebar: true,
    shortcuts: {
      toggleAI: ['Ctrl', 'Shift', 'A'],
      sendMessage: ['Ctrl', 'Enter']
    }
  },

  // Tests
  tests: {
    enabled: true,
    categories: ['Aptitude', 'Coding', 'GK', 'DBMS', 'OS', 'Networks', 'Quantitative', 'Verbal'],
    timeLimit: true,
    showResults: true,
    allowRetake: true
  },

  // Visualizers
  visualizers: {
    binaryTree: true,
    bst: true,
    binarySearch: true,
    stackQueue: true,
    cnn: true
  },

  // Tools
  tools: {
    typingSpeed: true,
    chatbot: true
  },

  // Admin
  admin: {
    enabled: true,
    questionManagement: true,
    userManagement: true,
    bulkUpload: true
  },

  // UI Features
  ui: {
    darkMode: true,
    sidebar: true,
    shortcuts: true,
    animations: true,
    notifications: true
  },

  // Performance
  performance: {
    lazyLoading: true,
    keepAlive: true,
    backendWakeup: true
  }
};

// App Metadata
export const appConfig = {
  name: 'Unified Learning Lab',
  version: '1.0.0',
  description: 'A comprehensive full-stack learning platform',
  author: 'Your Team',
  
  // Contact & Support
  support: {
    email: 'support@learninglab.com',
    docs: '/docs',
    github: 'https://github.com/ayushtripathi2326/Unified-Learning-Lab'
  },

  // API Configuration
  api: {
    timeout: 30000,
    retries: 3,
    keepAliveInterval: 14 * 60 * 1000 // 14 minutes
  },

  // UI Settings
  ui: {
    itemsPerPage: 10,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['.json'],
    toastDuration: 3000
  }
};
