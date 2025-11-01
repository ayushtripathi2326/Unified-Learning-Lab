import React, { useState } from 'react';
import './GreedyAlgorithms.css';

function GreedyAlgorithms() {
  const [selectedAlgo, setSelectedAlgo] = useState('activity');
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);
  const [executing, setExecuting] = useState(false);

  // Activity Selection
  const activitySelection = async (activities) => {
    const stepsArr = [];
    const sorted = activities.sort((a, b) => a.end - b.end);
    stepsArr.push(`Activities sorted by end time: ${JSON.stringify(sorted)}`);

    const selected = [sorted[0]];
    stepsArr.push(`Select activity: (${sorted[0].start}, ${sorted[0].end})`);

    let lastEnd = sorted[0].end;

    for (let i = 1; i < sorted.length; i++) {
      await sleep(500);
      if (sorted[i].start >= lastEnd) {
        selected.push(sorted[i]);
        lastEnd = sorted[i].end;
        stepsArr.push(`✅ Select activity: (${sorted[i].start}, ${sorted[i].end}) - No overlap`);
      } else {
        stepsArr.push(`❌ Skip activity: (${sorted[i].start}, ${sorted[i].end}) - Overlaps`);
      }
      setSteps([...stepsArr]);
    }

    return { result: selected.length, steps: stepsArr, selected };
  };

  // Fractional Knapsack
  const fractionalKnapsack = async (items, capacity) => {
    const stepsArr = [];
    stepsArr.push(`Knapsack capacity: ${capacity}`);

    // Calculate value/weight ratio
    const itemsWithRatio = items.map(item => ({
      ...item,
      ratio: item.value / item.weight
    }));

    // Sort by ratio descending
    itemsWithRatio.sort((a, b) => b.ratio - a.ratio);
    stepsArr.push(`Items sorted by value/weight ratio (descending)`);

    let totalValue = 0;
    let remainingCapacity = capacity;
    const taken = [];

    for (let item of itemsWithRatio) {
      await sleep(500);
      if (remainingCapacity === 0) break;

      if (item.weight <= remainingCapacity) {
        totalValue += item.value;
        remainingCapacity -= item.weight;
        taken.push({ ...item, fraction: 1 });
        stepsArr.push(`✅ Take full item: weight=${item.weight}, value=${item.value}, ratio=${item.ratio.toFixed(2)}`);
      } else {
        const fraction = remainingCapacity / item.weight;
        totalValue += item.value * fraction;
        taken.push({ ...item, fraction });
        stepsArr.push(`✅ Take ${(fraction * 100).toFixed(1)}% of item: value=${(item.value * fraction).toFixed(2)}`);
        remainingCapacity = 0;
      }
      stepsArr.push(`Current total value: ${totalValue.toFixed(2)}, Remaining capacity: ${remainingCapacity}`);
      setSteps([...stepsArr]);
    }

    return { result: totalValue.toFixed(2), steps: stepsArr, taken };
  };

  // Huffman Coding
  const huffmanCoding = async (frequencies) => {
    const stepsArr = [];
    stepsArr.push(`Character frequencies: ${JSON.stringify(frequencies)}`);

    // Create nodes
    let nodes = Object.entries(frequencies).map(([char, freq]) => ({
      char,
      freq,
      left: null,
      right: null
    }));

    stepsArr.push(`Initial nodes: ${nodes.map(n => `${n.char}:${n.freq}`).join(', ')}`);

    // Build Huffman tree
    while (nodes.length > 1) {
      await sleep(500);
      nodes.sort((a, b) => a.freq - b.freq);

      const left = nodes.shift();
      const right = nodes.shift();

      const newNode = {
        char: left.char + right.char,
        freq: left.freq + right.freq,
        left,
        right
      };

      nodes.push(newNode);
      stepsArr.push(`Merge: ${left.char}(${left.freq}) + ${right.char}(${right.freq}) = ${newNode.char}(${newNode.freq})`);
      setSteps([...stepsArr]);
    }

    // Generate codes
    const codes = {};
    const generateCodes = (node, code = '') => {
      if (!node.left && !node.right) {
        codes[node.char] = code || '0';
        return;
      }
      if (node.left) generateCodes(node.left, code + '0');
      if (node.right) generateCodes(node.right, code + '1');
    };

    generateCodes(nodes[0]);
    stepsArr.push(`Huffman Codes: ${JSON.stringify(codes)}`);

    return { result: JSON.stringify(codes, null, 2), steps: stepsArr, codes };
  };

  // Coin Change Greedy
  const coinChangeGreedy = async (coins, amount) => {
    const stepsArr = [];
    stepsArr.push(`Amount to make: ${amount}`);
    stepsArr.push(`Available coins: [${coins.join(', ')}]`);

    const sorted = [...coins].sort((a, b) => b - a);
    stepsArr.push(`Coins sorted (descending): [${sorted.join(', ')}]`);

    let remaining = amount;
    const result = [];

    for (let coin of sorted) {
      await sleep(500);
      if (remaining === 0) break;

      const count = Math.floor(remaining / coin);
      if (count > 0) {
        result.push({ coin, count });
        remaining -= coin * count;
        stepsArr.push(`Use ${count} coin(s) of ${coin}, Remaining: ${remaining}`);
        setSteps([...stepsArr]);
      }
    }

    if (remaining > 0) {
      stepsArr.push(`❌ Cannot make exact change (greedy doesn't always work!)`);
    }

    return { result: result.length > 0 ? JSON.stringify(result, null, 2) : 'No solution', steps: stepsArr };
  };

  const handleExecute = async () => {
    setExecuting(true);
    setResult(null);
    setSteps([]);

    try {
      let output;
      switch (selectedAlgo) {
        case 'activity':
          const activities = JSON.parse(input);
          if (!Array.isArray(activities) || activities.length === 0) {
            alert('Please enter valid activities array: [{start:1,end:3},{start:2,end:4}]');
            setExecuting(false);
            return;
          }
          output = await activitySelection(activities);
          break;

        case 'knapsack':
          const parts = input.split('|').map(s => s.trim());
          if (parts.length !== 2) {
            alert('Format: [{weight:w,value:v}...]|capacity');
            setExecuting(false);
            return;
          }
          const items = JSON.parse(parts[0]);
          const capacity = parseFloat(parts[1]);
          output = await fractionalKnapsack(items, capacity);
          break;

        case 'huffman':
          const freq = JSON.parse(input);
          if (typeof freq !== 'object') {
            alert('Please enter valid frequencies: {"a":5,"b":9,"c":12}');
            setExecuting(false);
            return;
          }
          output = await huffmanCoding(freq);
          break;

        case 'coinchange':
          const [coinsStr, amountStr] = input.split('|').map(s => s.trim());
          const coins = JSON.parse(coinsStr);
          const amount = parseInt(amountStr);
          output = await coinChangeGreedy(coins, amount);
          break;

        default:
          break;
      }

      setResult(output.result);
      setSteps(output.steps);
    } catch (error) {
      alert('Invalid input format: ' + error.message);
    }

    setExecuting(false);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const getPlaceholder = () => {
    switch (selectedAlgo) {
      case 'activity':
        return '[{start:1,end:3},{start:2,end:5},{start:4,end:7}]';
      case 'knapsack':
        return '[{weight:10,value:60},{weight:20,value:100}]|50';
      case 'huffman':
        return '{"a":5,"b":9,"c":12,"d":13,"e":16,"f":45}';
      case 'coinchange':
        return '[1,5,10,25]|63';
      default:
        return '';
    }
  };

  const getDefaultInput = () => {
    switch (selectedAlgo) {
      case 'activity':
        return '[{"start":1,"end":3},{"start":2,"end":5},{"start":4,"end":7},{"start":1,"end":8},{"start":6,"end":9}]';
      case 'knapsack':
        return '[{"weight":10,"value":60},{"weight":20,"value":100},{"weight":30,"value":120}]|50';
      case 'huffman':
        return '{"a":5,"b":9,"c":12,"d":13,"e":16,"f":45}';
      case 'coinchange':
        return '[1,5,10,25]|63';
      default:
        return '';
    }
  };

  const handleAlgoChange = (algo) => {
    setSelectedAlgo(algo);
    setInput(getDefaultInput());
    setResult(null);
    setSteps([]);
  };

  return (
    <div className="greedy-page">
      <div className="page-header">
        <h2>💚 Greedy Algorithms</h2>
        <p className="page-subtitle">
          Make locally optimal choice at each step to find global optimum
        </p>
      </div>

      <div className="algo-selector">
        <h3>🎯 Select Algorithm:</h3>
        <div className="algo-buttons">
          <button
            className={`algo-btn ${selectedAlgo === 'activity' ? 'active' : ''}`}
            onClick={() => handleAlgoChange('activity')}
          >
            📅 Activity Selection
          </button>
          <button
            className={`algo-btn ${selectedAlgo === 'knapsack' ? 'active' : ''}`}
            onClick={() => handleAlgoChange('knapsack')}
          >
            🎒 Fractional Knapsack
          </button>
          <button
            className={`algo-btn ${selectedAlgo === 'huffman' ? 'active' : ''}`}
            onClick={() => handleAlgoChange('huffman')}
          >
            🌲 Huffman Coding
          </button>
          <button
            className={`algo-btn ${selectedAlgo === 'coinchange' ? 'active' : ''}`}
            onClick={() => handleAlgoChange('coinchange')}
          >
            💰 Coin Change
          </button>
        </div>
      </div>

      <div className="greedy-controls">
        <div className="input-section">
          <label>Input:</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getPlaceholder()}
            disabled={executing}
            rows={3}
          />
          <button
            onClick={handleExecute}
            className="btn-execute"
            disabled={executing}
          >
            {executing ? '⏳ Executing...' : '▶️ Execute'}
          </button>
        </div>

        {result !== null && (
          <div className="result-section">
            <h3>✅ Result:</h3>
            <pre className="result-value">{result}</pre>
          </div>
        )}
      </div>

      {steps.length > 0 && (
        <div className="steps-section">
          <h3>📝 Execution Steps</h3>
          <div className="steps-list">
            {steps.map((step, idx) => (
              <div key={idx} className="step-item">
                <span className="step-number">{idx + 1}</span>
                <span className="step-text">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="info-section">
        <h3>💡 Greedy Algorithms Explained</h3>
        <div className="algos-grid">
          <div className="algo-card">
            <h4>📅 Activity Selection</h4>
            <p><strong>Problem:</strong> Select maximum non-overlapping activities</p>
            <p><strong>Strategy:</strong> Always pick activity with earliest end time</p>
            <p><strong>Time:</strong> O(n log n)</p>
            <p className="example">Example: Schedule meetings in a conference room</p>
          </div>

          <div className="algo-card">
            <h4>🎒 Fractional Knapsack</h4>
            <p><strong>Problem:</strong> Maximize value with weight constraint (can take fractions)</p>
            <p><strong>Strategy:</strong> Sort by value/weight ratio, take highest first</p>
            <p><strong>Time:</strong> O(n log n)</p>
            <p className="example">Example: Fill knapsack to maximize total value</p>
          </div>

          <div className="algo-card">
            <h4>🌲 Huffman Coding</h4>
            <p><strong>Problem:</strong> Optimal prefix-free encoding for data compression</p>
            <p><strong>Strategy:</strong> Build tree by merging lowest frequency nodes</p>
            <p><strong>Time:</strong> O(n log n)</p>
            <p className="example">Example: Compress text using variable-length codes</p>
          </div>

          <div className="algo-card">
            <h4>💰 Coin Change (Greedy)</h4>
            <p><strong>Problem:</strong> Make change using minimum coins</p>
            <p><strong>Strategy:</strong> Always pick largest coin that fits</p>
            <p><strong>Time:</strong> O(n)</p>
            <p className="example">⚠️ Note: Doesn't work for all coin systems!</p>
          </div>
        </div>
      </div>

      <div className="concepts-section">
        <h3>🎓 Greedy vs Dynamic Programming</h3>
        <div className="comparison-grid">
          <div className="comparison-card greedy">
            <h4>💚 Greedy Approach</h4>
            <ul>
              <li>✅ Makes local optimal choice</li>
              <li>✅ Never reconsiders choice</li>
              <li>✅ Faster - O(n log n) typical</li>
              <li>✅ Less memory - O(1) to O(n)</li>
              <li>❌ Doesn't always give optimal solution</li>
              <li>✅ Works for: Activity Selection, Huffman, MST</li>
            </ul>
          </div>
          <div className="comparison-card dp">
            <h4>🎯 Dynamic Programming</h4>
            <ul>
              <li>✅ Considers all possibilities</li>
              <li>✅ Solves overlapping subproblems</li>
              <li>⏰ Slower - O(n²) or worse</li>
              <li>💾 More memory - O(n) to O(n²)</li>
              <li>✅ Always gives optimal solution</li>
              <li>✅ Works for: 0/1 Knapsack, LCS, Edit Distance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GreedyAlgorithms;
