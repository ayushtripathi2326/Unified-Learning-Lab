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

  // 2D Animation State
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [convolutionSteps, setConvolutionSteps] = useState([]);
  const [outputMatrix, setOutputMatrix] = useState([]);

  // 3D State
  const [depth, setDepth] = useState(3);
  const [height, setHeight] = useState(4);
  const [width, setWidth] = useState(4);
  const [kDepth, setKDepth] = useState(3);
  const [kHeight, setKHeight] = useState(3);
  const [kWidth, setKWidth] = useState(3);
  const [stride3D, setStride3D] = useState(1);
  const [padding3D, setPadding3D] = useState(0);
  const [input3D, setInput3D] = useState([]);
  const [kernel3D, setKernel3D] = useState([]);
  const [output3D, setOutput3D] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps3D, setSteps3D] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Initialize 3D tensors when switching to 3D mode
  useEffect(() => {
    if (mode === '3d' && input3D.length === 0) {
      initializeTensors();
    }
  }, [mode]);

  const initializeTensors = () => {
    const input = Array(depth).fill(0).map(() =>
      Array(height).fill(0).map(() => Array(width).fill(0))
    );
    const kernel = Array(kDepth).fill(0).map(() =>
      Array(kHeight).fill(0).map(() => Array(kWidth).fill(0))
    );
    setInput3D(input);
    setKernel3D(kernel);
  };

  // 2D Functions
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
    if (imageMatrix.length === 0 || filterMatrix.length === 0) {
      alert('Please create both matrices first!');
      return;
    }

    const padded = padMatrix(imageMatrix, padding);
    const outRows = Math.floor((padded.length - filterRows) / stride) + 1;
    const outCols = Math.floor((padded[0].length - filterCols) / stride) + 1;

    if (outRows <= 0 || outCols <= 0) {
      alert('Invalid dimensions! Adjust parameters.');
      return;
    }

    const result = Array(outRows).fill(0).map(() => Array(outCols).fill(0));
    const steps = [];

    for (let i = 0; i < outRows; i++) {
      for (let j = 0; j < outCols; j++) {
        let sum = 0;
        const stepDetails = {
          filterRow: i * stride,
          filterCol: j * stride,
          outputRow: i,
          outputCol: j,
          calculations: []
        };

        for (let fi = 0; fi < filterRows; fi++) {
          for (let fj = 0; fj < filterCols; fj++) {
            const imgVal = padded[i * stride + fi][j * stride + fj];
            const filtVal = filterMatrix[fi][fj];
            const product = imgVal * filtVal;
            sum += product;
            stepDetails.calculations.push({
              imgRow: i * stride + fi,
              imgCol: j * stride + fj,
              imgVal,
              filtVal,
              product
            });
          }
        }
        result[i][j] = sum.toFixed(2);
        stepDetails.sum = sum.toFixed(2);
        steps.push(stepDetails);
      }
    }

    setOutputMatrix(result);
    setConvolutionSteps(steps);
    setOutput(`Feature Map (${outRows}x${outCols}):\n${result.map(row => row.join('  ')).join('\n')}`);
  };

  const playConvolutionAnimation = () => {
    if (convolutionSteps.length === 0) {
      alert('Please compute convolution first!');
      return;
    }
    setIsAnimating(true);
    setAnimationStep(0);

    const interval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev >= convolutionSteps.length - 1) {
          clearInterval(interval);
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
  };

  const padMatrix = (matrix, pad) => {
    if (!matrix || matrix.length === 0 || !matrix[0]) return matrix;
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

  // 3D Functions
  const updateCell3D = (type, d, h, w, value) => {
    if (type === 'input') {
      const newTensor = JSON.parse(JSON.stringify(input3D));
      newTensor[d][h][w] = parseFloat(value) || 0;
      setInput3D(newTensor);
    } else {
      const newTensor = JSON.parse(JSON.stringify(kernel3D));
      newTensor[d][h][w] = parseFloat(value) || 0;
      setKernel3D(newTensor);
    }
  };

  const padTensor3D = (tensor, pad) => {
    if (pad === 0) return tensor;
    const [D, H, W] = [tensor.length, tensor[0].length, tensor[0][0].length];
    const padded = Array(D).fill(0).map(() =>
      Array(H + 2 * pad).fill(0).map(() => Array(W + 2 * pad).fill(0))
    );
    for (let d = 0; d < D; d++) {
      for (let h = 0; h < H; h++) {
        for (let w = 0; w < W; w++) {
          padded[d][h + pad][w + pad] = tensor[d][h][w];
        }
      }
    }
    return padded;
  };

  const compute3DConvolution = () => {
    if (input3D.length === 0 || kernel3D.length === 0) {
      alert('Please initialize tensors first!');
      return;
    }

    if (kDepth !== depth) {
      alert(`Kernel depth (${kDepth}) must match input depth (${depth})!`);
      return;
    }

    const padded = padTensor3D(input3D, padding3D);
    const [D, H, W] = [padded.length, padded[0].length, padded[0][0].length];
    const [KD, KH, KW] = [kernel3D.length, kernel3D[0].length, kernel3D[0][0].length];

    const outH = Math.floor((H - KH) / stride3D) + 1;
    const outW = Math.floor((W - KW) / stride3D) + 1;

    if (outH <= 0 || outW <= 0) {
      alert('Invalid output dimensions!');
      return;
    }

    const result = Array(outH).fill(0).map(() => Array(outW).fill(0));
    const computationSteps = [];

    for (let i = 0; i < outH; i++) {
      for (let j = 0; j < outW; j++) {
        let sum = 0;
        const stepDetail = { position: `(${i}, ${j})`, operations: [] };

        for (let kd = 0; kd < KD; kd++) {
          for (let kh = 0; kh < KH; kh++) {
            for (let kw = 0; kw < KW; kw++) {
              const inputVal = padded[kd][i * stride3D + kh][j * stride3D + kw];
              const kernelVal = kernel3D[kd][kh][kw];
              const product = inputVal * kernelVal;
              sum += product;
              stepDetail.operations.push({
                input: inputVal.toFixed(2),
                kernel: kernelVal.toFixed(2),
                product: product.toFixed(2),
                coords: `[${kd},${i * stride3D + kh},${j * stride3D + kw}] × [${kd},${kh},${kw}]`
              });
            }
          }
        }
        result[i][j] = parseFloat(sum.toFixed(2));
        stepDetail.result = sum.toFixed(2);
        computationSteps.push(stepDetail);
      }
    }

    setOutput3D(result);
    setSteps3D(computationSteps);
    setCurrentStep(0);
  };

  const loadRGBExample = () => {
    const rgbInput = [
      [[255, 200, 150, 100], [200, 255, 200, 150], [150, 200, 255, 200], [100, 150, 200, 255]],
      [[100, 150, 200, 255], [150, 200, 255, 200], [200, 255, 200, 150], [255, 200, 150, 100]],
      [[200, 255, 200, 150], [255, 200, 150, 100], [200, 150, 100, 50], [150, 100, 50, 0]]
    ];

    const edgeKernel = [
      [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]],
      [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]],
      [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]]
    ];

    setDepth(3);
    setHeight(4);
    setWidth(4);
    setKDepth(3);
    setKHeight(3);
    setKWidth(3);
    setInput3D(rgbInput);
    setKernel3D(edgeKernel);
    setStride3D(1);
    setPadding3D(0);
  };

  const playAnimation = () => {
    if (steps3D.length === 0) {
      alert('Compute convolution first!');
      return;
    }
    setIsPlaying(true);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps3D.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const getChannelColor = (channelIdx) => {
    const colors = ['#ff4444', '#44ff44', '#4444ff'];
    return colors[channelIdx % 3];
  };

  return (
    <div className="cnn-visualizer">
      <div className="page-header">
        <h2>🧠 CNN Convolution Visualizer</h2>
        <p className="page-subtitle">
          {mode === '2d'
            ? 'Understand 2D convolution operations with custom input and filter matrices'
            : 'Explore 3D convolution with RGB channel visualization'}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="mode-switcher">
        <div className="mode-toggle-container">
          <button
            onClick={() => setMode('2d')}
            className={`mode-toggle-btn ${mode === '2d' ? 'active' : ''}`}
          >
            <span className="mode-icon">📊</span>
            <span className="mode-text">
              <strong>2D Mode</strong>
              <small>Classic Convolution</small>
            </span>
          </button>
          <button
            onClick={() => setMode('3d')}
            className={`mode-toggle-btn ${mode === '3d' ? 'active' : ''}`}
          >
            <span className="mode-icon">🎨</span>
            <span className="mode-text">
              <strong>3D RGB Mode</strong>
              <small>Multi-Channel Visualization</small>
            </span>
          </button>
        </div>
      </div>

      {/* 2D Mode UI */}
      {mode === '2d' && (
        <>
          <div className="controls">
            <h3>⚙️ Configuration</h3>
            <div>
              <label>Image Matrix: </label>
              <input type="number" value={imgRows} onChange={(e) => setImgRows(+e.target.value)} min="2" max="10" /> ×
              <input type="number" value={imgCols} onChange={(e) => setImgCols(+e.target.value)} min="2" max="10" />
              <button onClick={() => createMatrix(imgRows, imgCols, 'image')} className="btn">Create Image</button>
            </div>
            <div>
              <label>Filter Matrix: </label>
              <input type="number" value={filterRows} onChange={(e) => setFilterRows(+e.target.value)} min="2" max="5" /> ×
              <input type="number" value={filterCols} onChange={(e) => setFilterCols(+e.target.value)} min="2" max="5" />
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

            {convolutionSteps.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={playConvolutionAnimation}
                  className="btn btn-success"
                  disabled={isAnimating}
                >
                  {isAnimating ? '⏸️ Playing...' : '🎬 Play Animation'}
                </button>
                {isAnimating && (
                  <button onClick={stopAnimation} className="btn btn-secondary">
                    ⏹️ Stop
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Animation Visualization */}
          {imageMatrix.length > 0 && filterMatrix.length > 0 && (
            <div className="convolution-animation">
              <h3>🎬 Convolution Animation</h3>
              <div className="animation-container">
                {/* Image with overlay */}
                <div className="image-with-overlay">
                  <h4>📊 Input Image {padding > 0 && `(with padding=${padding})`}</h4>
                  <div className="matrix-wrapper">
                    <table className="animated-matrix">
                      <tbody>
                        {padMatrix(imageMatrix, padding).map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => {
                              const currentStep = convolutionSteps[animationStep];
                              const isHighlighted = currentStep &&
                                i >= currentStep.filterRow &&
                                i < currentStep.filterRow + filterRows &&
                                j >= currentStep.filterCol &&
                                j < currentStep.filterCol + filterCols;

                              return (
                                <td
                                  key={j}
                                  className={isHighlighted ? 'highlighted-cell' : ''}
                                  style={{
                                    backgroundColor: padding > 0 && (i < padding || j < padding || i >= imageMatrix.length + padding || j >= imageMatrix[0].length + padding)
                                      ? '#e0e0e0'
                                      : isHighlighted
                                        ? '#ffeb3b'
                                        : 'white'
                                  }}
                                >
                                  {cell}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Floating Filter Overlay */}
                    {convolutionSteps.length > 0 && (
                      <div
                        className="filter-overlay"
                        style={{
                          top: `${(convolutionSteps[animationStep]?.filterRow || 0) * 40}px`,
                          left: `${(convolutionSteps[animationStep]?.filterCol || 0) * 40}px`,
                          opacity: isAnimating ? 0.9 : 0.7
                        }}
                      >
                        <table className="overlay-filter">
                          <tbody>
                            {filterMatrix.map((row, i) => (
                              <tr key={i}>
                                {row.map((cell, j) => (
                                  <td key={j}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Computation Details */}
                {convolutionSteps.length > 0 && (
                  <div className="computation-display">
                    <h4>🧮 Current Computation</h4>
                    <div className="step-info">
                      <p><strong>Step {animationStep + 1} of {convolutionSteps.length}</strong></p>
                      <p>Output Position: [{convolutionSteps[animationStep]?.outputRow}, {convolutionSteps[animationStep]?.outputCol}]</p>
                      <p><strong>Result: {convolutionSteps[animationStep]?.sum}</strong></p>
                    </div>
                    <div className="calculation-details">
                      {convolutionSteps[animationStep]?.calculations.slice(0, 9).map((calc, idx) => (
                        <div key={idx} className="calc-line">
                          {calc.imgVal} × {calc.filtVal} = {calc.product.toFixed(2)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Output Matrix */}
                {outputMatrix.length > 0 && (
                  <div className="output-display">
                    <h4>✨ Output Feature Map</h4>
                    <table className="output-matrix">
                      <tbody>
                        {outputMatrix.map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => {
                              const currentStep = convolutionSteps[animationStep];
                              const isCurrentOutput = currentStep &&
                                currentStep.outputRow === i &&
                                currentStep.outputCol === j;

                              return (
                                <td
                                  key={j}
                                  className={isCurrentOutput ? 'current-output' : ''}
                                  style={{
                                    backgroundColor: isCurrentOutput ? '#4caf50' : '#e8f5e9',
                                    color: isCurrentOutput ? 'white' : '#2e7d32',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {cell}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Step Controls */}
              {convolutionSteps.length > 0 && (
                <div className="step-controls">
                  <button
                    onClick={() => setAnimationStep(Math.max(0, animationStep - 1))}
                    disabled={animationStep === 0 || isAnimating}
                    className="btn btn-sm"
                  >
                    ⬅️ Previous
                  </button>
                  <span className="step-indicator">
                    Step {animationStep + 1} / {convolutionSteps.length}
                  </span>
                  <button
                    onClick={() => setAnimationStep(Math.min(convolutionSteps.length - 1, animationStep + 1))}
                    disabled={animationStep === convolutionSteps.length - 1 || isAnimating}
                    className="btn btn-sm"
                  >
                    Next ➡️
                  </button>
                </div>
              )}
            </div>
          )}

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
              <pre>{output}</pre>
            </div>
          )}
        </>
      )}

      {/* 3D Mode UI */}
      {mode === '3d' && (
        <>
          <div className="controls">
            <h3>⚙️ 3D Configuration</h3>
            <div>
              <label>Input Tensor (D×H×W): </label>
              <input type="number" value={depth} onChange={(e) => { setDepth(Math.max(1, +e.target.value)); setKDepth(Math.max(1, +e.target.value)); }} min="1" max="5" /> ×
              <input type="number" value={height} onChange={(e) => setHeight(Math.max(2, +e.target.value))} min="2" max="8" /> ×
              <input type="number" value={width} onChange={(e) => setWidth(Math.max(2, +e.target.value))} min="2" max="8" />
              <button onClick={initializeTensors} className="btn">Initialize Tensors</button>
            </div>
            <div>
              <label>Kernel (KH×KW): </label>
              <input type="number" value={kHeight} onChange={(e) => setKHeight(Math.max(2, +e.target.value))} min="2" max="5" /> ×
              <input type="number" value={kWidth} onChange={(e) => setKWidth(Math.max(2, +e.target.value))} min="2" max="5" />
              <button onClick={initializeTensors} className="btn">Update Kernel</button>
            </div>
            <div>
              <label>Stride: </label>
              <input type="number" value={stride3D} onChange={(e) => setStride3D(+e.target.value)} min="1" max="3" />
              <label>Padding: </label>
              <input type="number" value={padding3D} onChange={(e) => setPadding3D(+e.target.value)} min="0" max="2" />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button onClick={loadRGBExample} className="btn btn-secondary">
                🎨 Load RGB Example
              </button>
              <button onClick={compute3DConvolution} className="btn btn-primary" disabled={input3D.length === 0}>
                ▶️ Compute 3D Convolution
              </button>
              {steps3D.length > 0 && (
                <button onClick={playAnimation} className="btn" disabled={isPlaying}>
                  {isPlaying ? '⏸️ Playing...' : '🎬 Play Animation'}
                </button>
              )}
            </div>
          </div>

          {/* 3D Tensor Visualization */}
          {input3D.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3>📦 Input Tensor ({depth}×{height}×{width})</h3>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {input3D.map((channel, d) => (
                    <div key={d} style={{
                      border: `3px solid ${getChannelColor(d)}`,
                      padding: '15px',
                      borderRadius: '10px',
                      background: '#f9f9f9'
                    }}>
                      <h4 style={{ color: getChannelColor(d), margin: '0 0 10px 0', textAlign: 'center' }}>
                        {depth === 3 ? ['🔴 Red', '🟢 Green', '🔵 Blue'][d] : `Channel ${d}`}
                      </h4>
                      <table style={{ borderCollapse: 'collapse' }}>
                        <tbody>
                          {channel.map((row, h) => (
                            <tr key={h}>
                              {row.map((cell, w) => (
                                <td key={w} style={{ padding: '2px' }}>
                                  <input
                                    type="number"
                                    value={cell}
                                    onChange={(e) => updateCell3D('input', d, h, w, e.target.value)}
                                    style={{
                                      width: '50px',
                                      padding: '5px',
                                      textAlign: 'center',
                                      border: '1px solid #ccc',
                                      borderRadius: '4px',
                                      backgroundColor: depth === 3
                                        ? `rgba(${d === 0 ? cell : 0}, ${d === 1 ? cell : 0}, ${d === 2 ? cell : 0}, 0.3)`
                                        : 'white'
                                    }}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>

              {kernel3D.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h3>🔍 Kernel ({kDepth}×{kHeight}×{kWidth})</h3>
                  <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {kernel3D.map((channel, d) => (
                      <div key={d} style={{
                        border: `2px solid ${getChannelColor(d)}`,
                        padding: '10px',
                        borderRadius: '8px',
                        background: '#f0f0f0'
                      }}>
                        <h4 style={{ color: getChannelColor(d), margin: '0 0 10px 0', textAlign: 'center' }}>
                          Depth {d}
                        </h4>
                        <table style={{ borderCollapse: 'collapse' }}>
                          <tbody>
                            {channel.map((row, h) => (
                              <tr key={h}>
                                {row.map((cell, w) => (
                                  <td key={w} style={{ padding: '2px' }}>
                                    <input
                                      type="number"
                                      value={cell}
                                      onChange={(e) => updateCell3D('kernel', d, h, w, e.target.value)}
                                      style={{
                                        width: '45px',
                                        padding: '5px',
                                        textAlign: 'center',
                                        border: '1px solid #999',
                                        borderRadius: '4px'
                                      }}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3D Output */}
          {output3D.length > 0 && (
            <div style={{ marginTop: '30px', background: '#e8f5e9', padding: '20px', borderRadius: '10px' }}>
              <h3>✨ Output Feature Map ({output3D.length}×{output3D[0].length})</h3>
              <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
                <tbody>
                  {output3D.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} style={{
                          padding: '10px 15px',
                          border: '2px solid #4caf50',
                          background: currentStep === i * output3D[0].length + j ? '#ffeb3b' : 'white',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          borderRadius: '5px',
                          margin: '2px'
                        }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {steps3D.length > 0 && (
                <div style={{ marginTop: '20px', background: 'white', padding: '15px', borderRadius: '8px' }}>
                  <h4 style={{ marginTop: 0 }}>📊 Computation Details (Step {currentStep + 1}/{steps3D.length})</h4>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '15px 0' }}>
                    <button
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      className="btn"
                    >
                      ⬅️ Previous
                    </button>
                    <span style={{ padding: '8px 20px', background: '#e3f2fd', borderRadius: '5px', fontWeight: 'bold' }}>
                      Position: {steps3D[currentStep]?.position}
                    </span>
                    <button
                      onClick={() => setCurrentStep(Math.min(steps3D.length - 1, currentStep + 1))}
                      disabled={currentStep === steps3D.length - 1}
                      className="btn"
                    >
                      Next ➡️
                    </button>
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '10px' }}>
                    <p><strong>Result: {steps3D[currentStep]?.result}</strong></p>
                    <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                      {steps3D[currentStep]?.operations.slice(0, 10).map((op, idx) => (
                        <div key={idx} style={{ padding: '4px 0', borderBottom: '1px solid #eee' }}>
                          {op.coords}: {op.input} × {op.kernel} = {op.product}
                        </div>
                      ))}
                      {steps3D[currentStep]?.operations.length > 10 && (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>
                          ... and {steps3D[currentStep].operations.length - 10} more operations
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CNNVisualizer;
