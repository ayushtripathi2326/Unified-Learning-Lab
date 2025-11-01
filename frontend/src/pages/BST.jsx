import React, { useState, useRef, useEffect } from 'react';
import './BST.css';

class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function BST() {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [traversalResult, setTraversalResult] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [message, setMessage] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    drawTree();
  }, [root, highlightedNodes]);

  const drawTree = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!root) {
      ctx.fillStyle = '#9e9e9e';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Binary Search Tree is Empty', canvas.width / 2, canvas.height / 2);
      ctx.font = '16px Arial';
      ctx.fillText('Insert nodes to visualize the tree', canvas.width / 2, canvas.height / 2 + 30);
      return;
    }

    // Draw title
    ctx.fillStyle = '#1976d2';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Binary Search Tree', canvas.width / 2, 25);

    drawNode(ctx, root, canvas.width / 2, 60, canvas.width / 4);
  };

  const drawNode = (ctx, node, x, y, offset) => {
    if (!node) return;

    const isHighlighted = highlightedNodes.includes(node.value);

    // Draw edges to children first
    if (node.left) {
      const childX = x - offset;
      const childY = y + 80;

      // Draw line
      ctx.beginPath();
      ctx.moveTo(x, y + 25);
      ctx.lineTo(childX, childY - 25);
      ctx.strokeStyle = '#757575';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw "L" label
      ctx.fillStyle = '#757575';
      ctx.font = '12px Arial';
      ctx.fillText('L', (x + childX) / 2 - 10, (y + childY) / 2);

      drawNode(ctx, node.left, childX, childY, offset / 2);
    }

    if (node.right) {
      const childX = x + offset;
      const childY = y + 80;

      // Draw line
      ctx.beginPath();
      ctx.moveTo(x, y + 25);
      ctx.lineTo(childX, childY - 25);
      ctx.strokeStyle = '#757575';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw "R" label
      ctx.fillStyle = '#757575';
      ctx.font = '12px Arial';
      ctx.fillText('R', (x + childX) / 2 + 10, (y + childY) / 2);

      drawNode(ctx, node.right, childX, childY, offset / 2);
    }

    // Draw node circle
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, 2 * Math.PI);
    ctx.fillStyle = isHighlighted ? '#ff9800' : '#2196f3';
    ctx.fill();
    ctx.strokeStyle = isHighlighted ? '#f57c00' : '#1565c0';
    ctx.lineWidth = isHighlighted ? 4 : 3;
    ctx.stroke();

    // Draw glow for highlighted nodes
    if (isHighlighted) {
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255, 152, 0, 0.4)';
      ctx.lineWidth = 8;
      ctx.stroke();
    }

    // Draw node value
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.value.toString(), x, y);
  };

  const insert = (node, value) => {
    if (node === null) {
      return new BSTNode(value);
    }

    if (value < node.value) {
      node.left = insert(node.left, value);
    } else if (value > node.value) {
      node.right = insert(node.right, value);
    }

    return node;
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setMessage('❌ Please enter a valid number');
      return;
    }

    if (search(root, value)) {
      setMessage(`⚠️ Value ${value} already exists in the tree`);
      return;
    }

    setRoot(prevRoot => {
      const newRoot = insert(prevRoot, value);
      setMessage(`✅ Inserted ${value} successfully`);
      return { ...newRoot };
    });
    setInputValue('');

    setTimeout(() => setMessage(''), 3000);
  };

  const search = (node, value) => {
    if (node === null) return false;
    if (node.value === value) return true;
    if (value < node.value) return search(node.left, value);
    return search(node.right, value);
  };

  const handleSearch = async () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      setMessage('❌ Please enter a valid number to search');
      return;
    }

    setHighlightedNodes([]);
    const path = [];
    let current = root;
    let found = false;

    while (current) {
      path.push(current.value);
      setHighlightedNodes([...path]);
      await sleep(600);

      if (current.value === value) {
        found = true;
        setMessage(`✅ Found ${value} in the tree!`);
        break;
      } else if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    if (!found) {
      setMessage(`❌ Value ${value} not found in the tree`);
    }

    setTimeout(() => {
      setHighlightedNodes([]);
      setMessage('');
    }, 2000);
  };

  const deleteNode = (node, value) => {
    if (node === null) return null;

    if (value < node.value) {
      node.left = deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = deleteNode(node.right, value);
    } else {
      // Node to delete found

      // Case 1: Node with no children
      if (node.left === null && node.right === null) {
        return null;
      }

      // Case 2: Node with one child
      if (node.left === null) {
        return node.right;
      }
      if (node.right === null) {
        return node.left;
      }

      // Case 3: Node with two children
      // Find inorder successor (minimum in right subtree)
      let successor = node.right;
      while (successor.left !== null) {
        successor = successor.left;
      }

      node.value = successor.value;
      node.right = deleteNode(node.right, successor.value);
    }

    return node;
  };

  const handleDelete = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      setMessage('❌ Please enter a valid number to delete');
      return;
    }

    if (!search(root, value)) {
      setMessage(`❌ Value ${value} not found in the tree`);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setRoot(prevRoot => {
      const newRoot = deleteNode({ ...prevRoot }, value);
      setMessage(`🗑️ Deleted ${value} successfully`);
      setTimeout(() => setMessage(''), 3000);
      return newRoot;
    });
    setSearchValue('');
  };

  const inorderTraversal = (node, result = []) => {
    if (node) {
      inorderTraversal(node.left, result);
      result.push(node.value);
      inorderTraversal(node.right, result);
    }
    return result;
  };

  const preorderTraversal = (node, result = []) => {
    if (node) {
      result.push(node.value);
      preorderTraversal(node.left, result);
      preorderTraversal(node.right, result);
    }
    return result;
  };

  const postorderTraversal = (node, result = []) => {
    if (node) {
      postorderTraversal(node.left, result);
      postorderTraversal(node.right, result);
      result.push(node.value);
    }
    return result;
  };

  const handleTraversal = (type) => {
    if (!root) {
      setMessage('⚠️ Tree is empty');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    let result = [];
    switch (type) {
      case 'inorder':
        result = inorderTraversal(root);
        setTraversalResult(`Inorder (Left-Root-Right): ${result.join(' → ')}`);
        break;
      case 'preorder':
        result = preorderTraversal(root);
        setTraversalResult(`Preorder (Root-Left-Right): ${result.join(' → ')}`);
        break;
      case 'postorder':
        result = postorderTraversal(root);
        setTraversalResult(`Postorder (Left-Right-Root): ${result.join(' → ')}`);
        break;
      default:
        break;
    }
  };

  const getHeight = (node) => {
    if (node === null) return 0;
    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
  };

  const getNodeCount = (node) => {
    if (node === null) return 0;
    return 1 + getNodeCount(node.left) + getNodeCount(node.right);
  };

  const findMin = (node) => {
    if (!node) return null;
    while (node.left) {
      node = node.left;
    }
    return node.value;
  };

  const findMax = (node) => {
    if (!node) return null;
    while (node.right) {
      node = node.right;
    }
    return node.value;
  };

  const handleClear = () => {
    setRoot(null);
    setTraversalResult('');
    setHighlightedNodes([]);
    setMessage('🧹 Tree cleared');
    setTimeout(() => setMessage(''), 2000);
  };

  const createSampleTree = () => {
    const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];
    let newRoot = null;
    values.forEach(value => {
      newRoot = insert(newRoot, value);
    });
    setRoot(newRoot);
    setMessage('✅ Sample tree created');
    setTimeout(() => setMessage(''), 2000);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="bst-page">
      <div className="page-header">
        <h2>🌲 Binary Search Tree (BST)</h2>
        <p className="page-subtitle">
          Ordered binary tree with efficient search, insert, and delete operations
        </p>
      </div>

      {message && (
        <div className={`message-banner ${message.includes('❌') || message.includes('⚠️') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="bst-controls">
        <div className="control-section">
          <h3>➕ Insert Node</h3>
          <div className="controls">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value to insert"
              onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
            />
            <button onClick={handleInsert} className="btn btn-insert">
              Insert
            </button>
          </div>
        </div>

        <div className="control-section">
          <h3>🔍 Search / Delete</h3>
          <div className="controls">
            <input
              type="number"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Enter value"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="btn btn-search">
              Search
            </button>
            <button onClick={handleDelete} className="btn btn-delete">
              Delete
            </button>
          </div>
        </div>

        <div className="control-section">
          <h3>🔄 Traversals</h3>
          <div className="controls">
            <button onClick={() => handleTraversal('inorder')} className="btn btn-traversal">
              Inorder
            </button>
            <button onClick={() => handleTraversal('preorder')} className="btn btn-traversal">
              Preorder
            </button>
            <button onClick={() => handleTraversal('postorder')} className="btn btn-traversal">
              Postorder
            </button>
          </div>
        </div>

        <div className="control-section">
          <h3>🎨 Actions</h3>
          <div className="controls">
            <button onClick={createSampleTree} className="btn btn-sample">
              Load Sample
            </button>
            <button onClick={handleClear} className="btn btn-clear">
              Clear Tree
            </button>
          </div>
        </div>
      </div>

      {traversalResult && (
        <div className="traversal-result">
          <h4>📊 Traversal Result:</h4>
          <p>{traversalResult}</p>
        </div>
      )}

      <div className="canvas-visualization">
        <h3>🎨 Tree Visualization</h3>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={1000}
            height={500}
            style={{
              border: '3px solid #1976d2',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
          />
        </div>
      </div>

      <div className="bst-info">
        <div className="info-grid">
          <div className="info-card">
            <h4>📊 Tree Statistics</h4>
            <div className="stat-item">
              <span className="stat-label">Root:</span>
              <span className="stat-value">{root ? root.value : 'N/A'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Nodes:</span>
              <span className="stat-value">{getNodeCount(root)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Height:</span>
              <span className="stat-value">{getHeight(root)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Min Value:</span>
              <span className="stat-value">{findMin(root) ?? 'N/A'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Max Value:</span>
              <span className="stat-value">{findMax(root) ?? 'N/A'}</span>
            </div>
          </div>

          <div className="info-card">
            <h4>📝 BST Properties</h4>
            <ul className="properties-list">
              <li>✅ Left subtree contains values less than root</li>
              <li>✅ Right subtree contains values greater than root</li>
              <li>✅ Both left and right subtrees are also BSTs</li>
              <li>✅ No duplicate values allowed</li>
              <li>✅ Inorder traversal gives sorted order</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>⏱️ Time Complexity</h4>
            <div className="complexity-item">
              <span className="complexity-label">Search:</span>
              <span className="complexity-badge">O(h)</span>
            </div>
            <div className="complexity-item">
              <span className="complexity-label">Insert:</span>
              <span className="complexity-badge">O(h)</span>
            </div>
            <div className="complexity-item">
              <span className="complexity-label">Delete:</span>
              <span className="complexity-badge">O(h)</span>
            </div>
            <div className="complexity-item">
              <span className="complexity-label">Traversal:</span>
              <span className="complexity-badge">O(n)</span>
            </div>
            <p className="complexity-note">
              h = height of tree<br />
              Best case: O(log n) (balanced)<br />
              Worst case: O(n) (skewed)
            </p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>💡 BST Operations</h3>
        <div className="operations-grid">
          <div className="operation-card">
            <h4>Insert Operation</h4>
            <p>
              Start from root, compare value. Go left if smaller, right if larger.
              Insert at first empty spot found.
            </p>
          </div>
          <div className="operation-card">
            <h4>Search Operation</h4>
            <p>
              Compare search value with current node. Navigate left or right
              based on comparison until found or reach null.
            </p>
          </div>
          <div className="operation-card">
            <h4>Delete Operation</h4>
            <p>
              Three cases: no children (remove), one child (replace with child),
              two children (replace with inorder successor).
            </p>
          </div>
          <div className="operation-card">
            <h4>Inorder Traversal</h4>
            <p>
              Visit left subtree, then root, then right subtree.
              Produces sorted sequence for BST.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BST;
