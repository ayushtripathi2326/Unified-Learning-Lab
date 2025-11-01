import React, { useState, useRef, useEffect } from 'react';
import './HashTable.css';

function HashTable() {
  const TABLE_SIZE = 10;
  const [hashTable, setHashTable] = useState(Array(TABLE_SIZE).fill(null).map(() => []));
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    drawHashTable();
  }, [hashTable, highlightIndex]);

  const drawHashTable = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellWidth = 80;
    const cellHeight = 50;
    const bucketSpacing = 120;
    const startX = 50;
    const startY = 50;

    // Draw title
    ctx.fillStyle = '#1976d2';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Hash Table Buckets', canvas.width / 2, 30);

    hashTable.forEach((bucket, index) => {
      const x = startX;
      const y = startY + index * 60;

      // Highlight effect
      const isHighlighted = highlightIndex === index;

      // Draw index box
      ctx.fillStyle = isHighlighted ? '#ff9800' : '#2196f3';
      ctx.fillRect(x, y, cellWidth, cellHeight);
      ctx.strokeStyle = isHighlighted ? '#f57c00' : '#1565c0';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, cellWidth, cellHeight);

      // Draw index number
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`[${index}]`, x + cellWidth / 2, y + cellHeight / 2);

      // Draw bucket items
      if (bucket.length > 0) {
        bucket.forEach((item, itemIdx) => {
          const itemX = x + cellWidth + 80 + itemIdx * bucketSpacing;
          const itemY = y;

          // Draw arrow from index to first item
          if (itemIdx === 0) {
            ctx.beginPath();
            ctx.moveTo(x + cellWidth, y + cellHeight / 2);
            ctx.lineTo(itemX - 10, y + cellHeight / 2);
            ctx.strokeStyle = isHighlighted ? '#ff9800' : '#4caf50';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Arrow head
            ctx.beginPath();
            ctx.moveTo(itemX - 10, y + cellHeight / 2);
            ctx.lineTo(itemX - 18, y + cellHeight / 2 - 6);
            ctx.lineTo(itemX - 18, y + cellHeight / 2 + 6);
            ctx.closePath();
            ctx.fillStyle = isHighlighted ? '#ff9800' : '#4caf50';
            ctx.fill();
          }

          // Draw item box
          ctx.fillStyle = isHighlighted ? '#fff3e0' : '#e8f5e9';
          ctx.fillRect(itemX, itemY, 100, cellHeight);
          ctx.strokeStyle = isHighlighted ? '#ff9800' : '#4caf50';
          ctx.lineWidth = 2;
          ctx.strokeRect(itemX, itemY, 100, cellHeight);

          // Draw key-value pair
          ctx.fillStyle = '#424242';
          ctx.font = '12px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(`${item.key}:`, itemX + 5, itemY + 20);
          ctx.fillText(`${item.value}`, itemX + 5, itemY + 38);

          // Draw chain arrow to next item
          if (itemIdx < bucket.length - 1) {
            ctx.beginPath();
            ctx.moveTo(itemX + 100, itemY + cellHeight / 2);
            ctx.lineTo(itemX + 100 + 30, itemY + cellHeight / 2);
            ctx.strokeStyle = '#9e9e9e';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Arrow head
            ctx.beginPath();
            ctx.moveTo(itemX + 130, itemY + cellHeight / 2);
            ctx.lineTo(itemX + 122, itemY + cellHeight / 2 - 5);
            ctx.lineTo(itemX + 122, itemY + cellHeight / 2 + 5);
            ctx.closePath();
            ctx.fillStyle = '#9e9e9e';
            ctx.fill();
          }
        });
      } else {
        // Draw NULL
        ctx.fillStyle = '#9e9e9e';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('NULL', x + cellWidth + 20, y + cellHeight / 2);
      }
    });
  };

  // Simple hash function
  const hashFunction = (key) => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i) * (i + 1)) % TABLE_SIZE;
    }
    return hash;
  };

  const insert = () => {
    if (key.trim() && value.trim()) {
      const index = hashFunction(key.trim());
      const newTable = [...hashTable];

      // Check if key already exists, update if it does
      const existingIndex = newTable[index].findIndex(item => item.key === key.trim());
      if (existingIndex !== -1) {
        newTable[index][existingIndex].value = value.trim();
      } else {
        newTable[index].push({ key: key.trim(), value: value.trim() });
      }

      setHashTable(newTable);
      setHighlightIndex(index);
      setKey('');
      setValue('');

      setTimeout(() => setHighlightIndex(null), 2000);
    }
  };

  const search = () => {
    if (searchKey.trim()) {
      const index = hashFunction(searchKey.trim());
      const bucket = hashTable[index];
      const found = bucket.find(item => item.key === searchKey.trim());

      setHighlightIndex(index);

      if (found) {
        alert(`✅ Found!\nKey: "${found.key}"\nValue: "${found.value}"\nIndex: ${index}`);
      } else {
        alert(`❌ Key "${searchKey.trim()}" not found in hash table!`);
      }

      setTimeout(() => setHighlightIndex(null), 2000);
    }
  };

  const deleteKey = () => {
    if (searchKey.trim()) {
      const index = hashFunction(searchKey.trim());
      const newTable = [...hashTable];
      const bucket = newTable[index];
      const itemIndex = bucket.findIndex(item => item.key === searchKey.trim());

      if (itemIndex !== -1) {
        bucket.splice(itemIndex, 1);
        setHashTable(newTable);
        setHighlightIndex(index);
        alert(`🗑️ Key "${searchKey.trim()}" deleted successfully!`);
        setSearchKey('');
        setTimeout(() => setHighlightIndex(null), 2000);
      } else {
        alert(`❌ Key "${searchKey.trim()}" not found!`);
      }
    }
  };

  const clear = () => {
    setHashTable(Array(TABLE_SIZE).fill(null).map(() => []));
    setHighlightIndex(null);
  };

  const getTotalItems = () => {
    return hashTable.reduce((sum, bucket) => sum + bucket.length, 0);
  };

  const getLoadFactor = () => {
    const total = getTotalItems();
    return (total / TABLE_SIZE).toFixed(2);
  };

  const getCollisions = () => {
    return hashTable.filter(bucket => bucket.length > 1).length;
  };

  return (
    <div className="hash-table-page">
      <div className="page-header">
        <h2>🗂️ Hash Table Visualizer</h2>
        <p className="page-subtitle">Key-value storage with O(1) average-case lookup using hash functions</p>
      </div>

      <div className="controls-container">
        <div className="control-group">
          <h3>➕ Insert Key-Value Pair</h3>
          <div className="controls">
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter key"
              onKeyPress={(e) => e.key === 'Enter' && document.getElementById('value-input').focus()}
            />
            <input
              id="value-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
              onKeyPress={(e) => e.key === 'Enter' && insert()}
            />
            <button onClick={insert} className="btn btn-insert">Insert</button>
          </div>
        </div>

        <div className="control-group">
          <h3>🔍 Search & Delete</h3>
          <div className="controls">
            <input
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Enter key to search/delete"
              onKeyPress={(e) => e.key === 'Enter' && search()}
            />
            <button onClick={search} className="btn btn-search">Search</button>
            <button onClick={deleteKey} className="btn btn-delete">Delete</button>
            <button onClick={clear} className="btn btn-clear">Clear All</button>
          </div>
          <div className="info-panel">
            <div className="info-item">
              <span className="info-label">Total Items:</span>
              <span className="info-value">{getTotalItems()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Load Factor:</span>
              <span className="info-value">{getLoadFactor()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Collisions:</span>
              <span className="info-value">{getCollisions()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="canvas-visualization">
        <h3>🎨 Canvas Visualization</h3>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={800}
            height={650}
            style={{
              border: '2px solid #1976d2',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
          />
        </div>
      </div>

      <div className="hash-visualization">
        <h3>🔢 Hash Table Structure (Size: {TABLE_SIZE})</h3>
        <div className="table-container">
          {hashTable.map((bucket, index) => (
            <div
              key={index}
              className={`bucket ${highlightIndex === index ? 'highlighted' : ''} ${bucket.length > 1 ? 'collision' : ''}`}
              style={{ '--bucket-index': index }}
            >
              <div className="bucket-header">
                <span className="bucket-index">Index {index}</span>
                {bucket.length > 1 && <span className="collision-badge">⚠️ Collision</span>}
              </div>
              <div className="bucket-content">
                {bucket.length === 0 ? (
                  <div className="empty-bucket">Empty</div>
                ) : (
                  <div className="chain">
                    {bucket.map((item, itemIndex) => (
                      <div key={itemIndex} className="chain-item">
                        <div className="item-key">{item.key}</div>
                        <div className="item-arrow">→</div>
                        <div className="item-value">{item.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <div className="section-half">
          <h3>💡 Hash Table Operations</h3>
          <div className="operations-grid">
            <div className="operation-card">
              <h4>Insert</h4>
              <p>Add key-value pair using hash function</p>
              <span className="complexity">O(1) avg</span>
            </div>
            <div className="operation-card">
              <h4>Search</h4>
              <p>Find value by key using hash lookup</p>
              <span className="complexity">O(1) avg</span>
            </div>
            <div className="operation-card">
              <h4>Delete</h4>
              <p>Remove key-value pair from table</p>
              <span className="complexity">O(1) avg</span>
            </div>
            <div className="operation-card">
              <h4>Hash Function</h4>
              <p>Maps keys to array indices</p>
              <span className="complexity">O(k)</span>
            </div>
          </div>
        </div>

        <div className="section-half">
          <h3>🎯 Key Concepts</h3>
          <div className="concepts-grid">
            <div className="concept-card">
              <div className="concept-icon">🔑</div>
              <h4>Hashing</h4>
              <p>Converting keys into array indices using a hash function</p>
            </div>
            <div className="concept-card">
              <div className="concept-icon">⛓️</div>
              <h4>Chaining</h4>
              <p>Handling collisions by storing multiple items in a linked list</p>
            </div>
            <div className="concept-card">
              <div className="concept-icon">📊</div>
              <h4>Load Factor</h4>
              <p>Ratio of stored items to table size (n/m)</p>
            </div>
            <div className="concept-card">
              <div className="concept-icon">💥</div>
              <h4>Collisions</h4>
              <p>When multiple keys hash to the same index</p>
            </div>
          </div>
        </div>
      </div>

      <div className="use-cases-section">
        <h3>🚀 Real-World Applications</h3>
        <div className="use-cases-grid">
          <div className="use-case-card">
            <span className="use-case-icon">🗄️</span>
            <h4>Database Indexing</h4>
            <p>Fast record lookup in databases</p>
          </div>
          <div className="use-case-card">
            <span className="use-case-icon">🌐</span>
            <h4>Caching</h4>
            <p>Browser cache, DNS lookup tables</p>
          </div>
          <div className="use-case-card">
            <span className="use-case-icon">🔐</span>
            <h4>Cryptography</h4>
            <p>Password hashing and verification</p>
          </div>
          <div className="use-case-card">
            <span className="use-case-icon">📚</span>
            <h4>Symbol Tables</h4>
            <p>Compiler symbol tables, dictionaries</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HashTable;
