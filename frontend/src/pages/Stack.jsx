import React, { useState } from 'react';
import './Stack.css';

function Stack() {
  const [stack, setStack] = useState([]);
  const [input, setInput] = useState('');

  const push = () => {
    if (input.trim()) {
      setStack([...stack, input.trim()]);
      setInput('');
    }
  };

  const pop = () => {
    if (stack.length > 0) {
      setStack(stack.slice(0, -1));
    }
  };

  const peek = () => {
    if (stack.length > 0) {
      alert(`Top element: ${stack[stack.length - 1]}`);
    } else {
      alert('Stack is empty!');
    }
  };

  return (
    <div className="stack-page">
      <div className="page-header">
        <h2>📤 Stack Visualizer (LIFO)</h2>
        <p className="page-subtitle">Last In, First Out - Visualize stack push and pop operations</p>
      </div>

      <div className="visualization-container">
        <div className="controls-section">
          <h3>🎮 Operations</h3>
          <div className="controls">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter value to push"
              onKeyPress={(e) => e.key === 'Enter' && push()}
            />
            <button onClick={push} className="btn btn-push">Push</button>
            <button onClick={pop} className="btn btn-pop">Pop</button>
            <button onClick={peek} className="btn btn-peek">Peek</button>
            <button onClick={() => setStack([])} className="btn btn-clear">Clear</button>
          </div>

          <div className="info-panel">
            <div className="info-item">
              <span className="info-label">Size:</span>
              <span className="info-value">{stack.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Top:</span>
              <span className="info-value">{stack.length > 0 ? stack[stack.length - 1] : 'Empty'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className={`info-value ${stack.length === 0 ? 'empty' : 'active'}`}>
                {stack.length === 0 ? 'Empty' : 'Active'}
              </span>
            </div>
          </div>
        </div>

        <div className="stack-visualization">
          <h3>📊 Stack Structure</h3>
          <div className="stack-container">
            {stack.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p>Stack is empty</p>
                <p className="hint">Push some elements to get started</p>
              </div>
            ) : (
              stack.slice().reverse().map((item, idx) => (
                <div
                  key={idx}
                  className={`stack-item ${idx === 0 ? 'top' : ''}`}
                  style={{ '--item-index': idx }}
                >
                  <span className="item-value">{item}</span>
                  {idx === 0 && <span className="top-label">TOP</span>}
                </div>
              ))
            )}
          </div>
          <div className="base-label">BASE</div>
        </div>
      </div>

      <div className="info-section">
        <h3>💡 Stack Operations</h3>
        <div className="operations-grid">
          <div className="operation-card">
            <h4>Push</h4>
            <p>Add element to the top of the stack</p>
            <span className="complexity">O(1)</span>
          </div>
          <div className="operation-card">
            <h4>Pop</h4>
            <p>Remove element from the top of the stack</p>
            <span className="complexity">O(1)</span>
          </div>
          <div className="operation-card">
            <h4>Peek</h4>
            <p>View the top element without removing it</p>
            <span className="complexity">O(1)</span>
          </div>
          <div className="operation-card">
            <h4>isEmpty</h4>
            <p>Check if stack is empty</p>
            <span className="complexity">O(1)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stack;
