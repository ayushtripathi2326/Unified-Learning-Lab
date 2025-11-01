import React, { useState, useEffect } from 'react';
import './CNNVisualizer.css';

function CNNVisualizer() {
  const [mode, setMode] = useState('2d'); // '2d' or '3d'

  // 2D State
  const [imgRows, setImgRows] = useState(5);
  const [imgCols, setImgCols] = useState(5);
  const [filterRows, setFilterRows] = useState(3);
  const [filterCols, setFilterCols] = useState(3);
  const [stride, setStride] = useState(1);
  const [padding, setPadding] = useState(0);
  const [imageMatrix, setImageMatrix] = useState([]);
  const [filterMatrix, setFilterMatrix] = useState([]);
  const [output, setOutput] = useState('');

  // 3D State
  const [depth, setDepth] = useState(3);
  const [height, setHeight] = useState(4);
  const [width, setWidth] = useState(4);
  const [kDepth, setKDepth] = useState(3);
  const [kHeight, setKHeight] = useState(3);
  const [kWidth, setKWidth] = useState(3);
  const [input3D, setInput3D] = useState([]);
  const [kernel3D, setKernel3D] = useState([]);
  const [output3D, setOutput3D] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps3D, setSteps3D] = useState([]);

  const createMatrix = (rows, cols, type) => {
    const matrix = Array(rows).fill(0).map(() => Array(cols).fill(0));
    if (type === 'image') setImageMatrix(matrix);
    else setFilterMatrix(matrix);
  };

  const updateCell = (type, i, j, value) => {
    if (type === 'image') {
      const newMatrix = [...imageMatrix];
      newMatrix[i][j] = parseFloat(value) || 0;
      setImageMatrix(newMatrix);
    } else {
      const newMatrix = [...filterMatrix];
      newMatrix[i][j] = parseFloat(value) || 0;
      setFilterMatrix(newMatrix);
    }
  };

  const computeConvolution = () => {
    // Validate inputs
    if (imageMatrix.length === 0) {
      alert('Please create an image matrix first!');
      return;
    }
    if (filterMatrix.length === 0) {
      alert('Please create a filter matrix first!');
      return;
    }
    if (imageMatrix.length === 0 || imageMatrix[0].length === 0) {
      alert('Image matrix is empty!');
      return;
    }
    if (filterMatrix.length === 0 || filterMatrix[0].length === 0) {
      alert('Filter matrix is empty!');
      return;
    }

    const padded = padMatrix(imageMatrix, padding);
    const outRows = Math.floor((padded.length - filterRows) / stride) + 1;
    const outCols = Math.floor((padded[0].length - filterCols) / stride) + 1;

    // Validate output dimensions
    if (outRows <= 0 || outCols <= 0) {
      alert('Invalid convolution dimensions! Try reducing filter size, increasing image size, or adjusting stride/padding.');
      return;
    }

    const result = Array(outRows).fill(0).map(() => Array(outCols).fill(0));

    for (let i = 0; i < outRows; i++) {
      for (let j = 0; j < outCols; j++) {
        let sum = 0;
        for (let fi = 0; fi < filterRows; fi++) {
          for (let fj = 0; fj < filterCols; fj++) {
            sum += padded[i * stride + fi][j * stride + fj] * filterMatrix[fi][fj];
          }
        }
        result[i][j] = sum.toFixed(2);
      }
    }

    setOutput(`Feature Map (${outRows}x${outCols}):\n${result.map(row => row.join('  ')).join('\n')}`);
  };

  const padMatrix = (matrix, pad) => {
    // Safety check
    if (!matrix || matrix.length === 0 || !matrix[0]) {
      return matrix;
    }

    const rows = matrix.length;
    const cols = matrix[0].length;
    const padded = Array(rows + 2 * pad).fill(0).map(() => Array(cols + 2 * pad).fill(0));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        padded[i + pad][j + pad] = matrix[i][j];
      }
    }
    return padded;
  };

  return (
    <div className="cnn-visualizer">
      <div className="page-header">
        <h2>🧠 CNN Convolution Visualizer</h2>
        <p className="page-subtitle">Understand 2D convolution operations with custom input and filter matrices</p>
      </div>
      <div className="controls">
        <h3>⚙️ Configuration</h3>
        <div>
          <label>Image Matrix: </label>
          <input type="number" value={imgRows} onChange={(e) => setImgRows(+e.target.value)} placeholder="Rows" min="2" max="10" /> ×
          <input type="number" value={imgCols} onChange={(e) => setImgCols(+e.target.value)} placeholder="Cols" min="2" max="10" />
          <button onClick={() => createMatrix(imgRows, imgCols, 'image')} className="btn">Create Image</button>
        </div>
        <div>
          <label>Filter Matrix: </label>
          <input type="number" value={filterRows} onChange={(e) => setFilterRows(+e.target.value)} placeholder="Rows" min="2" max="5" /> ×
          <input type="number" value={filterCols} onChange={(e) => setFilterCols(+e.target.value)} placeholder="Cols" min="2" max="5" />
          <button onClick={() => createMatrix(filterRows, filterCols, 'filter')} className="btn">Create Filter</button>
        </div>
        <div>
          <label>Stride: </label>
          <input type="number" value={stride} onChange={(e) => setStride(+e.target.value)} min="1" max="3" />
          <label>Padding: </label>
          <input type="number" value={padding} onChange={(e) => setPadding(+e.target.value)} min="0" max="2" />
        </div>

        <button
          onClick={computeConvolution}
          className="btn btn-primary"
          disabled={imageMatrix.length === 0 || filterMatrix.length === 0}
        >
          {imageMatrix.length === 0 || filterMatrix.length === 0 ? '⚠️ Create Matrices First' : '▶️ Compute Convolution'}
        </button>

        {imageMatrix.length === 0 && filterMatrix.length === 0 && (
          <p style={{ color: '#f57c00', marginTop: '10px', fontSize: '15px', fontWeight: '500', textAlign: 'center' }}>
            💡 Create both Image and Filter matrices to get started
          </p>
        )}
        {imageMatrix.length === 0 && filterMatrix.length > 0 && (
          <p style={{ color: '#f57c00', marginTop: '10px', fontSize: '15px', fontWeight: '500', textAlign: 'center' }}>
            💡 Create Image matrix to enable convolution
          </p>
        )}
        {imageMatrix.length > 0 && filterMatrix.length === 0 && (
          <p style={{ color: '#f57c00', marginTop: '10px', fontSize: '15px', fontWeight: '500', textAlign: 'center' }}>
            💡 Create Filter matrix to enable convolution
          </p>
        )}
      </div>

      <div className="matrices">
        {imageMatrix.length > 0 && (
          <div className="matrix-container">
            <h3>📊 Image Matrix ({imgRows}×{imgCols})</h3>
            <table>
              <tbody>
                {imageMatrix.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>
                        <input type="number" value={cell} onChange={(e) => updateCell('image', i, j, e.target.value)} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filterMatrix.length > 0 && (
          <div className="matrix-container">
            <h3>🔍 Filter/Kernel ({filterRows}×{filterCols})</h3>
            <table>
              <tbody>
                {filterMatrix.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>
                        <input type="number" value={cell} onChange={(e) => updateCell('filter', i, j, e.target.value)} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {output && (
        <div className="output">
          <h3>✨ Output Feature Map</h3>
          <pre style={{ fontSize: '16px', color: '#2e7d32', fontWeight: '600', textAlign: 'center', margin: '20px 0' }}>{output}</pre>
        </div>
      )}
    </div>
  );
}

export default CNNVisualizer;
