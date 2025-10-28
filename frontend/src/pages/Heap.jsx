import React, { useState } from 'react';
import './Heap.css';

function Heap() {
  const [heap, setHeap] = useState([]);
  const [input, setInput] = useState('');
  const [heapType, setHeapType] = useState('min'); // 'min' or 'max'

  const getParentIndex = (i) => Math.floor((i - 1) / 2);
  const getLeftChildIndex = (i) => 2 * i + 1;
  const getRightChildIndex = (i) => 2 * i + 2;

  const swap = (arr, i, j) => {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  };

  const heapifyUp = (arr, index) => {
    if (index === 0) return;
    const parentIndex = getParentIndex(index);

    if (heapType === 'min') {
      if (arr[index] < arr[parentIndex]) {
        swap(arr, index, parentIndex);
        heapifyUp(arr, parentIndex);
      }
    } else {
      if (arr[index] > arr[parentIndex]) {
        swap(arr, index, parentIndex);
        heapifyUp(arr, parentIndex);
      }
    }
  };

  const heapifyDown = (arr, index) => {
    const leftIndex = getLeftChildIndex(index);
    const rightIndex = getRightChildIndex(index);
    let targetIndex = index;

    if (heapType === 'min') {
      if (leftIndex < arr.length && arr[leftIndex] < arr[targetIndex]) {
        targetIndex = leftIndex;
      }
      if (rightIndex < arr.length && arr[rightIndex] < arr[targetIndex]) {
        targetIndex = rightIndex;
      }
    } else {
      if (leftIndex < arr.length && arr[leftIndex] > arr[targetIndex]) {
        targetIndex = leftIndex;
      }
      if (rightIndex < arr.length && arr[rightIndex] > arr[targetIndex]) {
        targetIndex = rightIndex;
      }
    }

    if (targetIndex !== index) {
      swap(arr, index, targetIndex);
      heapifyDown(arr, targetIndex);
    }
  };

  const insert = () => {
    const value = parseInt(input);
    if (!isNaN(value)) {
      const newHeap = [...heap, value];
      heapifyUp(newHeap, newHeap.length - 1);
      setHeap(newHeap);
      setInput('');
    }
  };

  const extractRoot = () => {
    if (heap.length === 0) {
      alert('Heap is empty!');
      return;
    }

    const root = heap[0];
    const newHeap = [...heap];
    newHeap[0] = newHeap[newHeap.length - 1];
    newHeap.pop();

    if (newHeap.length > 0) {
      heapifyDown(newHeap, 0);
    }

    setHeap(newHeap);
    alert(`${heapType === 'min' ? 'Minimum' : 'Maximum'} value extracted: ${root}`);
  };

  const peek = () => {
    if (heap.length === 0) {
      alert('Heap is empty!');
    } else {
      alert(`${heapType === 'min' ? 'Minimum' : 'Maximum'} value: ${heap[0]}`);
    }
  };

  const buildHeap = () => {
    const values = input.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    if (values.length > 0) {
      const newHeap = [...values];
      for (let i = Math.floor(newHeap.length / 2) - 1; i >= 0; i--) {
        heapifyDown(newHeap, i);
      }
      setHeap(newHeap);
      setInput('');
    }
  };

  const switchHeapType = () => {
    const newType = heapType === 'min' ? 'max' : 'min';
    setHeapType(newType);

    // Rebuild heap with new type
    if (heap.length > 0) {
      const newHeap = [...heap];
      for (let i = Math.floor(newHeap.length / 2) - 1; i >= 0; i--) {
        heapifyDown(newHeap, i);
      }
      setHeap(newHeap);
    }
  };

  const getLevel = (index) => Math.floor(Math.log2(index + 1));

  const renderTreeNode = (index) => {
    if (index >= heap.length) return null;

    const level = getLevel(index);
    const leftChild = getLeftChildIndex(index);
    const rightChild = getRightChildIndex(index);

    return (
      <div key={index} className="tree-node-container">
        <div
          className={`tree-node ${index === 0 ? 'root' : ''}`}
          style={{ '--node-index': index }}
        >
          <div className="node-value">{heap[index]}</div>
          <div className="node-label">Index: {index}</div>
        </div>
        {(leftChild < heap.length || rightChild < heap.length) && (
          <div className="children-container">
            {leftChild < heap.length && (
              <div className="child-wrapper">
                <div className="connector left-connector"></div>
                {renderTreeNode(leftChild)}
              </div>
            )}
            {rightChild < heap.length && (
              <div className="child-wrapper">
                <div className="connector right-connector"></div>
                {renderTreeNode(rightChild)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`heap-page ${heapType}-heap`}>
      <div className="page-header">
        <h2>🔺 Heap Visualizer</h2>
        <p className="page-subtitle">Complete binary tree with heap property for efficient priority operations</p>
        <div className="heap-type-badge">
          Current Type: <strong>{heapType === 'min' ? 'MIN HEAP' : 'MAX HEAP'}</strong>
        </div>
      </div>

      <div className="controls-container">
        <div className="control-group">
          <h3>➕ Insert Operations</h3>
          <div className="controls">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter number"
              type="number"
              onKeyPress={(e) => e.key === 'Enter' && insert()}
            />
            <button onClick={insert} className="btn btn-insert">Insert</button>
            <button onClick={buildHeap} className="btn btn-build">Build from Array</button>
          </div>
          <p className="hint">💡 For array: Enter comma-separated values (e.g., 5,3,8,1,9)</p>
        </div>

        <div className="control-group">
          <h3>🔧 Heap Operations</h3>
          <div className="controls">
            <button onClick={extractRoot} className="btn btn-extract">
              Extract {heapType === 'min' ? 'Min' : 'Max'}
            </button>
            <button onClick={peek} className="btn btn-peek">Peek Root</button>
            <button onClick={switchHeapType} className="btn btn-switch">
              Switch to {heapType === 'min' ? 'Max' : 'Min'} Heap
            </button>
            <button onClick={() => setHeap([])} className="btn btn-clear">Clear</button>
          </div>
          <div className="info-panel">
            <div className="info-item">
              <span className="info-label">Size:</span>
              <span className="info-value">{heap.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Root:</span>
              <span className="info-value">{heap.length > 0 ? heap[0] : 'Empty'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Height:</span>
              <span className="info-value">{heap.length > 0 ? Math.floor(Math.log2(heap.length)) + 1 : 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="heap-visualization">
        <h3>🌳 Heap Tree Structure</h3>
        <div className="tree-container">
          {heap.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🗑️</span>
              <p>Heap is empty</p>
              <p className="hint">Insert numbers to build the heap</p>
            </div>
          ) : (
            <div className="tree-wrapper">
              {renderTreeNode(0)}
            </div>
          )}
        </div>
      </div>

      <div className="array-representation">
        <h3>📊 Array Representation</h3>
        <div className="array-container">
          {heap.length === 0 ? (
            <div className="empty-array">[ ]</div>
          ) : (
            heap.map((value, index) => (
              <div key={index} className="array-item" style={{ '--item-index': index }}>
                <div className="array-value">{value}</div>
                <div className="array-index">[{index}]</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="info-section">
        <div className="section-half">
          <h3>💡 Heap Operations</h3>
          <div className="operations-grid">
            <div className="operation-card">
              <h4>Insert</h4>
              <p>Add element and heapify up to maintain property</p>
              <span className="complexity">O(log n)</span>
            </div>
            <div className="operation-card">
              <h4>Extract Root</h4>
              <p>Remove root (min/max) and heapify down</p>
              <span className="complexity">O(log n)</span>
            </div>
            <div className="operation-card">
              <h4>Peek</h4>
              <p>View root element without removal</p>
              <span className="complexity">O(1)</span>
            </div>
            <div className="operation-card">
              <h4>Build Heap</h4>
              <p>Create heap from unsorted array</p>
              <span className="complexity">O(n)</span>
            </div>
          </div>
        </div>

        <div className="section-half">
          <h3>🎯 Heap Properties</h3>
          <div className="properties-grid">
            <div className="property-card">
              <div className="property-icon">🔻</div>
              <h4>Min Heap</h4>
              <p>Parent ≤ Children<br/>Smallest at root</p>
            </div>
            <div className="property-card">
              <div className="property-icon">🔺</div>
              <h4>Max Heap</h4>
              <p>Parent ≥ Children<br/>Largest at root</p>
            </div>
            <div className="property-card">
              <div className="property-icon">🌳</div>
              <h4>Complete Tree</h4>
              <p>All levels filled except possibly last</p>
            </div>
            <div className="property-card">
              <div className="property-icon">📐</div>
              <h4>Parent Formula</h4>
              <p>parent(i) = ⌊(i-1)/2⌋<br/>left(i) = 2i+1, right(i) = 2i+2</p>
            </div>
          </div>
        </div>
      </div>

      <div className="use-cases-section">
        <h3>🚀 Real-World Applications</h3>
        <div className="use-cases-grid">
          <div className="use-case-card">
            <span className="use-case-icon">⚡</span>
            <h4>Priority Queue</h4>
            <p>Task scheduling, job queues, event management</p>
          </div>
          <div className="use-case-card">
            <span className="use-case-icon">📈</span>
            <h4>Heap Sort</h4>
            <p>Efficient O(n log n) sorting algorithm</p>
          </div>
          <div className="use-case-card">
            <span className="use-case-icon">🔀</span>
            <h4>Graph Algorithms</h4>
            <p>Dijkstra's shortest path, Prim's MST</p>
          </div>
          <div className="use-case-card">
            <span className="use-case-icon">📊</span>
            <h4>Statistics</h4>
            <p>Finding kth largest/smallest element, median</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Heap;
