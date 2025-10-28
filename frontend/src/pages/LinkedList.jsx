import React, { useState } from 'react';
import './LinkedList.css';

function LinkedList() {
  const [list, setList] = useState([]);
  const [input, setInput] = useState('');
  const [position, setPosition] = useState('');

  const insertAtHead = () => {
    if (input.trim()) {
      setList([input.trim(), ...list]);
      setInput('');
    }
  };

  const insertAtTail = () => {
    if (input.trim()) {
      setList([...list, input.trim()]);
      setInput('');
    }
  };

  const insertAtPosition = () => {
    const pos = parseInt(position);
    if (input.trim() && !isNaN(pos) && pos >= 0 && pos <= list.length) {
      const newList = [...list];
      newList.splice(pos, 0, input.trim());
      setList(newList);
      setInput('');
      setPosition('');
    } else {
      alert('Invalid position!');
    }
  };

  const deleteAtPosition = () => {
    const pos = parseInt(position);
    if (!isNaN(pos) && pos >= 0 && pos < list.length) {
      const newList = [...list];
      newList.splice(pos, 1);
      setList(newList);
      setPosition('');
    } else {
      alert('Invalid position!');
    }
  };

  const search = () => {
    if (input.trim()) {
      const index = list.indexOf(input.trim());
      if (index !== -1) {
        alert(`Element "${input.trim()}" found at position ${index}`);
      } else {
        alert(`Element "${input.trim()}" not found!`);
      }
    }
  };

  return (
    <div className="linked-list-page">
      <div className="page-header">
        <h2>🔗 Linked List Visualizer</h2>
        <p className="page-subtitle">Dynamic data structure with nodes connected via pointers</p>
      </div>

      <div className="controls-container">
        <div className="control-group">
          <h3>📝 Insert Operations</h3>
          <div className="controls">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter value"
              onKeyPress={(e) => e.key === 'Enter' && insertAtTail()}
            />
            <button onClick={insertAtHead} className="btn btn-insert-head">Insert at Head</button>
            <button onClick={insertAtTail} className="btn btn-insert-tail">Insert at Tail</button>
          </div>
          <div className="controls">
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Position"
              type="number"
              min="0"
            />
            <button onClick={insertAtPosition} className="btn btn-insert-pos">Insert at Position</button>
            <button onClick={deleteAtPosition} className="btn btn-delete">Delete at Position</button>
          </div>
        </div>

        <div className="control-group">
          <h3>🔍 Other Operations</h3>
          <div className="controls">
            <button onClick={search} className="btn btn-search">Search Element</button>
            <button onClick={() => setList([])} className="btn btn-clear">Clear All</button>
          </div>
          <div className="info-panel">
            <div className="info-item">
              <span className="info-label">Size:</span>
              <span className="info-value">{list.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Head:</span>
              <span className="info-value">{list.length > 0 ? list[0] : 'NULL'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Tail:</span>
              <span className="info-value">{list.length > 0 ? list[list.length - 1] : 'NULL'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="list-visualization">
        <h3>📊 Linked List Structure</h3>
        <div className="list-container">
          {list.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>Linked List is empty</p>
              <p className="hint">Insert some nodes to get started</p>
            </div>
          ) : (
            <>
              <div className="head-label">HEAD</div>
              <div className="nodes-wrapper">
                {list.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <div className="node" style={{ '--node-index': idx }}>
                      <div className="node-content">
                        <div className="node-data">{item}</div>
                        <div className="node-next">next</div>
                      </div>
                      <div className="node-index">Index: {idx}</div>
                    </div>
                    {idx < list.length - 1 && (
                      <div className="arrow">→</div>
                    )}
                  </React.Fragment>
                ))}
                <div className="null-node">NULL</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="info-section">
        <h3>💡 Linked List Operations</h3>
        <div className="operations-grid">
          <div className="operation-card">
            <h4>Insert at Head</h4>
            <p>Add new node at the beginning of the list</p>
            <span className="complexity">O(1)</span>
          </div>
          <div className="operation-card">
            <h4>Insert at Tail</h4>
            <p>Add new node at the end of the list</p>
            <span className="complexity">O(n)</span>
          </div>
          <div className="operation-card">
            <h4>Insert at Position</h4>
            <p>Insert node at specific index</p>
            <span className="complexity">O(n)</span>
          </div>
          <div className="operation-card">
            <h4>Delete at Position</h4>
            <p>Remove node from specific index</p>
            <span className="complexity">O(n)</span>
          </div>
          <div className="operation-card">
            <h4>Search</h4>
            <p>Find if element exists in the list</p>
            <span className="complexity">O(n)</span>
          </div>
          <div className="operation-card">
            <h4>Traverse</h4>
            <p>Visit all nodes from head to tail</p>
            <span className="complexity">O(n)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LinkedList;
