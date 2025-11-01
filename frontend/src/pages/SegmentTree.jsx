import React, { useState, useRef, useEffect } from 'react';
import './SegmentTree.css';

function SegmentTree() {
  const [array, setArray] = useState([1, 3, 5, 7, 9, 11]);
  const [segmentTree, setSegmentTree] = useState([]);
  const [inputArray, setInputArray] = useState('1, 3, 5, 7, 9, 11');
  const [queryLeft, setQueryLeft] = useState('');
  const [queryRight, setQueryRight] = useState('');
  const [updateIndex, setUpdateIndex] = useState('');
  const [updateValue, setUpdateValue] = useState('');
  const [message, setMessage] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [queryResult, setQueryResult] = useState(null);
  const [operation, setOperation] = useState('sum'); // sum, min, max
  const canvasRef = useRef(null);

  useEffect(() => {
    buildSegmentTree();
  }, [array, operation]);

  useEffect(() => {
    drawTree();
  }, [segmentTree, highlightedNodes]);

  const buildSegmentTree = () => {
    if (array.length === 0) {
      setSegmentTree([]);
      return;
    }

    const n = array.length;
    const tree = new Array(4 * n).fill(null);

    const build = (node, start, end) => {
      if (start === end) {
        tree[node] = array[start];
      } else {
        const mid = Math.floor((start + end) / 2);
        build(2 * node + 1, start, mid);
        build(2 * node + 2, mid + 1, end);

        if (operation === 'sum') {
          tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        } else if (operation === 'min') {
          tree[node] = Math.min(tree[2 * node + 1], tree[2 * node + 2]);
        } else if (operation === 'max') {
          tree[node] = Math.max(tree[2 * node + 1], tree[2 * node + 2]);
        }
      }
    };

    build(0, 0, n - 1);
    setSegmentTree(tree.filter(val => val !== null));
  };

  const query = (node, start, end, l, r, path = []) => {
    if (r < start || end < l) {
      return operation === 'sum' ? 0 : (operation === 'min' ? Infinity : -Infinity);
    }

    path.push(node);

    if (l <= start && end <= r) {
      return segmentTree[node];
    }

    const mid = Math.floor((start + end) / 2);
    const leftResult = query(2 * node + 1, start, mid, l, r, path);
    const rightResult = query(2 * node + 2, mid + 1, end, l, r, path);

    if (operation === 'sum') {
      return leftResult + rightResult;
    } else if (operation === 'min') {
      return Math.min(leftResult, rightResult);
    } else {
      return Math.max(leftResult, rightResult);
    }
  };

  const update = (node, start, end, idx, val) => {
    if (start === end) {
      segmentTree[node] = val;
    } else {
      const mid = Math.floor((start + end) / 2);
      if (idx <= mid) {
        update(2 * node + 1, start, mid, idx, val);
      } else {
        update(2 * node + 2, mid + 1, end, idx, val);
      }

      if (operation === 'sum') {
        segmentTree[node] = segmentTree[2 * node + 1] + segmentTree[2 * node + 2];
      } else if (operation === 'min') {
        segmentTree[node] = Math.min(segmentTree[2 * node + 1], segmentTree[2 * node + 2]);
      } else {
        segmentTree[node] = Math.max(segmentTree[2 * node + 1], segmentTree[2 * node + 2]);
      }
    }
  };

  const handleBuildTree = () => {
    try {
      const newArray = inputArray.split(',').map(str => {
        const num = parseInt(str.trim());
        if (isNaN(num)) throw new Error('Invalid number');
        return num;
      });

      if (newArray.length === 0) {
        setMessage('❌ Array cannot be empty');
        setTimeout(() => setMessage(''), 2000);
        return;
      }

      if (newArray.length > 12) {
        setMessage('❌ Maximum 12 elements allowed for better visualization');
        setTimeout(() => setMessage(''), 2000);
        return;
      }

      setArray(newArray);
      setMessage(`✅ Segment tree built successfully with ${operation.toUpperCase()} operation`);
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('❌ Invalid array format. Use: 1, 2, 3, 4');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleQuery = async () => {
    const left = parseInt(queryLeft);
    const right = parseInt(queryRight);

    if (isNaN(left) || isNaN(right)) {
      setMessage('❌ Please enter valid indices');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (left < 0 || right >= array.length || left > right) {
      setMessage('❌ Invalid range. Ensure 0 ≤ left ≤ right < array length');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const path = [];
    const result = query(0, 0, array.length - 1, left, right, path);

    // Animate the query path
    setHighlightedNodes([]);
    for (let i = 0; i < path.length; i++) {
      setHighlightedNodes(path.slice(0, i + 1));
      await sleep(400);
    }

    setQueryResult(result);
    setMessage(`✅ ${operation.toUpperCase()} of range [${left}, ${right}] = ${result}`);

    setTimeout(() => {
      setHighlightedNodes([]);
      setQueryResult(null);
      setMessage('');
    }, 3000);
  };

  const handleUpdate = () => {
    const idx = parseInt(updateIndex);
    const val = parseInt(updateValue);

    if (isNaN(idx) || isNaN(val)) {
      setMessage('❌ Please enter valid index and value');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (idx < 0 || idx >= array.length) {
      setMessage('❌ Index out of bounds');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const newArray = [...array];
    newArray[idx] = val;
    setArray(newArray);

    update(0, 0, array.length - 1, idx, val);
    setSegmentTree([...segmentTree]);

    setMessage(`✅ Updated index ${idx} to value ${val}`);
    setUpdateIndex('');
    setUpdateValue('');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleOperationChange = (newOp) => {
    setOperation(newOp);
    setMessage(`🔄 Switched to ${newOp.toUpperCase()} operation`);
    setTimeout(() => setMessage(''), 2000);
  };

  const loadSample = () => {
    setInputArray('2, 5, 1, 4, 9, 3');
    setArray([2, 5, 1, 4, 9, 3]);
    setMessage('✅ Sample array loaded');
    setTimeout(() => setMessage(''), 2000);
  };

  const drawTree = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.fillStyle = '#d84315';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Segment Tree (${operation.toUpperCase()} Operation)`, canvas.width / 2, 25);

    if (segmentTree.length === 0) {
      ctx.fillStyle = '#9e9e9e';
      ctx.font = '20px Arial';
      ctx.fillText('No Segment Tree', canvas.width / 2, canvas.height / 2);
      ctx.font = '16px Arial';
      ctx.fillText('Build a tree from an array', canvas.width / 2, canvas.height / 2 + 30);
      return;
    }

    // Draw original array
    ctx.fillStyle = '#424242';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Original Array:', 100, 60);

    const startX = 250;
    array.forEach((val, idx) => {
      const x = startX + idx * 60;
      ctx.fillStyle = '#ff5722';
      ctx.fillRect(x, 45, 50, 40);
      ctx.strokeStyle = '#d84315';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, 45, 50, 40);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(val.toString(), x + 25, 70);

      ctx.fillStyle = '#757575';
      ctx.font = '11px Arial';
      ctx.fillText(idx.toString(), x + 25, 100);
    });

    // Draw tree nodes
    const levels = Math.ceil(Math.log2(segmentTree.length + 1));
    const startY = 140;
    const levelHeight = 80;

    const drawNode = (index, x, y, width) => {
      if (index >= segmentTree.length || segmentTree[index] === null) return;

      const isHighlighted = highlightedNodes.includes(index);

      // Draw connections to children
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (leftChild < segmentTree.length) {
        const leftX = x - width / 4;
        const childY = y + levelHeight;
        ctx.beginPath();
        ctx.moveTo(x, y + 20);
        ctx.lineTo(leftX, childY - 20);
        ctx.strokeStyle = '#ff7043';
        ctx.lineWidth = 2;
        ctx.stroke();
        drawNode(leftChild, leftX, childY, width / 2);
      }

      if (rightChild < segmentTree.length) {
        const rightX = x + width / 4;
        const childY = y + levelHeight;
        ctx.beginPath();
        ctx.moveTo(x, y + 20);
        ctx.lineTo(rightX, childY - 20);
        ctx.strokeStyle = '#ff7043';
        ctx.lineWidth = 2;
        ctx.stroke();
        drawNode(rightChild, rightX, childY, width / 2);
      }

      // Draw node
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, 2 * Math.PI);
      ctx.fillStyle = isHighlighted ? '#ffd54f' : '#ff5722';
      ctx.fill();
      ctx.strokeStyle = isHighlighted ? '#f57c00' : '#d84315';
      ctx.lineWidth = isHighlighted ? 4 : 3;
      ctx.stroke();

      if (isHighlighted) {
        ctx.beginPath();
        ctx.arc(x, y, 28, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 193, 7, 0.4)';
        ctx.lineWidth = 8;
        ctx.stroke();
      }

      // Draw value
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(segmentTree[index].toString(), x, y);
    };

    drawNode(0, canvas.width / 2, startY, canvas.width * 0.8);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="segment-tree-page">
      <div className="page-header">
        <h2>🌳 Segment Tree</h2>
        <p className="page-subtitle">
          Efficient range query and update data structure
        </p>
      </div>

      {message && (
        <div className={`message-banner ${message.includes('❌') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="operation-selector">
        <h3>🔧 Select Operation Type:</h3>
        <div className="operation-buttons">
          <button
            className={`op-btn ${operation === 'sum' ? 'active' : ''}`}
            onClick={() => handleOperationChange('sum')}
          >
            ➕ Sum
          </button>
          <button
            className={`op-btn ${operation === 'min' ? 'active' : ''}`}
            onClick={() => handleOperationChange('min')}
          >
            ⬇️ Minimum
          </button>
          <button
            className={`op-btn ${operation === 'max' ? 'active' : ''}`}
            onClick={() => handleOperationChange('max')}
          >
            ⬆️ Maximum
          </button>
        </div>
      </div>

      <div className="segment-tree-controls">
        <div className="control-section">
          <h3>🏗️ Build Tree</h3>
          <div className="controls">
            <input
              type="text"
              value={inputArray}
              onChange={(e) => setInputArray(e.target.value)}
              placeholder="Enter array: 1, 2, 3, 4, 5"
            />
            <button onClick={handleBuildTree} className="btn btn-build">
              Build Tree
            </button>
            <button onClick={loadSample} className="btn btn-sample">
              Load Sample
            </button>
          </div>
        </div>

        <div className="control-section">
          <h3>🔍 Range Query</h3>
          <div className="controls">
            <div className="input-row">
              <input
                type="number"
                value={queryLeft}
                onChange={(e) => setQueryLeft(e.target.value)}
                placeholder="Left index"
              />
              <input
                type="number"
                value={queryRight}
                onChange={(e) => setQueryRight(e.target.value)}
                placeholder="Right index"
              />
            </div>
            <button onClick={handleQuery} className="btn btn-query">
              Execute Query
            </button>
          </div>
          {queryResult !== null && (
            <div className="query-result">
              Result: <span className="result-value">{queryResult}</span>
            </div>
          )}
        </div>

        <div className="control-section">
          <h3>✏️ Update Element</h3>
          <div className="controls">
            <div className="input-row">
              <input
                type="number"
                value={updateIndex}
                onChange={(e) => setUpdateIndex(e.target.value)}
                placeholder="Index"
              />
              <input
                type="number"
                value={updateValue}
                onChange={(e) => setUpdateValue(e.target.value)}
                placeholder="New value"
              />
            </div>
            <button onClick={handleUpdate} className="btn btn-update">
              Update
            </button>
          </div>
        </div>
      </div>

      <div className="canvas-visualization">
        <h3>🎨 Tree Visualization</h3>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={1200}
            height={500}
            style={{
              border: '3px solid #ff5722',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
          />
        </div>
      </div>

      <div className="segment-tree-info">
        <div className="info-grid">
          <div className="info-card">
            <h4>📊 Tree Statistics</h4>
            <div className="stat-item">
              <span className="stat-label">Array Size:</span>
              <span className="stat-value">{array.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tree Nodes:</span>
              <span className="stat-value">{segmentTree.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Operation:</span>
              <span className="stat-value">{operation.toUpperCase()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tree Height:</span>
              <span className="stat-value">{segmentTree.length > 0 ? Math.ceil(Math.log2(segmentTree.length + 1)) : 0}</span>
            </div>
          </div>

          <div className="info-card">
            <h4>⏱️ Time Complexity</h4>
            <div className="complexity-item">
              <span className="complexity-label">Build Tree:</span>
              <span className="complexity-badge">O(n)</span>
            </div>
            <div className="complexity-item">
              <span className="complexity-label">Range Query:</span>
              <span className="complexity-badge">O(log n)</span>
            </div>
            <div className="complexity-item">
              <span className="complexity-label">Update:</span>
              <span className="complexity-badge">O(log n)</span>
            </div>
            <div className="complexity-item">
              <span className="complexity-label">Space:</span>
              <span className="complexity-badge">O(4n)</span>
            </div>
          </div>

          <div className="info-card">
            <h4>📝 Operations</h4>
            <ul className="operations-list">
              <li><strong>Sum:</strong> Find sum of elements in range [L, R]</li>
              <li><strong>Min:</strong> Find minimum element in range [L, R]</li>
              <li><strong>Max:</strong> Find maximum element in range [L, R]</li>
              <li><strong>Update:</strong> Change value at specific index</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>💡 Segment Tree Applications</h3>
        <div className="applications-grid">
          <div className="application-card">
            <h4>📈 Range Sum Query</h4>
            <p>
              Efficiently calculate sum of elements in any subarray.
              Used in financial data analysis and cumulative statistics.
            </p>
          </div>
          <div className="application-card">
            <h4>🔢 Range Min/Max Query</h4>
            <p>
              Find minimum or maximum value in a range quickly.
              Applied in competitive programming and optimization problems.
            </p>
          </div>
          <div className="application-card">
            <h4>🎯 Dynamic Programming</h4>
            <p>
              Solve DP problems with range queries efficiently.
              Used in interval scheduling and resource allocation.
            </p>
          </div>
          <div className="application-card">
            <h4>🌐 Computational Geometry</h4>
            <p>
              Range queries on geometric data structures.
              Applied in GIS systems and spatial databases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SegmentTree;
