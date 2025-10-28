import React, { useState } from 'react';
import './StackQueue.css';

function StackQueue() {
  const [stack, setStack] = useState([]);
  const [queue, setQueue] = useState([]);
  const [stackInput, setStackInput] = useState('');
  const [queueInput, setQueueInput] = useState('');

  const stackPush = () => {
    if (stackInput.trim()) {
      setStack([...stack, stackInput]);
      setStackInput('');
    }
  };

  const stackPop = () => {
    if (stack.length > 0) setStack(stack.slice(0, -1));
  };

  const queueEnqueue = () => {
    if (queueInput.trim()) {
      setQueue([...queue, queueInput]);
      setQueueInput('');
    }
  };

  const queueDequeue = () => {
    if (queue.length > 0) setQueue(queue.slice(1));
  };

  return (
    <div className="stack-queue">
      <div className="page-header">
        <h2>📚 Stack & Queue Visualizer</h2>
        <p className="page-subtitle">Interactive visualization of LIFO and FIFO data structures</p>
      </div>

      <div className="containers">
        <div className="section">
          <h3>📤 Stack (LIFO)</h3>
          <div className="controls">
            <input value={stackInput} onChange={(e) => setStackInput(e.target.value)} placeholder="Enter value to push" />
            <button onClick={stackPush} className="btn btn-success">Push</button>
            <button onClick={stackPop} className="btn btn-danger">Pop</button>
            <button onClick={() => setStack([])} className="btn">Clear</button>
          </div>
          <div className="stack-container">
            {stack.length === 0 ? (
              <div className="empty">Stack is empty</div>
            ) : (
              stack.slice().reverse().map((item, idx) => (
                <div key={idx} className={`stack-item ${idx === 0 ? 'top' : ''}`}>
                  {item}
                </div>
              ))
            )}
          </div>
          <div className="info">Size: {stack.length}</div>
        </div>

        <div className="section">
          <h3>➡️ Queue (FIFO)</h3>
          <div className="controls">
            <input value={queueInput} onChange={(e) => setQueueInput(e.target.value)} placeholder="Enter value to enqueue" />
            <button onClick={queueEnqueue} className="btn btn-success">Enqueue</button>
            <button onClick={queueDequeue} className="btn btn-danger">Dequeue</button>
            <button onClick={() => setQueue([])} className="btn">Clear</button>
          </div>
          <div className="queue-container">
            {queue.length === 0 ? (
              <div className="empty">Queue is empty</div>
            ) : (
              queue.map((item, idx) => (
                <div key={idx} className={`queue-item ${idx === 0 ? 'front' : idx === queue.length - 1 ? 'rear' : ''}`}>
                  {item}
                </div>
              ))
            )}
          </div>
          <div className="info">Size: {queue.length}</div>
        </div>
      </div>
    </div>
  );
}

export default StackQueue;
