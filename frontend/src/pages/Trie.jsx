import React, { useState, useRef, useEffect } from 'react';
import './Trie.css';

class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.word = null;
  }
}

class TrieDS {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (let char of word.toLowerCase()) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
    node.word = word;
  }

  search(word) {
    let node = this.root;
    const path = [this.root];
    for (let char of word.toLowerCase()) {
      if (!node.children[char]) {
        return { found: false, path };
      }
      node = node.children[char];
      path.push(node);
    }
    return { found: node.isEndOfWord, path };
  }

  startsWith(prefix) {
    let node = this.root;
    for (let char of prefix.toLowerCase()) {
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    return true;
  }

  delete(word) {
    const deleteHelper = (node, word, index) => {
      if (index === word.length) {
        if (!node.isEndOfWord) return false;
        node.isEndOfWord = false;
        node.word = null;
        return Object.keys(node.children).length === 0;
      }

      const char = word[index];
      if (!node.children[char]) return false;

      const shouldDeleteChild = deleteHelper(node.children[char], word, index + 1);

      if (shouldDeleteChild) {
        delete node.children[char];
        return Object.keys(node.children).length === 0 && !node.isEndOfWord;
      }

      return false;
    };

    return deleteHelper(this.root, word.toLowerCase(), 0);
  }

  getAllWords() {
    const words = [];
    const collect = (node, prefix) => {
      if (node.isEndOfWord) {
        words.push(node.word || prefix);
      }
      for (let char in node.children) {
        collect(node.children[char], prefix + char);
      }
    };
    collect(this.root, '');
    return words;
  }

  getWordsWithPrefix(prefix) {
    let node = this.root;
    for (let char of prefix.toLowerCase()) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }

    const words = [];
    const collect = (node, current) => {
      if (node.isEndOfWord) {
        words.push(node.word || current);
      }
      for (let char in node.children) {
        collect(node.children[char], current + char);
      }
    };
    collect(node, prefix.toLowerCase());
    return words;
  }

  countWords() {
    let count = 0;
    const countHelper = (node) => {
      if (node.isEndOfWord) count++;
      for (let char in node.children) {
        countHelper(node.children[char]);
      }
    };
    countHelper(this.root);
    return count;
  }
}

