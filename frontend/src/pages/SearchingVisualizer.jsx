import React, { useState, useEffect } from 'react';
import './SearchingVisualizer.css';

function SearchingVisualizer() {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(15);
  const [algorithm, setAlgorithm] = useState('linear');
  const [searching, setSearching] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [target, setTarget] = useState('');
  const [comparisons, setComparisons] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [searchRange, setSearchRange] = useState({ left: -1, right: -1 });
  const [visitedIndices, setVisitedIndices] = useState([]);
  const [jumpSteps, setJumpSteps] = useState([]);

  const algorithms = {
    linear: { name: 'Linear Search', complexity: 'O(n)' },
    binary: { name: 'Binary Search', complexity: 'O(log n)' },
    jump: { name: 'Jump Search', complexity: 'O(√n)' },
    interpolation: { name: 'Interpolation Search', complexity: 'O(log log n)' },
    exponential: { name: 'Exponential Search', complexity: 'O(log n)' },
    fibonacci: { name: 'Fibonacci Search', complexity: 'O(log n)' }
  };

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, (_, i) => i * 5 + 10);
    setArray(newArray);
    resetSearch();
  };

  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 200) + 10
    ).sort((a, b) => a - b);
    setArray(newArray);
    resetSearch();
  };

  const resetSearch = () => {
    setComparisons(0);
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setSearchRange({ left: -1, right: -1 });
    setVisitedIndices([]);
    setJumpSteps([]);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Linear Search
  const linearSearch = async () => {
    const targetValue = parseInt(target);
    if (isNaN(targetValue)) {
      alert('Please enter a valid number');
      return;
    }

    let comps = 0;
    for (let i = 0; i < array.length; i++) {
      if (!searching) return;

      setCurrentIndex(i);
      setVisitedIndices(prev => [...prev, i]);
      comps++;
      setComparisons(comps);
      await sleep(101 - speed);

      if (array[i] === targetValue) {
        setFoundIndex(i);
        setCurrentIndex(-1);
        return;
      }
    }
    setCurrentIndex(-1);
    alert('Element not found!');
  };

  // Binary Search
  const binarySearch = async () => {
    const targetValue = parseInt(target);
    if (isNaN(targetValue)) {
      alert('Please enter a valid number');
      return;
    }

    let left = 0;
    let right = array.length - 1;
    let comps = 0;

    while (left <= right) {
      if (!searching) return;

      const mid = Math.floor((left + right) / 2);
      setSearchRange({ left, right });
      setCurrentIndex(mid);
      comps++;
      setComparisons(comps);
      await sleep(101 - speed);

      if (array[mid] === targetValue) {
        setFoundIndex(mid);
        setCurrentIndex(-1);
        setSearchRange({ left: -1, right: -1 });
        return;
      }

      if (array[mid] < targetValue) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    setCurrentIndex(-1);
    setSearchRange({ left: -1, right: -1 });
    alert('Element not found!');
  };

  // Jump Search
  const jumpSearch = async () => {
    const targetValue = parseInt(target);
    if (isNaN(targetValue)) {
      alert('Please enter a valid number');
      return;
    }

    const jump = Math.floor(Math.sqrt(array.length));
    let prev = 0;
    let comps = 0;

    // Find block
    while (array[Math.min(jump, array.length) - 1] < targetValue) {
      if (!searching) return;

      const jumpIndex = Math.min(jump, array.length) - 1;
      setCurrentIndex(jumpIndex);
      setJumpSteps(prev => [...prev, jumpIndex]);
      setVisitedIndices(prev => [...prev, jumpIndex]);
      comps++;
      setComparisons(comps);
      await sleep(101 - speed);

      prev = jump;
      jump += Math.floor(Math.sqrt(array.length));

      if (prev >= array.length) {
        setCurrentIndex(-1);
        alert('Element not found!');
        return;
      }
    }

    // Linear search in block
    while (array[prev] < targetValue) {
      if (!searching) return;

      setCurrentIndex(prev);
      setVisitedIndices(prev => [...prev, prev]);
      comps++;
      setComparisons(comps);
      await sleep(101 - speed);

      prev++;

      if (prev === Math.min(jump, array.length)) {
        setCurrentIndex(-1);
        alert('Element not found!');
        return;
      }
    }

    if (array[prev] === targetValue) {
      setFoundIndex(prev);
      setCurrentIndex(-1);
      return;
    }

    setCurrentIndex(-1);
    alert('Element not found!');
  };

  // Interpolation Search
  const interpolationSearch = async () => {
    const targetValue = parseInt(target);
    if (isNaN(targetValue)) {
      alert('Please enter a valid number');
      return;
    }

    let low = 0;
    let high = array.length - 1;
    let comps = 0;

    while (low <= high && targetValue >= array[low] && targetValue <= array[high]) {
      if (!searching) return;

      if (low === high) {
        setCurrentIndex(low);
        comps++;
        setComparisons(comps);
        await sleep(101 - speed);

        if (array[low] === targetValue) {
          setFoundIndex(low);
          setCurrentIndex(-1);
          return;
        }
        break;
      }

      const pos = low + Math.floor(
        ((targetValue - array[low]) * (high - low)) / (array[high] - array[low])
      );

      setSearchRange({ left: low, right: high });
      setCurrentIndex(pos);
      comps++;
      setComparisons(comps);
      await sleep(101 - speed);

      if (array[pos] === targetValue) {
        setFoundIndex(pos);
        setCurrentIndex(-1);
        setSearchRange({ left: -1, right: -1 });
        return;
      }

      if (array[pos] < targetValue) {
        low = pos + 1;
      } else {
        high = pos - 1;
      }
    }

    setCurrentIndex(-1);
    setSearchRange({ left: -1, right: -1 });
    alert('Element not found!');
  };

  // Exponential Search
  const exponentialSearch = async () => {
    const targetValue = parseInt(target);
    if (isNaN(targetValue)) {
      alert('Please enter a valid number');
      return;
    }

    let comps = 0;

    if (array[0] === targetValue) {
      setFoundIndex(0);
      return;
    }

    let i = 1;
    while (i < array.length && array[i] <= targetValue) {
      if (!searching) return;

      setCurrentIndex(i);
      comps++;
      setComparisons(comps);
      await sleep(101 - speed);

      i *= 2;
    }

    // Binary search in range
    let left = Math.floor(i / 2);
    let right = Math.min(i, array.length - 1);

    while (left <= right) {
      if (!searching) return;

      const mid = Math.floor((left + right) / 2);
      setSearchRange({ left, right });
      setCurrentIndex(mid);
      comps++;
      setComparisons(comps);
      await sleep(101 - speed);

      if (array[mid] === targetValue) {
        setFoundIndex(mid);
        setCurrentIndex(-1);
        setSearchRange({ left: -1, right: -1 });
        return;
      }

      if (array[mid] < targetValue) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    setCurrentIndex(-1);
    setSearchRange({ left: -1, right: -1 });
    alert('Element not found!');
  };

  // Fibonacci Search
  const fibonacciSearch = async () => {
    const targetValue = parseInt(target);
    if (isNaN(targetValue)) {
      alert('Please enter a valid number');
      return;
    }

    let comps = 0;
    let fibM2 = 0;
    let fibM1 = 1;
    let fibM = fibM2 + fibM1;

    while (fibM < array.length) {
      fibM2 = fibM1;
      fibM1 = fibM;
      fibM = fibM2 + fibM1;
    }

    let offset = -1;

    while (fibM > 1) {
      if (!searching) return;

      const i = Math.min(offset + fibM2, array.length - 1);

      setCurrentIndex(i);
      comps++;
      setComparisons(comps);
      await sleep(101 - speed);

      if (array[i] < targetValue) {
        fibM = fibM1;
        fibM1 = fibM2;
        fibM2 = fibM - fibM1;
        offset = i;
      } else if (array[i] > targetValue) {
        fibM = fibM2;
        fibM1 = fibM1 - fibM2;
        fibM2 = fibM - fibM1;
      } else {
        setFoundIndex(i);
        setCurrentIndex(-1);
        return;
      }
    }

    if (fibM1 && offset + 1 < array.length && array[offset + 1] === targetValue) {
      setFoundIndex(offset + 1);
      setCurrentIndex(-1);
      return;
    }

    setCurrentIndex(-1);
    alert('Element not found!');
  };

  const startSearch = async () => {
    if (!target) {
      alert('Please enter a target value');
      return;
    }

    setSearching(true);
    resetSearch();

    switch (algorithm) {
      case 'linear':
        await linearSearch();
        break;
      case 'binary':
        await binarySearch();
        break;
      case 'jump':
        await jumpSearch();
        break;
      case 'interpolation':
        await interpolationSearch();
        break;
      case 'exponential':
        await exponentialSearch();
        break;
      case 'fibonacci':
        await fibonacciSearch();
        break;
      default:
        break;
    }

    setSearching(false);
  };

  const stopSearch = () => {
    setSearching(false);
  };

  return (
    <div className="searching-visualizer-page">
      <div className="page-header">
        <h2>🔍 Searching Algorithms Visualizer</h2>
        <p className="page-subtitle">Explore different searching algorithms with interactive visualization</p>
      </div>

      <div className="controls-container">
        <div className="control-group">
          <h3>⚙️ Search Settings</h3>
          <div className="controls-row">
            <div className="control-item">
              <label>Algorithm:</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                disabled={searching}
                className="select-input"
              >
                {Object.entries(algorithms).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.name} - {value.complexity}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-item">
              <label>Target Value:</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Enter number to search"
                disabled={searching}
                className="target-input"
              />
            </div>

            <div className="control-item">
              <label>Array Size: {arraySize}</label>
              <input
                type="range"
                min="10"
                max="50"
                value={arraySize}
                onChange={(e) => setArraySize(parseInt(e.target.value))}
                disabled={searching}
                className="slider"
              />
            </div>

            <div className="control-item">
              <label>Speed: {speed}</label>
              <input
                type="range"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="slider"
              />
            </div>
          </div>

          <div className="button-group">
            <button onClick={startSearch} disabled={searching} className="btn btn-start">
              🔍 Start Search
            </button>
            <button onClick={stopSearch} disabled={!searching} className="btn btn-stop">
              ⏸️ Stop
            </button>
            <button onClick={generateArray} disabled={searching} className="btn btn-generate">
              🔢 Sequential Array
            </button>
            <button onClick={generateRandomArray} disabled={searching} className="btn btn-random">
              🎲 Random Sorted Array
            </button>
          </div>
        </div>

        <div className="stats-panel">
          <h3>📈 Search Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Algorithm</div>
              <div className="stat-value">{algorithms[algorithm].name}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Time Complexity</div>
              <div className="stat-value complexity-badge">{algorithms[algorithm].complexity}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Comparisons</div>
              <div className="stat-value">{comparisons}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Array Size</div>
              <div className="stat-value">{array.length}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Target Value</div>
              <div className="stat-value">{target || 'N/A'}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Status</div>
              <div className="stat-value">
                <span className={`status-badge ${searching ? 'searching' : foundIndex !== -1 ? 'found' : 'idle'}`}>
                  {searching ? '🔄 Searching...' : foundIndex !== -1 ? '✅ Found!' : '⏹️ Ready'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="visualization-container">
        <h3>🎨 Array Visualization</h3>
        <div className="legend">
          <span className="legend-item"><span className="legend-color default"></span> Default</span>
          <span className="legend-item"><span className="legend-color visited"></span> Visited</span>
          <span className="legend-item"><span className="legend-color current"></span> Current</span>
          <span className="legend-item"><span className="legend-color in-range"></span> In Range</span>
          {algorithm === 'jump' && <span className="legend-item"><span className="legend-color jump"></span> Jump Steps</span>}
          <span className="legend-item"><span className="legend-color found"></span> Found</span>
        </div>
        <div className="array-items-container">
          {array.map((value, idx) => (
            <div
              key={idx}
              className={`array-item
                ${visitedIndices.includes(idx) ? 'visited' : ''}
                ${currentIndex === idx ? 'current' : ''}
                ${foundIndex === idx ? 'found' : ''}
                ${jumpSteps.includes(idx) ? 'jump-step' : ''}
                ${searchRange.left !== -1 && idx >= searchRange.left && idx <= searchRange.right ? 'in-range' : ''}
              `}
            >
              <div className="item-value">{value}</div>
              <div className="item-index">[{idx}]</div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h3>💡 Algorithm Information</h3>
        <div className="algorithms-grid">
          <div className="algorithm-card">
            <h4>🔵 Linear Search</h4>
            <p><strong>Complexity:</strong> O(n)</p>
            <p>Sequentially checks each element until target is found</p>
            <p><strong>Best for:</strong> Unsorted arrays, small datasets</p>
            <p><strong>Space:</strong> O(1)</p>
          </div>

          <div className="algorithm-card">
            <h4>🟢 Binary Search</h4>
            <p><strong>Complexity:</strong> O(log n)</p>
            <p>Divides sorted array in half repeatedly</p>
            <p><strong>Best for:</strong> Large sorted arrays</p>
            <p><strong>Space:</strong> O(1) iterative, O(log n) recursive</p>
          </div>

          <div className="algorithm-card">
            <h4>🟡 Jump Search</h4>
            <p><strong>Complexity:</strong> O(√n)</p>
            <p>Jumps by fixed steps, then linear search in block</p>
            <p><strong>Best for:</strong> Sorted arrays, better than linear</p>
            <p><strong>Space:</strong> O(1)</p>
          </div>

          <div className="algorithm-card">
            <h4>🟣 Interpolation Search</h4>
            <p><strong>Complexity:</strong> O(log log n) average</p>
            <p>Estimates position based on value distribution</p>
            <p><strong>Best for:</strong> Uniformly distributed sorted data</p>
            <p><strong>Space:</strong> O(1)</p>
          </div>

          <div className="algorithm-card">
            <h4>🔴 Exponential Search</h4>
            <p><strong>Complexity:</strong> O(log n)</p>
            <p>Finds range exponentially, then binary search</p>
            <p><strong>Best for:</strong> Unbounded/infinite arrays</p>
            <p><strong>Space:</strong> O(1)</p>
          </div>

          <div className="algorithm-card">
            <h4>🟠 Fibonacci Search</h4>
            <p><strong>Complexity:</strong> O(log n)</p>
            <p>Uses Fibonacci numbers to divide array</p>
            <p><strong>Best for:</strong> Large arrays, division expensive</p>
            <p><strong>Space:</strong> O(1)</p>
          </div>
        </div>
      </div>

      <div className="comparison-section">
        <h3>📊 Algorithm Comparison</h3>
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Time Complexity</th>
                <th>Space Complexity</th>
                <th>Requires Sorted?</th>
                <th>Best Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Linear Search</td>
                <td>O(n)</td>
                <td>O(1)</td>
                <td>No</td>
                <td>Small or unsorted arrays</td>
              </tr>
              <tr>
                <td>Binary Search</td>
                <td>O(log n)</td>
                <td>O(1)</td>
                <td>Yes</td>
                <td>Large sorted arrays</td>
              </tr>
              <tr>
                <td>Jump Search</td>
                <td>O(√n)</td>
                <td>O(1)</td>
                <td>Yes</td>
                <td>Between linear and binary</td>
              </tr>
              <tr>
                <td>Interpolation</td>
                <td>O(log log n)*</td>
                <td>O(1)</td>
                <td>Yes</td>
                <td>Uniformly distributed data</td>
              </tr>
              <tr>
                <td>Exponential</td>
                <td>O(log n)</td>
                <td>O(1)</td>
                <td>Yes</td>
                <td>Unbounded arrays</td>
              </tr>
              <tr>
                <td>Fibonacci</td>
                <td>O(log n)</td>
                <td>O(1)</td>
                <td>Yes</td>
                <td>Division is expensive</td>
              </tr>
            </tbody>
          </table>
          <p className="table-note">* Average case for uniformly distributed data</p>
        </div>
      </div>
    </div>
  );
}

export default SearchingVisualizer;
