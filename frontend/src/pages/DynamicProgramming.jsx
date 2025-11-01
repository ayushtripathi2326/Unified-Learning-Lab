import React, { useState } from 'react';
import './DynamicProgramming.css';

function DynamicProgramming() {
  const [selectedProblem, setSelectedProblem] = useState('fibonacci');
  const [input, setInput] = useState('10');
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);
  const [dpTable, setDpTable] = useState([]);
  const [executing, setExecuting] = useState(false);

  // Fibonacci
  const fibonacci = async (n) => {
    const stepsArr = [];
    const dp = new Array(n + 1).fill(0);
    dp[0] = 0;
    dp[1] = 1;

    stepsArr.push(`Initialize: dp[0] = 0, dp[1] = 1`);
    setDpTable([...dp]);
    await sleep(500);

    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      stepsArr.push(`dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`);
      setDpTable([...dp]);
      await sleep(500);
    }

    return { result: dp[n], steps: stepsArr, table: dp };
  };

  // Longest Common Subsequence
  const lcs = async (str1, str2) => {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    const stepsArr = [];

    stepsArr.push(`Comparing strings: "${str1}" and "${str2}"`);
    stepsArr.push(`Creating DP table of size ${m+1} x ${n+1}`);

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          stepsArr.push(`Match: '${str1[i-1]}' at (${i},${j}) → dp[${i}][${j}] = ${dp[i][j]}`);
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          stepsArr.push(`No match at (${i},${j}) → max(${dp[i-1][j]}, ${dp[i][j-1]}) = ${dp[i][j]}`);
        }
        setDpTable(dp.map(row => [...row]));
        await sleep(300);
      }
    }

    return { result: dp[m][n], steps: stepsArr, table: dp };
  };

  // 0/1 Knapsack
  const knapsack = async (weights, values, capacity) => {
    const n = weights.length;
    const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
    const stepsArr = [];

    stepsArr.push(`Knapsack capacity: ${capacity}`);
    stepsArr.push(`Items: ${n}`);

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        if (weights[i - 1] <= w) {
          dp[i][w] = Math.max(
            values[i - 1] + dp[i - 1][w - weights[i - 1]],
            dp[i - 1][w]
          );
          stepsArr.push(`Item ${i}: weight=${weights[i-1]}, value=${values[i-1]} → dp[${i}][${w}] = ${dp[i][w]}`);
        } else {
          dp[i][w] = dp[i - 1][w];
        }
        setDpTable(dp.map(row => [...row]));
        await sleep(200);
      }
    }

    return { result: dp[n][capacity], steps: stepsArr, table: dp };
  };

  // Coin Change
  const coinChange = async (coins, amount) => {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    const stepsArr = [];

    stepsArr.push(`Target amount: ${amount}`);
    stepsArr.push(`Available coins: [${coins.join(', ')}]`);
    stepsArr.push(`Initialize: dp[0] = 0, others = ∞`);

    for (let i = 1; i <= amount; i++) {
      for (let coin of coins) {
        if (coin <= i) {
          dp[i] = Math.min(dp[i], dp[i - coin] + 1);
          stepsArr.push(`dp[${i}] = min(dp[${i}], dp[${i-coin}] + 1) = ${dp[i] === Infinity ? '∞' : dp[i]}`);
          setDpTable([...dp]);
          await sleep(300);
        }
      }
    }

    const result = dp[amount] === Infinity ? -1 : dp[amount];
    return { result, steps: stepsArr, table: dp };
  };

  const handleExecute = async () => {
    setExecuting(true);
    setResult(null);
    setSteps([]);
    setDpTable([]);

    try {
      let output;
      switch (selectedProblem) {
        case 'fibonacci':
          const n = parseInt(input);
          if (isNaN(n) || n < 0 || n > 20) {
            alert('Please enter a number between 0 and 20');
            setExecuting(false);
            return;
          }
          output = await fibonacci(n);
          break;

        case 'lcs':
          const [str1, str2] = input.split(',').map(s => s.trim());
          if (!str1 || !str2) {
            alert('Please enter two strings separated by comma (e.g., ABCD,ACBAD)');
            setExecuting(false);
            return;
          }
          output = await lcs(str1, str2);
          break;

        case 'knapsack':
          const parts = input.split('|').map(s => s.trim());
          if (parts.length !== 3) {
            alert('Format: weights|values|capacity (e.g., 2,3,4|3,4,5|5)');
            setExecuting(false);
            return;
          }
          const weights = parts[0].split(',').map(Number);
          const values = parts[1].split(',').map(Number);
          const capacity = parseInt(parts[2]);
          output = await knapsack(weights, values, capacity);
          break;

        case 'coinchange':
          const [coinsStr, amountStr] = input.split('|').map(s => s.trim());
          if (!coinsStr || !amountStr) {
            alert('Format: coins|amount (e.g., 1,2,5|11)');
            setExecuting(false);
            return;
          }
          const coins = coinsStr.split(',').map(Number);
          const amount = parseInt(amountStr);
          output = await coinChange(coins, amount);
          break;

        default:
          break;
      }

      setResult(output.result);
      setSteps(output.steps);
      setDpTable(output.table);
    } catch (error) {
      alert('Invalid input format');
    }

    setExecuting(false);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const getPlaceholder = () => {
    switch (selectedProblem) {
      case 'fibonacci':
        return 'Enter n (e.g., 10)';
      case 'lcs':
        return 'Enter two strings (e.g., ABCD,ACBAD)';
      case 'knapsack':
        return 'weights|values|capacity (e.g., 2,3,4|3,4,5|5)';
      case 'coinchange':
        return 'coins|amount (e.g., 1,2,5|11)';
      default:
        return '';
    }
  };

  const getDefaultInput = () => {
    switch (selectedProblem) {
      case 'fibonacci':
        return '10';
      case 'lcs':
        return 'ABCBDAB,BDCAB';
      case 'knapsack':
        return '2,3,4,5|3,4,5,6|8';
      case 'coinchange':
        return '1,2,5|11';
      default:
        return '';
    }
  };

  const handleProblemChange = (problem) => {
    setSelectedProblem(problem);
    setInput(getDefaultInput());
    setResult(null);
    setSteps([]);
    setDpTable([]);
  };

  const renderDPTable = () => {
    if (!dpTable || dpTable.length === 0) return null;

    if (Array.isArray(dpTable[0])) {
      // 2D table
      return (
        <div className="dp-table-2d">
          <table>
            <tbody>
              {dpTable.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="table-cell">
                      {cell === Infinity ? '∞' : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      // 1D table
      return (
        <div className="dp-table-1d">
          {dpTable.map((value, i) => (
            <div key={i} className="table-cell-1d">
              <div className="cell-index">{i}</div>
              <div className="cell-value">{value === Infinity ? '∞' : value}</div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="dp-page">
      <div className="page-header">
        <h2>🎯 Dynamic Programming</h2>
        <p className="page-subtitle">
          Solve complex problems by breaking them into overlapping subproblems
        </p>
      </div>

      <div className="problem-selector">
        <h3>📚 Select Problem:</h3>
        <div className="problem-buttons">
          <button
            className={`problem-btn ${selectedProblem === 'fibonacci' ? 'active' : ''}`}
            onClick={() => handleProblemChange('fibonacci')}
          >
            🔢 Fibonacci
          </button>
          <button
            className={`problem-btn ${selectedProblem === 'lcs' ? 'active' : ''}`}
            onClick={() => handleProblemChange('lcs')}
          >
            📝 LCS
          </button>
          <button
            className={`problem-btn ${selectedProblem === 'knapsack' ? 'active' : ''}`}
            onClick={() => handleProblemChange('knapsack')}
          >
            🎒 Knapsack
          </button>
          <button
            className={`problem-btn ${selectedProblem === 'coinchange' ? 'active' : ''}`}
            onClick={() => handleProblemChange('coinchange')}
          >
            💰 Coin Change
          </button>
        </div>
      </div>

      <div className="dp-controls">
        <div className="input-section">
          <label>Input:</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getPlaceholder()}
            disabled={executing}
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
            <h3>✅ Result: <span className="result-value">{result}</span></h3>
          </div>
        )}
      </div>

      {dpTable.length > 0 && (
        <div className="dp-table-section">
          <h3>📊 DP Table</h3>
          {renderDPTable()}
        </div>
      )}

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
        <h3>💡 DP Problems Explained</h3>
        <div className="problems-grid">
          <div className="problem-card">
            <h4>🔢 Fibonacci Sequence</h4>
            <p><strong>Problem:</strong> Find the nth Fibonacci number</p>
            <p><strong>Recurrence:</strong> F(n) = F(n-1) + F(n-2)</p>
            <p><strong>Time:</strong> O(n) | <strong>Space:</strong> O(n)</p>
            <p className="example">Example: F(10) = 55</p>
          </div>

          <div className="problem-card">
            <h4>📝 Longest Common Subsequence</h4>
            <p><strong>Problem:</strong> Find longest subsequence common to two strings</p>
            <p><strong>Recurrence:</strong> If match: dp[i][j] = dp[i-1][j-1] + 1</p>
            <p><strong>Time:</strong> O(m×n) | <strong>Space:</strong> O(m×n)</p>
            <p className="example">Example: "ABCD" & "ACBAD" → "ABD" (length 3)</p>
          </div>

          <div className="problem-card">
            <h4>🎒 0/1 Knapsack</h4>
            <p><strong>Problem:</strong> Maximize value with weight constraint</p>
            <p><strong>Recurrence:</strong> dp[i][w] = max(include, exclude)</p>
            <p><strong>Time:</strong> O(n×W) | <strong>Space:</strong> O(n×W)</p>
            <p className="example">Example: Items with weights & values, capacity limit</p>
          </div>

          <div className="problem-card">
            <h4>💰 Coin Change</h4>
            <p><strong>Problem:</strong> Minimum coins to make amount</p>
            <p><strong>Recurrence:</strong> dp[i] = min(dp[i], dp[i-coin] + 1)</p>
            <p><strong>Time:</strong> O(n×amount) | <strong>Space:</strong> O(amount)</p>
            <p className="example">Example: Coins [1,2,5], amount 11 → 3 coins</p>
          </div>
        </div>
      </div>

      <div className="concepts-section">
        <h3>🎓 DP Concepts</h3>
        <div className="concepts-grid">
          <div className="concept-card">
            <h4>📌 Overlapping Subproblems</h4>
            <p>Same subproblems are solved multiple times. DP stores solutions to avoid redundant computation.</p>
          </div>
          <div className="concept-card">
            <h4>🎯 Optimal Substructure</h4>
            <p>Optimal solution contains optimal solutions to subproblems. Build solution bottom-up.</p>
          </div>
          <div className="concept-card">
            <h4>📝 Memoization (Top-Down)</h4>
            <p>Recursive approach with caching. Solve problem recursively and store results.</p>
          </div>
          <div className="concept-card">
            <h4>📊 Tabulation (Bottom-Up)</h4>
            <p>Iterative approach building table. Start from base case and build up to solution.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DynamicProgramming;