function Trie() {
  const [trie] = useState(new TrieDS());
  const [inputWord, setInputWord] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [prefixWord, setPrefixWord] = useState('');
  const [message, setMessage] = useState('');
  const [highlightedPath, setHighlightedPath] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [updateCounter, setUpdateCounter] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    drawTrie();
  }, [updateCounter, highlightedPath]);

  const drawTrie = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.fillStyle = '#7b1fa2';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Trie Data Structure', canvas.width / 2, 25);

    const nodePositions = new Map();
    const levels = getLevels(trie.root);

    if (levels.length <= 1) {
      ctx.fillStyle = '#9e9e9e';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Trie is Empty', canvas.width / 2, canvas.height / 2);
      ctx.font = '16px Arial';
      ctx.fillText('Insert words to build the trie', canvas.width / 2, canvas.height / 2 + 30);
      return;
    }

    // Calculate positions for each level
    const startY = 60;
    const levelHeight = 70;

    for (let i = 0; i < levels.length; i++) {
      const nodesInLevel = levels[i];
      const totalWidth = canvas.width - 100;
      const spacing = totalWidth / (nodesInLevel.length + 1);

      nodesInLevel.forEach((node, idx) => {
        const x = 50 + spacing * (idx + 1);
        const y = startY + i * levelHeight;
        nodePositions.set(node, { x, y });
      });
    }

    // Draw edges first
    drawEdges(ctx, trie.root, nodePositions);

    // Draw nodes
    nodePositions.forEach((pos, node) => {
      drawNode(ctx, node, pos.x, pos.y);
    });
  };

  const getLevels = (root) => {
    const levels = [[root]];
    let currentLevel = [root];

    while (currentLevel.length > 0) {
      const nextLevel = [];
      for (let node of currentLevel) {
        for (let char in node.children) {
          nextLevel.push(node.children[char]);
        }
      }
      if (nextLevel.length > 0) {
        levels.push(nextLevel);
      }
      currentLevel = nextLevel;
    }

    return levels;
  };

  const drawEdges = (ctx, node, positions, parentPos = null, char = '') => {
    const nodePos = positions.get(node);

    if (parentPos && nodePos) {
      ctx.beginPath();
      ctx.moveTo(parentPos.x, parentPos.y + 20);
      ctx.lineTo(nodePos.x, nodePos.y - 20);
      ctx.strokeStyle = '#9c27b0';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw character label
      const midX = (parentPos.x + nodePos.x) / 2;
      const midY = (parentPos.y + nodePos.y) / 2;
      ctx.fillStyle = '#6a1b9a';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(char, midX, midY);
    }

    for (let ch in node.children) {
      drawEdges(ctx, node.children[ch], positions, nodePos, ch);
    }
  };

  const drawNode = (ctx, node, x, y) => {
    const isHighlighted = highlightedPath.includes(node);
    const isRoot = node === trie.root;

    // Draw node circle
    ctx.beginPath();
    ctx.arc(x, y, isRoot ? 25 : 20, 0, 2 * Math.PI);

    if (isRoot) {
      ctx.fillStyle = '#6a1b9a';
    } else if (node.isEndOfWord) {
      ctx.fillStyle = isHighlighted ? '#ff6f00' : '#43a047';
    } else {
      ctx.fillStyle = isHighlighted ? '#ff9800' : '#9c27b0';
    }

    ctx.fill();
    ctx.strokeStyle = isHighlighted ? '#f57c00' : '#4a148c';
    ctx.lineWidth = isHighlighted ? 4 : 2;
    ctx.stroke();

    // Draw glow for highlighted nodes
    if (isHighlighted) {
      ctx.beginPath();
      ctx.arc(x, y, isRoot ? 30 : 25, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255, 152, 0, 0.4)';
      ctx.lineWidth = 8;
      ctx.stroke();
    }

    // Draw label
    ctx.fillStyle = 'white';
    ctx.font = isRoot ? 'bold 14px Arial' : 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isRoot ? 'ROOT' : (node.isEndOfWord ? '✓' : '○'), x, y);
  };

  const handleInsert = () => {
    if (!inputWord.trim()) {
      setMessage('❌ Please enter a word');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (!/^[a-zA-Z]+$/.test(inputWord)) {
      setMessage('❌ Only alphabetic characters allowed');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const result = trie.search(inputWord);
    if (result.found) {
      setMessage(`⚠️ Word "${inputWord}" already exists`);
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    trie.insert(inputWord);
    setAllWords(trie.getAllWords());
    setMessage(`✅ Inserted "${inputWord}" successfully`);
    setInputWord('');
    setUpdateCounter(prev => prev + 1);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleSearch = async () => {
    if (!searchWord.trim()) {
      setMessage('❌ Please enter a word to search');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    setHighlightedPath([]);
    const result = trie.search(searchWord);

    // Animate the search path
    for (let i = 0; i < result.path.length; i++) {
      setHighlightedPath(result.path.slice(0, i + 1));
      await sleep(400);
    }

    if (result.found) {
      setMessage(`✅ Found "${searchWord}" in the trie!`);
    } else {
      setMessage(`❌ "${searchWord}" not found in the trie`);
    }

    setTimeout(() => {
      setHighlightedPath([]);
      setMessage('');
    }, 2000);
  };

  const handleDelete = () => {
    if (!searchWord.trim()) {
      setMessage('❌ Please enter a word to delete');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const result = trie.search(searchWord);
    if (!result.found) {
      setMessage(`❌ "${searchWord}" not found in the trie`);
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    trie.delete(searchWord);
    setAllWords(trie.getAllWords());
    setMessage(`🗑️ Deleted "${searchWord}" successfully`);
    setSearchWord('');
    setUpdateCounter(prev => prev + 1);
    setTimeout(() => setMessage(''), 2000);
  };

  const handlePrefixSearch = () => {
    if (!prefixWord.trim()) {
      setMessage('❌ Please enter a prefix');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const words = trie.getWordsWithPrefix(prefixWord);
    setSuggestions(words);

    if (words.length > 0) {
      setMessage(`✅ Found ${words.length} word(s) with prefix "${prefixWord}"`);
    } else {
      setMessage(`❌ No words found with prefix "${prefixWord}"`);
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const handleClear = () => {
    // Recreate trie by clearing all words
    const words = trie.getAllWords();
    words.forEach(word => trie.delete(word));
    setAllWords([]);
    setSuggestions([]);
    setHighlightedPath([]);
    setUpdateCounter(prev => prev + 1);
    setMessage('🧹 Trie cleared');
    setTimeout(() => setMessage(''), 2000);
  };

  const loadSampleWords = () => {
    const sampleWords = ['apple', 'app', 'application', 'apply', 'banana', 'band', 'bandana', 'can', 'cat', 'category'];
    sampleWords.forEach(word => trie.insert(word));
    setAllWords(trie.getAllWords());
    setUpdateCounter(prev => prev + 1);
    setMessage('✅ Sample words loaded');
    setTimeout(() => setMessage(''), 2000);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="trie-page">
      <div className="page-header">
        <h2>🔤 Trie (Prefix Tree)</h2>
        <p className="page-subtitle">
          Efficient string search and prefix-based operations
        </p>
      </div>

      {message && (
        <div className={`message-banner ${message.includes('❌') || message.includes('⚠️') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="trie-controls">
        <div className="control-section">
          <h3>➕ Insert Word</h3>
          <div className="controls">
            <input
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              placeholder="Enter word to insert"
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
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="Enter word"
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
          <h3>🔤 Prefix Search</h3>
          <div className="controls">
            <input
              type="text"
              value={prefixWord}
              onChange={(e) => setPrefixWord(e.target.value)}
              placeholder="Enter prefix"
              onKeyPress={(e) => e.key === 'Enter' && handlePrefixSearch()}
            />
            <button onClick={handlePrefixSearch} className="btn btn-prefix">
              Find Words
            </button>
          </div>
        </div>

        <div className="control-section">
          <h3>🎨 Actions</h3>
          <div className="controls">
            <button onClick={loadSampleWords} className="btn btn-sample">
              Load Sample
            </button>
            <button onClick={handleClear} className="btn btn-clear">
              Clear Trie
            </button>
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions-result">
          <h4>📋 Words with prefix "{prefixWord}":</h4>
          <div className="suggestions-list">
            {suggestions.map((word, idx) => (
              <span key={idx} className="suggestion-chip">{word}</span>
            ))}
          </div>
        </div>
      )}

      <div className="canvas-visualization">
        <h3>🎨 Trie Visualization</h3>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={1200}
            height={500}
            style={{
              border: '3px solid #9c27b0',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
          />
        </div>
        <div className="legend">
          <div className="legend-item">
            <span className="legend-color" style={{background: '#6a1b9a'}}></span>
            <span>Root Node</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{background: '#43a047'}}></span>
            <span>End of Word</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{background: '#9c27b0'}}></span>
            <span>Intermediate Node</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{background: '#ff9800'}}></span>
            <span>Highlighted Path</span>
          </div>
        </div>
      </div>

      <div className="trie-info">
        <div className="info-grid">
          <div className="info-card">
            <h4>📊 Trie Statistics</h4>
            <div className="stat-item">
              <span className="stat-label">Total Words:</span>
              <span className="stat-value">{trie.countWords()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Unique Prefixes:</span>
              <span className="stat-value">{allWords.length > 0 ? 'Multiple' : '0'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Storage:</span>
              <span className="stat-value">Space Efficient</span>
            </div>
          </div>

          <div className="info-card">
            <h4>📝 Stored Words</h4>
            {allWords.length > 0 ? (
              <div className="words-list">
                {allWords.map((word, idx) => (
                  <span key={idx} className="word-chip">{word}</span>
                ))}
              </div>
            ) : (
              <p className="empty-message">No words stored yet</p>
            )}
          </div>

          <div className="info-card">
            <h4>⏱️ Time Complexity</h4>
            <div className="complexity-item">
              <span className="complexity-label">Insert:</span>
              <span className="complexity-badge">O(m)</span>
            </div>
            <div className="complexity-item">
              <span className="complexity-label">Search:</span>
              <span className="complexity-badge">O(m)</span>
            </div>
            <div className="complexity-item">
              <span className="complexity-label">Delete:</span>
              <span className="complexity-badge">O(m)</span>
            </div>
            <div className="complexity-item">
              <span className="complexity-label">Prefix Search:</span>
              <span className="complexity-badge">O(m+k)</span>
            </div>
            <p className="complexity-note">
              m = length of word<br />
              k = number of words with prefix
            </p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>💡 Trie Applications</h3>
        <div className="operations-grid">
          <div className="operation-card">
            <h4>🔍 Autocomplete</h4>
            <p>
              Perfect for search suggestions and autocomplete features.
              Quickly find all words starting with a given prefix.
            </p>
          </div>
          <div className="operation-card">
            <h4>📖 Spell Checker</h4>
            <p>
              Efficiently check if a word exists in a dictionary.
              Can suggest corrections based on similar prefixes.
            </p>
          </div>
          <div className="operation-card">
            <h4>🎮 Word Games</h4>
            <p>
              Used in Scrabble, word search puzzles, and crosswords.
              Fast validation of word existence.
            </p>
          </div>
          <div className="operation-card">
            <h4>🌐 IP Routing</h4>
            <p>
              Longest prefix matching in network routing tables.
              Efficiently route packets based on IP addresses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trie;
