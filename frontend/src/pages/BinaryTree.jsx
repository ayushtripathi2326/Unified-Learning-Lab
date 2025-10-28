import React, { useState, useRef, useEffect } from 'react';
import './BinaryTree.css';

class Node {
  constructor(value, parent = null) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = parent;
  }
}

function BinaryTree() {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const canvasRef = useRef(null);

  const insert = (node, value, parent) => {
    if (node === null) return new Node(value, parent);
    if (value < node.value) node.left = insert(node.left, value, node);
    else if (value > node.value) node.right = insert(node.right, value, node);
    return node;
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return alert('Enter a valid number');
    setRoot(prevRoot => insert(prevRoot, value, null));
    setInputValue('');
  };

  const handleClear = () => {
    setRoot(null);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (root) {
      drawNode(ctx, root, canvas.width / 2, 40, 150);
    }
  }, [root]);

  const drawNode = (ctx, node, x, y, offset) => {
    if (!node) return;

    if (node.left) {
      const childX = x - offset;
      const childY = y + 80;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(childX, childY);
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 2;
      ctx.stroke();
      drawNode(ctx, node.left, childX, childY, offset / 1.7);
    }

    if (node.right) {
      const childX = x + offset;
      const childY = y + 80;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(childX, childY);
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 2;
      ctx.stroke();
      drawNode(ctx, node.right, childX, childY, offset / 1.7);
    }

    ctx.beginPath();
    ctx.arc(x, y, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#007bff';
    ctx.fill();
    ctx.strokeStyle = '#0056b3';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.value, x, y);
  };

  return (
    <div className="binary-tree-page">
      <div className="page-header">
        <h2>🌳 Binary Tree Visualizer</h2>
        <p className="page-subtitle">Build and visualize binary search tree structure in real-time</p>
      </div>
      <div className="controls">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number to insert"
          onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
        />
        <button onClick={handleInsert} className="btn btn-success">Insert Node</button>
        <button onClick={handleClear} className="btn btn-danger">Clear Tree</button>
      </div>
      <div className="tree-canvas-container">
        <canvas ref={canvasRef} width={1200} height={650} className="tree-canvas"></canvas>
      </div>
    </div>
  );
}

export default BinaryTree;
