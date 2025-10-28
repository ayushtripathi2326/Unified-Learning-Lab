import React, { useState, useEffect } from 'react';
import './SortingVisualizer.css';

function SortingVisualizer() {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(20);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [sorting, setSorting] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [comparing, setComparing] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [pivotIndex, setPivotIndex] = useState(-1);
  const [minIndex, setMinIndex] = useState(-1);
  const [swapping, setSwapping] = useState([]);

  const algorithms = {
    bubble: { name: 'Bubble Sort', complexity: 'O(n²)' },
    selection: { name: 'Selection Sort', complexity: 'O(n²)' },
    insertion: { name: 'Insertion Sort', complexity: 'O(n²)' },
    merge: { name: 'Merge Sort', complexity: 'O(n log n)' },
    quick: { name: 'Quick Sort', complexity: 'O(n log n)' },
    heap: { name: 'Heap Sort', complexity: 'O(n log n)' }
  };

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 400) + 20
    );
    setArray(newArray);
    setComparisons(0);
    setSwaps(0);
    setComparing([]);
    setSorted([]);
    setPivotIndex(-1);
    setMinIndex(-1);
    setSwapping([]);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Bubble Sort
  const bubbleSort = async () => {
    const arr = [...array];
    let comps = 0, swps = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (!sorting) return;

        setComparing([j, j + 1]);
        comps++;
        setComparisons(comps);
        await sleep(101 - speed);

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swps++;
          setSwaps(swps);
          setArray([...arr]);
        }
      }
      setSorted(prev => [...prev, arr.length - 1 - i]);
    }
    setSorted(Array.from({ length: arr.length }, (_, i) => i));
    setComparing([]);
  };

  // Selection Sort
  const selectionSort = async () => {
    const arr = [...array];
    let comps = 0, swps = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      let minIdx = i;
      setMinIndex(minIdx);

      for (let j = i + 1; j < arr.length; j++) {
        if (!sorting) return;

        setComparing([minIdx, j]);
        comps++;
        setComparisons(comps);
        await sleep(101 - speed);

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          setMinIndex(minIdx);
        }
      }

      if (minIdx !== i) {
        setSwapping([i, minIdx]);
        await sleep(101 - speed);
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        swps++;
        setSwaps(swps);
        setArray([...arr]);
        await sleep(101 - speed);
        setSwapping([]);
      }
      setSorted(prev => [...prev, i]);
      setMinIndex(-1);
    }
    setSorted(Array.from({ length: arr.length }, (_, i) => i));
    setComparing([]);
  };

  // Insertion Sort
  const insertionSort = async () => {
    const arr = [...array];
    let comps = 0, swps = 0;
    setSorted([0]);

    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;

      while (j >= 0) {
        if (!sorting) return;

        setComparing([j, j + 1]);
        comps++;
        setComparisons(comps);
        await sleep(101 - speed);

        if (arr[j] > key) {
          arr[j + 1] = arr[j];
          swps++;
          setSwaps(swps);
          setArray([...arr]);
          j--;
        } else {
          break;
        }
      }
      arr[j + 1] = key;
      setArray([...arr]);
      setSorted(prev => [...prev, i]);
    }
    setComparing([]);
  };

  // Merge Sort
  const mergeSort = async () => {
    const arr = [...array];
    let comps = 0, swps = 0;

    const merge = async (arr, left, mid, right) => {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);
      let i = 0, j = 0, k = left;

      while (i < leftArr.length && j < rightArr.length) {
        if (!sorting) return;

        setComparing([left + i, mid + 1 + j]);
        comps++;
        setComparisons(comps);
        await sleep(101 - speed);

        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }
        swps++;
        setSwaps(swps);
        setArray([...arr]);
        k++;
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        i++;
        k++;
        setArray([...arr]);
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        j++;
        k++;
        setArray([...arr]);
      }
    };

    const mergeSortHelper = async (arr, left, right) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await mergeSortHelper(arr, left, mid);
        await mergeSortHelper(arr, mid + 1, right);
        await merge(arr, left, mid, right);
      }
    };

    await mergeSortHelper(arr, 0, arr.length - 1);
    setSorted(Array.from({ length: arr.length }, (_, i) => i));
    setComparing([]);
  };

  // Quick Sort
  const quickSort = async () => {
    const arr = [...array];
    let comps = 0, swps = 0;

    const partition = async (arr, low, high) => {
      const pivot = arr[high];
      setPivotIndex(high);
      let i = low - 1;

      for (let j = low; j < high; j++) {
        if (!sorting) return i + 1;

        setComparing([j, high]);
        comps++;
        setComparisons(comps);
        await sleep(101 - speed);

        if (arr[j] < pivot) {
          i++;
          setSwapping([i, j]);
          await sleep(101 - speed);
          [arr[i], arr[j]] = [arr[j], arr[i]];
          swps++;
          setSwaps(swps);
          setArray([...arr]);
          await sleep(101 - speed);
          setSwapping([]);
        }
      }

      setSwapping([i + 1, high]);
      await sleep(101 - speed);
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      swps++;
      setSwaps(swps);
      setArray([...arr]);
      await sleep(101 - speed);
      setSwapping([]);
      setPivotIndex(-1);
      return i + 1;
    };

    const quickSortHelper = async (arr, low, high) => {
      if (low < high) {
        const pi = await partition(arr, low, high);
        await quickSortHelper(arr, low, pi - 1);
        await quickSortHelper(arr, pi + 1, high);
      }
    };

    await quickSortHelper(arr, 0, arr.length - 1);
    setSorted(Array.from({ length: arr.length }, (_, i) => i));
    setComparing([]);
  };

  // Heap Sort
  const heapSort = async () => {
    const arr = [...array];
    let comps = 0, swps = 0;

    const heapify = async (arr, n, i) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n) {
        setComparing([largest, left]);
        comps++;
        setComparisons(comps);
        await sleep(101 - speed);
        if (arr[left] > arr[largest]) {
          largest = left;
        }
      }

      if (right < n) {
        setComparing([largest, right]);
        comps++;
        setComparisons(comps);
        await sleep(101 - speed);
        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }

      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        swps++;
        setSwaps(swps);
        setArray([...arr]);
        await heapify(arr, n, largest);
      }
    };

    // Build max heap
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      await heapify(arr, arr.length, i);
    }

    // Extract elements from heap
    for (let i = arr.length - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      swps++;
      setSwaps(swps);
      setArray([...arr]);
      setSorted(prev => [...prev, i]);
      await heapify(arr, i, 0);
    }

    setSorted(Array.from({ length: arr.length }, (_, i) => i));
    setComparing([]);
  };

  const startSort = async () => {
    setSorting(true);
    setSorted([]);
    setComparing([]);

    switch (algorithm) {
      case 'bubble':
        await bubbleSort();
        break;
      case 'selection':
        await selectionSort();
        break;
      case 'insertion':
        await insertionSort();
        break;
      case 'merge':
        await mergeSort();
        break;
      case 'quick':
        await quickSort();
        break;
      case 'heap':
        await heapSort();
        break;
      default:
        break;
    }

    setSorting(false);
  };

  const stopSort = () => {
    setSorting(false);
  };

  return (
    <div className="sorting-visualizer-page">
      <div className="page-header">
        <h2>📊 Sorting Algorithms Visualizer</h2>
        <p className="page-subtitle">Visual comparison of different sorting algorithms with real-time statistics</p>
      </div>

      <div className="controls-container">
        <div className="control-group">
          <h3>⚙️ Algorithm Settings</h3>
          <div className="controls-row">
            <div className="control-item">
              <label>Algorithm:</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                disabled={sorting}
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
              <label>Array Size: {arraySize}</label>
              <input
                type="range"
                min="5"
                max="100"
                value={arraySize}
                onChange={(e) => setArraySize(parseInt(e.target.value))}
                disabled={sorting}
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
            <button onClick={startSort} disabled={sorting} className="btn btn-start">
              ▶️ Start Sort
            </button>
            <button onClick={stopSort} disabled={!sorting} className="btn btn-stop">
              ⏸️ Stop
            </button>
            <button onClick={generateArray} disabled={sorting} className="btn btn-generate">
              🔄 Generate New Array
            </button>
          </div>
        </div>

        <div className="stats-panel">
          <h3>📈 Statistics</h3>
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
              <div className="stat-label">Swaps</div>
              <div className="stat-value">{swaps}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Array Size</div>
              <div className="stat-value">{array.length}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Status</div>
              <div className="stat-value">
                <span className={`status-badge ${sorting ? 'sorting' : 'idle'}`}>
                  {sorting ? '🔄 Sorting...' : '✅ Ready'}
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
          <span className="legend-item"><span className="legend-color comparing"></span> Comparing</span>
          <span className="legend-item"><span className="legend-color swapping"></span> Swapping</span>
          {algorithm === 'selection' && <span className="legend-item"><span className="legend-color minimum"></span> Minimum</span>}
          {algorithm === 'quick' && <span className="legend-item"><span className="legend-color pivot"></span> Pivot</span>}
          <span className="legend-item"><span className="legend-color sorted"></span> Sorted</span>
        </div>
        <div className="array-bars-container">
          {array.map((value, idx) => (
            <div
              key={idx}
              className={`array-bar
                ${comparing.includes(idx) ? 'comparing' : ''}
                ${swapping.includes(idx) ? 'swapping' : ''}
                ${sorted.includes(idx) ? 'sorted' : ''}
                ${pivotIndex === idx ? 'pivot' : ''}
                ${minIndex === idx ? 'minimum' : ''}
              `}
              style={{
                height: `${value}px`,
                width: `${Math.max(100 / arraySize, 2)}%`
              }}
            >
              {arraySize <= 20 && <span className="bar-value">{value}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h3>💡 Algorithm Information</h3>
        <div className="algorithms-grid">
          <div className="algorithm-card">
            <h4>🔵 Bubble Sort</h4>
            <p><strong>Complexity:</strong> O(n²)</p>
            <p>Repeatedly swaps adjacent elements if they are in wrong order</p>
            <p><strong>Best for:</strong> Small datasets, nearly sorted arrays</p>
          </div>

          <div className="algorithm-card">
            <h4>🟢 Selection Sort</h4>
            <p><strong>Complexity:</strong> O(n²)</p>
            <p>Selects minimum element and places it at beginning</p>
            <p><strong>Best for:</strong> Small datasets, minimal memory writes</p>
          </div>

          <div className="algorithm-card">
            <h4>🟡 Insertion Sort</h4>
            <p><strong>Complexity:</strong> O(n²)</p>
            <p>Builds sorted array one element at a time</p>
            <p><strong>Best for:</strong> Small or nearly sorted datasets</p>
          </div>

          <div className="algorithm-card">
            <h4>🟣 Merge Sort</h4>
            <p><strong>Complexity:</strong> O(n log n)</p>
            <p>Divide and conquer: divides array and merges sorted halves</p>
            <p><strong>Best for:</strong> Large datasets, stable sorting needed</p>
          </div>

          <div className="algorithm-card">
            <h4>🔴 Quick Sort</h4>
            <p><strong>Complexity:</strong> O(n log n) avg</p>
            <p>Picks pivot and partitions array around it</p>
            <p><strong>Best for:</strong> Large datasets, average case performance</p>
          </div>

          <div className="algorithm-card">
            <h4>🟠 Heap Sort</h4>
            <p><strong>Complexity:</strong> O(n log n)</p>
            <p>Builds max heap and extracts maximum repeatedly</p>
            <p><strong>Best for:</strong> Guaranteed O(n log n), in-place sorting</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SortingVisualizer;
