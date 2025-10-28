// Main application controller
const App = {
  currentPage: 'algorithms',
  
  init() {
    this.setupNavigation();
    this.loadPage('algorithms');
  },
  
  setupNavigation() {
    document.querySelectorAll('.main-nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.dataset.page;
        this.loadPage(page);
        
        document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
  },
  
  loadPage(page) {
    this.currentPage = page;
    const container = document.getElementById('app-container');
    
    try {
      switch(page) {
        case 'algorithms':
          container.innerHTML = AlgorithmsPage.render();
          AlgorithmsPage.init();
          break;
        case 'data-structures':
          container.innerHTML = DataStructuresPage.render();
          DataStructuresPage.init();
          break;
        case 'code-visualizer':
          container.innerHTML = CodeVisualizerPage.render();
          CodeVisualizerPage.init();
          break;
        case 'convolution':
          container.innerHTML = ConvolutionPage.render();
          ConvolutionPage.init();
          break;
        case 'advanced-tree':
          container.innerHTML = AdvancedTreePage.render();
          AdvancedTreePage.init();
          break;
        case 'stack-queue':
          container.innerHTML = StackQueuePage.render();
          StackQueuePage.init();
          break;
        case 'cnn3d':
          container.innerHTML = CNN3DPage.render();
          CNN3DPage.init();
          break;
        default:
          container.innerHTML = '<div class="page active"><h2>Page not found</h2><p>The requested page does not exist.</p></div>';
      }
    } catch (error) {
      console.error('Error loading page:', error);
      container.innerHTML = '<div class="page active"><h2>Error</h2><p>Failed to load page. Check console for details.</p></div>';
    }
  }
};

// Utility functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    App.init();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    document.getElementById('app-container').innerHTML = '<div class="page active"><h2>Initialization Error</h2><p>Failed to start the application. Please refresh the page.</p></div>';
  }
});
