import React, { useState } from 'react';
import './Queue.css';

function Queue() {
  const [queue, setQueue] = useState([]);
  const [input, setInput] = useState('');

  const enqueue = () => {
    if (input.trim()) {
      setQueue([...queue, input.trim()]);
      setInput('');
    }
  };

  const dequeue = () => {
    if (queue.length > 0) {
      setQueue(queue.slice(1));
    }
  };

  const peek = () => {
    if (queue.length > 0) {
      alert(`Front element: ${queue[0]}`);
    } else {
      alert('Queue is empty!');
    }
  };

  return (
    <div className="queue-page">
      <div className="page-header">
        <h2>➡️ Queue Visualizer (FIFO)</h2>
        <p className="page-subtitle">First In, First Out - Visualize queue enqueue and dequeue operations</p>
      </div>

      <div className="visualization-container">
        <div className="controls-section">
          <h3>🎮 Operations</h3>
          <div className="controls">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter value to enqueue"
              onKeyPress={(e) => e.key === 'Enter' && enqueue()}
            />
            <button onClick={enqueue} className="btn btn-enqueue">Enqueue</button>
            <button onClick={dequeue} className="btn btn-dequeue">Dequeue</button>
            <button onClick={peek} className="btn btn-peek">Peek</button>
            <button onClick={() => setQueue([])} className="btn btn-clear">Clear</button>
          </div>

          <div className="info-panel">
            <div className="info-item">
              <span className="info-label">Size:</span>
              <span className="info-value">{queue.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Front:</span>
              <span className="info-value">{queue.length > 0 ? queue[0] : 'Empty'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Rear:</span>
              <span className="info-value">{queue.length > 0 ? queue[queue.length - 1] : 'Empty'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className={`info-value ${queue.length === 0 ? 'empty' : 'active'}`}>
                {queue.length === 0 ? 'Empty' : 'Active'}
              </span>
            </div>
          </div>
        </div>

        <div className="queue-visualization">
          <h3>📊 Queue Structure</h3>
          <div className="queue-labels">
            <div className="front-label">FRONT</div>
            <div className="rear-label">REAR</div>
          </div>
          <div className="queue-container">
            {queue.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p>Queue is empty</p>
                <p className="hint">Enqueue some elements to get started</p>
              </div>
            ) : (
              queue.map((item, idx) => (
                <div
                  key={idx}
                  className={`queue-item ${idx === 0 ? 'front' : idx === queue.length - 1 ? 'rear' : ''}`}
                  style={{ '--item-index': idx }}
                >
                  <span className="item-value">{item}</span>
                  {idx === 0 && <span className="position-label">FRONT</span>}
                  {idx === queue.length - 1 && <span className="position-label">REAR</span>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>💡 Queue Operations</h3>
        <div className="operations-grid">
          <div className="operation-card">
            <h4>Enqueue</h4>
            <p>Add element to the rear of the queue</p>
            <span className="complexity">O(1)</span>
          </div>
          <div className="operation-card">
            <h4>Dequeue</h4>
            <p>Remove element from the front of the queue</p>
            <span className="complexity">O(1)</span>
          </div>
          <div className="operation-card">
            <h4>Peek/Front</h4>
            <p>View the front element without removing it</p>
            <span className="complexity">O(1)</span>
          </div>
          <div className="operation-card">
            <h4>isEmpty</h4>
            <p>Check if queue is empty</p>
            <span className="complexity">O(1)</span>
          </div>
        </div>
      </div>

      <div className="use-cases">
        <h3>🌟 Real-World Applications</h3>
        <div className="use-cases-grid">
          <div className="use-case-card">
            <span className="use-case-icon">🖨️</span>
            <h4>Print Queue</h4>
            <p>Managing print jobs in order</p>
          </div>
          <div className="use-case-card">
            <span className="use-case-icon">📞</span>
            <h4>Call Center</h4>
            <p>Handling customer calls in FIFO order</p>
          </div>
          <div className="use-case-card">
            <span className="use-case-icon">🚗</span>
            <h4>Traffic Systems</h4>
            <p>Managing vehicle flow at toll booths</p>
          </div>
          <div className="use-case-card">
            <span className="use-case-icon">💾</span>
            <h4>CPU Scheduling</h4>
            <p>Process scheduling in operating systems</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Queue;
