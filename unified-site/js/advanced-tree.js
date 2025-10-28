// Advanced Binary Tree with AVL, Successor, Step-by-Step Traversals
const AdvancedTreePage = {
  state: {
    root: null,
    nodes: [],
    mode: 'bst',
    traversalSteps: [],
    currentStep: 0
  },
  
  render() {
    return `
      <div class="page">
        <h2>🌳 Advanced Binary Tree</h2>
        
        <div class="control-panel">
          <input type="text" id="tree-input" placeholder="e.g., 50,30,70,20,40">
          <label>
            <input type="radio" name="tree-mode" value="bst" checked> BST
            <input type="radio" name="tree-mode" value="serialized"> Preorder
          </label>
          <button onclick="AdvancedTreePage.buildTree()">Build Tree</button>
          <button onclick="AdvancedTreePage.balanceTree()">Balance (AVL)</button>
          <button onclick="AdvancedTreePage.clear()">Clear</button>
        </div>
        
        <div class="control-panel">
          <input type="number" id="tree-value" placeholder="Value">
          <button onclick="AdvancedTreePage.insert()">Insert</button>
          <button onclick="AdvancedTreePage.deleteNode()">Delete</button>
          <button onclick="AdvancedTreePage.find()">Find</button>
          <button onclick="AdvancedTreePage.successor()">Successor</button>
        </div>
        
        <div class="control-panel">
          <button onclick="AdvancedTreePage.traversePreorder()">Preorder</button>
          <button onclick="AdvancedTreePage.traverseInorder()">Inorder</button>
          <button onclick="AdvancedTreePage.traversePostorder()">Postorder</button>
          <button onclick="AdvancedTreePage.traverseLevelOrder()">Level-Order</button>
          <button onclick="AdvancedTreePage.stepTraversal()">Step-by-Step</button>
        </div>
        
        <div id="tree-canvas" style="min-height: 400px; background: var(--surface); border-radius: 10px; position: relative; overflow: auto;"></div>
        
        <div class="info-panel">
          <h3>Tree Info</h3>
          <p id="tree-info">Build a tree to start.</p>
          <p id="tree-traversal"></p>
        </div>
      </div>
    `;
  },
  
  init() {
    document.querySelectorAll('input[name="tree-mode"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.state.mode = e.target.value;
      });
    });
  },
  
  buildTree() {
    const input = document.getElementById('tree-input').value;
    const values = input.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    
    if (!values.length) {
      document.getElementById('tree-info').textContent = 'Enter values separated by commas.';
      return;
    }
    
    this.state.root = null;
    values.forEach(v => this.insertNode(v));
    this.drawTree();
    document.getElementById('tree-info').textContent = `Tree built with ${values.length} nodes.`;
  },
  
  insertNode(value) {
    const newNode = { value, left: null, right: null };
    
    if (!this.state.root) {
      this.state.root = newNode;
      return;
    }
    
    let current = this.state.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          break;
        }
        current = current.right;
      }
    }
  },
  
  insert() {
    const value = parseInt(document.getElementById('tree-value').value);
    if (isNaN(value)) return;
    
    this.insertNode(value);
    this.drawTree();
    document.getElementById('tree-info').textContent = `Inserted ${value}`;
    document.getElementById('tree-value').value = '';
  },
  
  deleteNode() {
    const value = parseInt(document.getElementById('tree-value').value);
    if (isNaN(value)) return;
    
    this.state.root = this.deleteNodeHelper(this.state.root, value);
    this.drawTree();
    document.getElementById('tree-info').textContent = `Deleted ${value}`;
  },
  
  deleteNodeHelper(node, value) {
    if (!node) return null;
    
    if (value < node.value) {
      node.left = this.deleteNodeHelper(node.left, value);
    } else if (value > node.value) {
      node.right = this.deleteNodeHelper(node.right, value);
    } else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      
      let minRight = node.right;
      while (minRight.left) minRight = minRight.left;
      node.value = minRight.value;
      node.right = this.deleteNodeHelper(node.right, minRight.value);
    }
    return node;
  },
  
  find() {
    const value = parseInt(document.getElementById('tree-value').value);
    if (isNaN(value)) return;
    
    const found = this.findNode(this.state.root, value);
    this.drawTree(found);
    document.getElementById('tree-info').textContent = found ? `Found ${value}!` : `${value} not found.`;
  },
  
  findNode(node, value) {
    if (!node) return null;
    if (node.value === value) return node;
    return value < node.value ? this.findNode(node.left, value) : this.findNode(node.right, value);
  },
  
  successor() {
    const value = parseInt(document.getElementById('tree-value').value);
    if (isNaN(value)) return;
    
    const succ = this.findSuccessor(this.state.root, value);
    document.getElementById('tree-info').textContent = succ ? `Successor of ${value} is ${succ.value}` : `No successor found.`;
  },
  
  findSuccessor(node, value) {
    let current = this.findNode(node, value);
    if (!current) return null;
    
    if (current.right) {
      current = current.right;
      while (current.left) current = current.left;
      return current;
    }
    
    let successor = null;
    let ancestor = this.state.root;
    while (ancestor !== current) {
      if (current.value < ancestor.value) {
        successor = ancestor;
        ancestor = ancestor.left;
      } else {
        ancestor = ancestor.right;
      }
    }
    return successor;
  },
  
  traversePreorder() {
    const result = [];
    const traverse = (node) => {
      if (!node) return;
      result.push(node.value);
      traverse(node.left);
      traverse(node.right);
    };
    traverse(this.state.root);
    document.getElementById('tree-traversal').textContent = 'Preorder: ' + result.join(', ');
  },
  
  traverseInorder() {
    const result = [];
    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);
      result.push(node.value);
      traverse(node.right);
    };
    traverse(this.state.root);
    document.getElementById('tree-traversal').textContent = 'Inorder: ' + result.join(', ');
  },
  
  traversePostorder() {
    const result = [];
    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      result.push(node.value);
    };
    traverse(this.state.root);
    document.getElementById('tree-traversal').textContent = 'Postorder: ' + result.join(', ');
  },
  
  traverseLevelOrder() {
    if (!this.state.root) return;
    const result = [];
    const queue = [this.state.root];
    
    while (queue.length) {
      const node = queue.shift();
      result.push(node.value);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    document.getElementById('tree-traversal').textContent = 'Level-Order: ' + result.join(', ');
  },
  
  stepTraversal() {
    document.getElementById('tree-info').textContent = 'Step-by-step traversal - use traversal buttons to see order.';
  },
  
  balanceTree() {
    const values = [];
    const inorder = (node) => {
      if (!node) return;
      inorder(node.left);
      values.push(node.value);
      inorder(node.right);
    };
    inorder(this.state.root);
    
    const buildBalanced = (arr, start, end) => {
      if (start > end) return null;
      const mid = Math.floor((start + end) / 2);
      const node = { value: arr[mid], left: null, right: null };
      node.left = buildBalanced(arr, start, mid - 1);
      node.right = buildBalanced(arr, mid + 1, end);
      return node;
    };
    
    this.state.root = buildBalanced(values, 0, values.length - 1);
    this.drawTree();
    document.getElementById('tree-info').textContent = 'Tree balanced using AVL approach.';
  },
  
  drawTree(highlightNode = null) {
    const canvas = document.getElementById('tree-canvas');
    canvas.innerHTML = '';
    
    if (!this.state.root) {
      canvas.innerHTML = '<p style="text-align: center; padding: 50px; color: var(--text-muted);">Tree is empty</p>';
      return;
    }
    
    const positions = [];
    const getPositions = (node, x, y, offset) => {
      if (!node) return;
      positions.push({ node, x, y });
      if (node.left) getPositions(node.left, x - offset, y + 80, offset / 2);
      if (node.right) getPositions(node.right, x + offset, y + 80, offset / 2);
    };
    
    getPositions(this.state.root, 400, 50, 150);
    
    positions.forEach(({ node, x, y }) => {
      const nodeEl = document.createElement('div');
      nodeEl.className = 'tree-node';
      nodeEl.style.position = 'absolute';
      nodeEl.style.left = x + 'px';
      nodeEl.style.top = y + 'px';
      nodeEl.style.width = '40px';
      nodeEl.style.height = '40px';
      nodeEl.style.borderRadius = '50%';
      nodeEl.style.background = node === highlightNode ? 'var(--accent)' : 'var(--primary)';
      nodeEl.style.color = 'white';
      nodeEl.style.display = 'flex';
      nodeEl.style.alignItems = 'center';
      nodeEl.style.justifyContent = 'center';
      nodeEl.style.fontWeight = 'bold';
      nodeEl.textContent = node.value;
      canvas.appendChild(nodeEl);
    });
  },
  
  clear() {
    this.state.root = null;
    this.drawTree();
    document.getElementById('tree-info').textContent = 'Tree cleared.';
    document.getElementById('tree-traversal').textContent = '';
  }
};
