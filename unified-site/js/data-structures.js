// Data Structures Page - Tree, Stack, Queue, Linked List
const DataStructuresPage = {
  state: {
    tree: null,
    stack: [],
    queue: [],
    linkedList: { head: null, size: 0 },
    currentDS: 'tree'
  },
  
  render() {
    return `
      <div class="page">
        <h2>🌳 Data Structures Visualizer</h2>
        
        <div class="control-panel">
          <select id="ds-select">
            <option value="tree">Binary Tree</option>
            <option value="stack">Stack</option>
            <option value="queue">Queue</option>
            <option value="linked-list">Linked List</option>
          </select>
          <label>Value: <input type="text" id="ds-value" placeholder="Enter value"></label>
          <button onclick="DataStructuresPage.insert()">Insert</button>
          <button onclick="DataStructuresPage.remove()">Remove</button>
          <button onclick="DataStructuresPage.traverse()">Traverse</button>
          <button onclick="DataStructuresPage.clear()">Clear</button>
        </div>
        
        <div class="animation-area">
          <div id="ds-display"></div>
        </div>
        
        <div class="info-panel">
          <h3>Data Structure Info</h3>
          <p id="ds-info">Select a data structure to visualize.</p>
        </div>
      </div>
    `;
  },
  
  init() {
    document.getElementById('ds-select').addEventListener('change', (e) => {
      this.state.currentDS = e.target.value;
      this.updateDisplay();
    });
    this.updateDisplay();
  },
  
  insert() {
    const val = document.getElementById('ds-value').value.trim();
    if (!val) return;
    
    const ds = this.state.currentDS;
    
    if (ds === 'tree') {
      this.state.tree = this.insertBST(this.state.tree, parseInt(val));
      this.renderTree();
    } else if (ds === 'stack') {
      this.state.stack.push(val);
      this.renderStack();
    } else if (ds === 'queue') {
      this.state.queue.push(val);
      this.renderQueue();
    } else if (ds === 'linked-list') {
      this.llAppend(val);
      this.renderLinkedList();
    }
    
    document.getElementById('ds-value').value = '';
    document.getElementById('ds-info').textContent = `Added ${val}`;
  },
  
  remove() {
    const ds = this.state.currentDS;
    
    if (ds === 'stack' && this.state.stack.length) {
      const val = this.state.stack.pop();
      this.renderStack();
      document.getElementById('ds-info').textContent = `Removed ${val} from stack`;
    } else if (ds === 'queue' && this.state.queue.length) {
      const val = this.state.queue.shift();
      this.renderQueue();
      document.getElementById('ds-info').textContent = `Removed ${val} from queue`;
    }
  },
  
  traverse() {
    if (this.state.currentDS === 'tree' && this.state.tree) {
      const result = [];
      this.inorder(this.state.tree, result);
      document.getElementById('ds-info').textContent = `Inorder: ${result.join(' → ')}`;
    }
  },
  
  clear() {
    const ds = this.state.currentDS;
    
    if (ds === 'tree') this.state.tree = null;
    else if (ds === 'stack') this.state.stack = [];
    else if (ds === 'queue') this.state.queue = [];
    else if (ds === 'linked-list') this.state.linkedList = { head: null, size: 0 };
    
    this.updateDisplay();
    document.getElementById('ds-info').textContent = 'Cleared';
  },
  
  updateDisplay() {
    const ds = this.state.currentDS;
    
    if (ds === 'tree') this.renderTree();
    else if (ds === 'stack') this.renderStack();
    else if (ds === 'queue') this.renderQueue();
    else if (ds === 'linked-list') this.renderLinkedList();
  },
  
  insertBST(root, val) {
    if (!root) return { val, left: null, right: null };
    if (val < root.val) root.left = this.insertBST(root.left, val);
    else if (val > root.val) root.right = this.insertBST(root.right, val);
    return root;
  },
  
  renderTree() {
    const container = document.getElementById('ds-display');
    container.innerHTML = '<div class="tree-container" id="tree-root"></div>';
    
    if (!this.state.tree) {
      document.getElementById('tree-root').innerHTML = '<p style="color:#999">Empty tree</p>';
      return;
    }
    
    const levels = [];
    const queue = [{node: this.state.tree, level: 0}];
    
    while (queue.length) {
      const {node, level} = queue.shift();
      if (!levels[level]) levels[level] = [];
      levels[level].push(node.val);
      
      if (node.left) queue.push({node: node.left, level: level + 1});
      if (node.right) queue.push({node: node.right, level: level + 1});
    }
    
    const treeRoot = document.getElementById('tree-root');
    levels.forEach(level => {
      const levelDiv = document.createElement('div');
      levelDiv.className = 'tree-level';
      level.forEach(val => {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'node';
        nodeDiv.textContent = val;
        levelDiv.appendChild(nodeDiv);
      });
      treeRoot.appendChild(levelDiv);
    });
  },
  
  renderStack() {
    const container = document.getElementById('ds-display');
    container.innerHTML = '<div style="display:flex;flex-direction:column-reverse;gap:10px;min-height:200px;padding:20px;background:#1e293b;border-radius:8px;" id="stack-items"></div>';
    
    const stackDiv = document.getElementById('stack-items');
    if (!this.state.stack.length) {
      stackDiv.innerHTML = '<p style="color:#999">Empty stack</p>';
      return;
    }
    
    this.state.stack.forEach(val => {
      const el = document.createElement('div');
      el.className = 'element';
      el.textContent = val;
      stackDiv.appendChild(el);
    });
  },
  
  renderQueue() {
    const container = document.getElementById('ds-display');
    container.innerHTML = '<div style="display:flex;gap:10px;min-height:100px;padding:20px;background:#1e293b;border-radius:8px;overflow-x:auto;" id="queue-items"></div>';
    
    const queueDiv = document.getElementById('queue-items');
    if (!this.state.queue.length) {
      queueDiv.innerHTML = '<p style="color:#999">Empty queue</p>';
      return;
    }
    
    this.state.queue.forEach(val => {
      const el = document.createElement('div');
      el.className = 'element';
      el.textContent = val;
      queueDiv.appendChild(el);
    });
  },
  
  llAppend(val) {
    const newNode = {val, next: null};
    if (!this.state.linkedList.head) {
      this.state.linkedList.head = newNode;
    } else {
      let curr = this.state.linkedList.head;
      while (curr.next) curr = curr.next;
      curr.next = newNode;
    }
    this.state.linkedList.size++;
  },
  
  renderLinkedList() {
    const container = document.getElementById('ds-display');
    container.innerHTML = '<div class="array-container" id="ll-items"></div>';
    
    const llDiv = document.getElementById('ll-items');
    if (!this.state.linkedList.head) {
      llDiv.innerHTML = '<p style="color:#999">Empty list</p>';
      return;
    }
    
    let curr = this.state.linkedList.head;
    while (curr) {
      const el = document.createElement('div');
      el.className = 'element';
      el.textContent = curr.val;
      llDiv.appendChild(el);
      
      if (curr.next) {
        const arrow = document.createElement('div');
        arrow.textContent = '→';
        arrow.style.color = 'var(--primary)';
        arrow.style.fontSize = '24px';
        llDiv.appendChild(arrow);
      }
      curr = curr.next;
    }
  },
  
  inorder(node, result) {
    if (!node) return;
    this.inorder(node.left, result);
    result.push(node.val);
    this.inorder(node.right, result);
  }
};
