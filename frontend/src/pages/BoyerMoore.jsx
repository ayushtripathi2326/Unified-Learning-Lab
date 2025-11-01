import React, { useState, useRef, useEffect } from 'react';
import './BoyerMoore.css';

function BoyerMoore() {
  const [text, setText] = useState('ABAAABCDABCABCD');
  const [pattern, setPattern] = useState('ABCD');
  const [executing, setExecuting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [patternIndex, setPatternIndex] = useState(-1);
  const [matches, setMatches] = useState([]);
  const [steps, setSteps] = useState([]);
  const [badCharTable, setBadCharTable] = useState({});
  const [goodSuffixTable, setGoodSuffixTable] = useState([]);
  const [comparisons, setComparisons] = useState(0);
  const [shifts, setShifts] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (pattern) {
      buildBadCharTable(pattern);
      buildGoodSuffixTable(pattern);
    }
  }, [pattern]);

  useEffect(() => {
    drawVisualization();
  }, [text, pattern, currentIndex, patternIndex, matches]);

  const buildBadCharTable = (pat) => {
    const table = {};
    const m = pat.length;

    // Initialize all characters with -1
    for (let i = 0; i < m - 1; i++) {
      table[pat[i]] = i;
    }

    setBadCharTable(table);
  };

  const buildGoodSuffixTable = (pat) => {
    const m = pat.length;
    const table = new Array(m).fill(0);
    const borderPos = new Array(m + 1).fill(0);

    // Preprocessing for case 2
    let i = m;
    let j = m + 1;
    borderPos[i] = j;

    while (i > 0) {
      while (j <= m && pat[i - 1] !== pat[j - 1]) {
        if (table[j] === 0) {
          table[j] = j - i;
        }
        j = borderPos[j];
      }
      i--;
      j--;
      borderPos[i] = j;
    }

    // Preprocessing for case 1
    j = borderPos[0];
    for (i = 0; i <= m; i++) {
      if (table[i] === 0) {
        table[i] = j;
      }
      if (i === j) {
        j = borderPos[j];
      }
    }

    setGoodSuffixTable(table);
  };

  const boyerMooreSearch = async () => {
    setExecuting(true);
    setMatches([]);
    setSteps([]);
    setComparisons(0);
    setShifts(0);

    const n = text.length;
    const m = pattern.length;
    const stepsArr = [];
    const matchesArr = [];
    let compCount = 0;
    let shiftCount = 0;

    if (m === 0 || n === 0 || m > n) {
      stepsArr.push('❌ Invalid input: Pattern length must be > 0 and ≤ text length');
      setSteps(stepsArr);
      setExecuting(false);
      return;
    }

    stepsArr.push(`📝 Text: "${text}" (length: ${n})`);
    stepsArr.push(`🔍 Pattern: "${pattern}" (length: ${m})`);
    stepsArr.push(`📊 Bad Character Table: ${JSON.stringify(badCharTable)}`);
    setSteps([...stepsArr]);
    await sleep(1000);

    let s = 0; // shift of pattern with respect to text

    while (s <= n - m) {
      setCurrentIndex(s);
      let j = m - 1;

      stepsArr.push(`\n🎯 Aligning pattern at position ${s}`);
      setSteps([...stepsArr]);
      await sleep(800);

      // Compare from right to left
      while (j >= 0) {
        setPatternIndex(j);
        compCount++;
        setComparisons(compCount);

        stepsArr.push(`🔄 Comparing text[${s + j}]='${text[s + j]}' with pattern[${j}]='${pattern[j]}'`);
        setSteps([...stepsArr]);
        await sleep(600);

        if (pattern[j] !== text[s + j]) {
          stepsArr.push(`❌ Mismatch at position ${s + j}`);
          setSteps([...stepsArr]);
          break;
        }

        stepsArr.push(`✅ Match at position ${s + j}`);
        setSteps([...stepsArr]);
        j--;
        await sleep(600);
      }

      if (j < 0) {
        // Pattern found
        matchesArr.push(s);
        setMatches([...matchesArr]);
        stepsArr.push(`\n🎉 Pattern found at index ${s}`);
        setSteps([...stepsArr]);
        await sleep(1000);

        // Shift pattern
        const shift = s + m < n ? m - badCharTable[text[s + m]] || m : 1;
        shiftCount++;
        setShifts(shiftCount);
        stepsArr.push(`⏩ Shifting pattern by ${shift} positions`);
        setSteps([...stepsArr]);
        s += shift;
      } else {
        // Mismatch - use bad character rule
        const badChar = text[s + j];
        const badCharShift = badCharTable[badChar];

        let shift;
        if (badCharShift === undefined) {
          shift = j + 1;
          stepsArr.push(`📌 Character '${badChar}' not in pattern`);
          stepsArr.push(`⏩ Shifting pattern by ${shift} positions (j + 1)`);
        } else {
          shift = Math.max(1, j - badCharShift);
          stepsArr.push(`📌 Character '${badChar}' last occurs at index ${badCharShift}`);
          stepsArr.push(`⏩ Shifting pattern by ${shift} positions (max(1, j - lastOccur))`);
        }

        shiftCount++;
        setShifts(shiftCount);
        setSteps([...stepsArr]);
        s += shift;
        await sleep(800);
      }

      setPatternIndex(-1);
    }

    if (matchesArr.length === 0) {
      stepsArr.push(`\n❌ Pattern not found in text`);
    } else {
      stepsArr.push(`\n✅ Total matches: ${matchesArr.length}`);
      stepsArr.push(`📊 Comparisons: ${compCount}`);
      stepsArr.push(`📊 Shifts: ${shiftCount}`);
    }

    setSteps([...stepsArr]);
    setCurrentIndex(-1);
    setPatternIndex(-1);
    setExecuting(false);
  };

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.fillStyle = '#e91e63';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Boyer-Moore String Matching', canvas.width / 2, 30);

    if (!text || !pattern) return;

    const cellSize = 40;
    const startX = 50;
    const textY = 80;
    const patternY = 160;

    // Draw text label
    ctx.fillStyle = '#424242';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Text:', 10, textY + 25);

    // Draw text cells
    for (let i = 0; i < text.length; i++) {
      const x = startX + i * cellSize;

      // Highlight matches
      if (matches.includes(i)) {
        ctx.fillStyle = '#4caf50';
      } else if (currentIndex !== -1 && i >= currentIndex && i < currentIndex + pattern.length) {
        ctx.fillStyle = '#fff9c4';
      } else {
        ctx.fillStyle = '#f5f5f5';
      }

      ctx.fillRect(x, textY, cellSize, cellSize);
      ctx.strokeStyle = '#424242';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, textY, cellSize, cellSize);

      // Draw character
      ctx.fillStyle = '#212121';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text[i], x + cellSize / 2, textY + cellSize / 2);

      // Draw index
      ctx.fillStyle = '#757575';
      ctx.font = '11px Arial';
      ctx.fillText(i.toString(), x + cellSize / 2, textY - 8);
    }

    // Draw pattern label
    ctx.fillStyle = '#424242';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Pattern:', 10, patternY + 25);

    // Draw pattern cells
    if (currentIndex !== -1) {
      for (let i = 0; i < pattern.length; i++) {
        const x = startX + (currentIndex + i) * cellSize;

        // Highlight current comparison
        if (i === patternIndex) {
          ctx.fillStyle = '#ff9800';
        } else if (patternIndex !== -1 && i > patternIndex) {
          ctx.fillStyle = '#4caf50';
        } else {
          ctx.fillStyle = '#e1bee7';
        }

        ctx.fillRect(x, patternY, cellSize, cellSize);
        ctx.strokeStyle = '#7b1fa2';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, patternY, cellSize, cellSize);

        // Draw character
        ctx.fillStyle = '#4a148c';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pattern[i], x + cellSize / 2, patternY + cellSize / 2);

        // Draw arrow for current comparison
        if (i === patternIndex) {
          ctx.fillStyle = '#ff9800';
          ctx.font = 'bold 20px Arial';
          ctx.fillText('↕', x + cellSize / 2, patternY - cellSize / 2);
        }
      }
    }

    // Draw statistics
    ctx.fillStyle = '#424242';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Comparisons: ${comparisons}`, 10, 240);
    ctx.fillText(`Shifts: ${shifts}`, 200, 240);
    ctx.fillText(`Matches: ${matches.length}`, 350, 240);
  };

  const handleReset = () => {
    setCurrentIndex(-1);
    setPatternIndex(-1);
    setMatches([]);
    setSteps([]);
    setComparisons(0);
    setShifts(0);
  };

  const loadExample = (type) => {
    handleReset();
    switch (type) {
      case 'simple':
        setText('ABAAABCDABCABCD');
        setPattern('ABCD');
        break;
      case 'repeat':
        setText('AAAAAAAAAAAAAAAA');
        setPattern('AAAA');
        break;
      case 'mismatch':
        setText('ABCDEFGHIJKLMNOP');
        setPattern('XYZ');
        break;
      default:
        break;
    }
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="boyer-moore-page">
      <div className="page-header">
        <h2>🔍 Boyer-Moore Algorithm</h2>
        <p className="page-subtitle">
          Efficient string matching with bad character and good suffix heuristics
        </p>
      </div>

      <div className="bm-controls">
        <div className="control-section">
          <h3>📝 Input</h3>
          <div className="input-group">
            <label>Text:</label>
            <input
              type="text"
              value={text}
              onChange={(e) => { setText(e.target.value.toUpperCase()); handleReset(); }}
              disabled={executing}
              placeholder="Enter text"
            />
          </div>
          <div className="input-group">
            <label>Pattern:</label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => { setPattern(e.target.value.toUpperCase()); handleReset(); }}
              disabled={executing}
              placeholder="Enter pattern"
            />
          </div>
          <button
            onClick={boyerMooreSearch}
            className="btn btn-execute"
            disabled={executing || !text || !pattern}
          >
            {executing ? '⏳ Searching...' : '▶️ Execute'}
          </button>
          <button
            onClick={handleReset}
            className="btn btn-reset"
            disabled={executing}
          >
            🔄 Reset
          </button>
        </div>

        <div className="control-section">
          <h3>📚 Examples</h3>
          <div className="example-buttons">
            <button onClick={() => loadExample('simple')} className="btn-example" disabled={executing}>
              Simple Match
            </button>
            <button onClick={() => loadExample('repeat')} className="btn-example" disabled={executing}>
              Repeated Pattern
            </button>
            <button onClick={() => loadExample('mismatch')} className="btn-example" disabled={executing}>
              No Match
            </button>
          </div>
        </div>

        <div className="control-section">
          <h3>📊 Statistics</h3>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-value">{comparisons}</div>
              <div className="stat-label">Comparisons</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{shifts}</div>
              <div className="stat-label">Shifts</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{matches.length}</div>
              <div className="stat-label">Matches</div>
            </div>
          </div>
        </div>
      </div>

      <div className="visualization-section">
        <h3>🎨 Visualization</h3>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={1200}
            height={280}
            style={{
              border: '3px solid #e91e63',
              borderRadius: '12px',
              background: 'white',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
          />
        </div>
        <div className="legend">
          <div className="legend-item">
            <span className="legend-box" style={{background: '#fff9c4'}}></span>
            <span>Comparing</span>
          </div>
          <div className="legend-item">
            <span className="legend-box" style={{background: '#ff9800'}}></span>
            <span>Current Position</span>
          </div>
          <div className="legend-item">
            <span className="legend-box" style={{background: '#4caf50'}}></span>
            <span>Match Found</span>
          </div>
          <div className="legend-item">
            <span className="legend-box" style={{background: '#e1bee7'}}></span>
            <span>Pattern</span>
          </div>
        </div>
      </div>

      <div className="tables-section">
        <div className="table-card">
          <h3>📋 Bad Character Table</h3>
          <div className="table-content">
            {Object.keys(badCharTable).length > 0 ? (
              <table className="bm-table">
                <thead>
                  <tr>
                    <th>Character</th>
                    <th>Last Position</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(badCharTable).map(([char, pos]) => (
                    <tr key={char}>
                      <td>{char}</td>
                      <td>{pos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-message">Enter a pattern to build table</p>
            )}
          </div>
        </div>

        <div className="table-card">
          <h3>📋 Good Suffix Table</h3>
          <div className="table-content">
            {goodSuffixTable.length > 0 ? (
              <table className="bm-table">
                <thead>
                  <tr>
                    <th>Index</th>
                    <th>Shift</th>
                  </tr>
                </thead>
                <tbody>
                  {goodSuffixTable.map((shift, idx) => (
                    <tr key={idx}>
                      <td>{idx}</td>
                      <td>{shift}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-message">Enter a pattern to build table</p>
            )}
          </div>
        </div>
      </div>

      {steps.length > 0 && (
        <div className="steps-section">
          <h3>📝 Execution Steps</h3>
          <div className="steps-list">
            {steps.map((step, idx) => (
              <div key={idx} className="step-item">
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="info-section">
        <h3>💡 Boyer-Moore Algorithm</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>🎯 How It Works</h4>
            <p>
              Boyer-Moore algorithm searches from <strong>right to left</strong> within the pattern.
              It uses two heuristics to skip sections of the text:
            </p>
            <ul>
              <li><strong>Bad Character Rule:</strong> Skip alignments based on mismatched character</li>
              <li><strong>Good Suffix Rule:</strong> Skip alignments based on matched suffix</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>⚡ Efficiency</h4>
            <p><strong>Time Complexity:</strong></p>
            <ul>
              <li>Best Case: O(n/m) - Very efficient!</li>
              <li>Average Case: O(n)</li>
              <li>Worst Case: O(n×m)</li>
            </ul>
            <p><strong>Space Complexity:</strong> O(k) where k is alphabet size</p>
          </div>

          <div className="info-card">
            <h4>🔍 Bad Character Rule</h4>
            <p>
              When a mismatch occurs at position j of pattern:
            </p>
            <ul>
              <li>If mismatched character appears in pattern, align its rightmost occurrence</li>
              <li>If character doesn't appear, shift pattern past the mismatch</li>
              <li>Shift = max(1, j - lastOccurrence)</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>📊 Good Suffix Rule</h4>
            <p>
              Uses matched suffix to determine shift:
            </p>
            <ul>
              <li>Find another occurrence of matched suffix in pattern</li>
              <li>If found, align pattern to match that occurrence</li>
              <li>Otherwise, shift pattern past the matched suffix</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="applications-section">
        <h3>🚀 Applications</h3>
        <div className="applications-grid">
          <div className="application-card">
            <h4>📄 Text Editors</h4>
            <p>Used in "Find" and "Replace" operations in editors like Vim and Emacs.</p>
          </div>
          <div className="application-card">
            <h4>🔒 Intrusion Detection</h4>
            <p>Searching for malicious patterns in network traffic and system logs.</p>
          </div>
          <div className="application-card">
            <h4>🧬 Bioinformatics</h4>
            <p>DNA sequence matching and genome analysis for pattern identification.</p>
          </div>
          <div className="application-card">
            <h4>📚 Plagiarism Detection</h4>
            <p>Finding similar text patterns across multiple documents efficiently.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoyerMoore;
