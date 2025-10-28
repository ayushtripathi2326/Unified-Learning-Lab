// 3D CNN Convolution Visualizer
const CNN3DPage = {
  state: {
    input: [], // 3D tensor [depth, height, width]
    kernel: [], // 3D kernel [depth, height, width]
    output: [],
    depth: 3, height: 4, width: 4,
    kDepth: 3, kHeight: 3, kWidth: 3,
    stride: 1, padding: 0,
    isPlaying: false,
    currentStep: 0
  },
  
  render() {
    return `
      <div class="page">
        <h2>🧠 3D CNN Convolution</h2>
        
        <div class="control-panel">
          <div style="display:flex;gap:15px;align-items:center;flex-wrap:wrap;">
            <div style="background:var(--bg);padding:10px;border-radius:6px;">
              <label style="color:var(--primary);font-weight:600;">Input Tensor (D×H×W)</label><br>
              <input type="text" inputMode="numeric" id="cnn3d-d" value="3" style="width:45px;margin:2px;border:1px solid var(--primary);border-radius:4px;text-align:center;"> × 
              <input type="text" inputMode="numeric" id="cnn3d-h" value="4" style="width:45px;margin:2px;border:1px solid var(--primary);border-radius:4px;text-align:center;"> × 
              <input type="text" inputMode="numeric" id="cnn3d-w" value="4" style="width:45px;margin:2px;border:1px solid var(--primary);border-radius:4px;text-align:center;">
            </div>
            
            <div style="background:var(--bg);padding:10px;border-radius:6px;">
              <label style="color:var(--secondary);font-weight:600;">Filter (D×H×W)</label><br>
              <input type="text" inputMode="numeric" id="cnn3d-kd" value="3" style="width:45px;margin:2px;border:1px solid var(--secondary);border-radius:4px;text-align:center;"> × 
              <input type="text" inputMode="numeric" id="cnn3d-kh" value="3" style="width:45px;margin:2px;border:1px solid var(--secondary);border-radius:4px;text-align:center;"> × 
              <input type="text" inputMode="numeric" id="cnn3d-kw" value="3" style="width:45px;margin:2px;border:1px solid var(--secondary);border-radius:4px;text-align:center;">
            </div>
            
            <div style="background:var(--bg);padding:10px;border-radius:6px;">
              <label style="color:var(--accent);font-weight:600;">Parameters</label><br>
              <label style="font-size:12px;">Stride: <input type="text" inputMode="numeric" id="cnn3d-stride" value="1" style="width:40px;border:1px solid var(--accent);border-radius:4px;text-align:center;"></label>
              <label style="font-size:12px;margin-left:8px;">Pad: <input type="text" inputMode="numeric" id="cnn3d-padding" value="0" style="width:40px;border:1px solid var(--accent);border-radius:4px;text-align:center;"></label>
            </div>
          </div>
          
          <div style="margin-top:10px;">
            <button onclick="CNN3DPage.generate()" style="background:var(--primary);">🎲 Generate</button>
            <button onclick="CNN3DPage.compute()" style="background:var(--secondary);">⚡ Compute</button>
            <button onclick="CNN3DPage.loadRGB()" style="background:var(--accent);">🖼️ RGB Example</button>
            <button onclick="CNN3DPage.play()" style="background:var(--danger);">▶ Sliding Filter</button>
            <button onclick="CNN3DPage.reset()">🔄 Reset</button>
          </div>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
          <div>
            <h3>Input Tensor (D×H×W)</h3>
            <div id="cnn3d-input"></div>
          </div>
          <div>
            <h3>3D Kernel</h3>
            <div id="cnn3d-kernel"></div>
          </div>
          <div>
            <h3>Output Feature Map</h3>
            <div id="cnn3d-output"></div>
            <div id="cnn3d-info" style="margin-top:10px;color:var(--text);">Output Size: -</div>
          </div>
          <div>
            <h3>Computation Steps</h3>
            <div id="cnn3d-steps" style="background:var(--surface);padding:15px;border-radius:8px;min-height:200px;font-family:monospace;font-size:12px;overflow-y:auto;"></div>
          </div>
        </div>
      </div>
    `;
  },
  
  init() {
    this.generate();
  },
  
  generate() {
    this.state.depth = parseInt(document.getElementById('cnn3d-d').value);
    this.state.height = parseInt(document.getElementById('cnn3d-h').value);
    this.state.width = parseInt(document.getElementById('cnn3d-w').value);
    this.state.kDepth = parseInt(document.getElementById('cnn3d-kd').value);
    this.state.kHeight = parseInt(document.getElementById('cnn3d-kh').value);
    this.state.kWidth = parseInt(document.getElementById('cnn3d-kw').value);
    
    // Generate random input tensor
    this.state.input = Array.from({length: this.state.depth}, () =>
      Array.from({length: this.state.height}, () =>
        Array.from({length: this.state.width}, () => Math.floor(Math.random() * 10))
      )
    );
    
    // Generate random kernel
    this.state.kernel = Array.from({length: this.state.kDepth}, () =>
      Array.from({length: this.state.kHeight}, () =>
        Array.from({length: this.state.kWidth}, () => (Math.random() - 0.5).toFixed(1))
      )
    );
    
    this.renderInput();
    this.renderKernel();
  },
  
  renderInput() {
    const container = document.getElementById('cnn3d-input');
    container.innerHTML = '';
    
    if (!this.state.input.length) {
      container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">Click Generate to create input tensor</p>';
      return;
    }
    
    const colors = ['R', 'G', 'B'];
    this.state.input.forEach((layer, d) => {
      const layerDiv = document.createElement('div');
      const colorName = colors[d] || `Layer ${d}`;
      layerDiv.innerHTML = `<h4 style="color:var(--primary);margin:10px 0 5px 0;">${colorName} Channel</h4>`;
      
      const grid = document.createElement('div');
      grid.className = 'grid-display';
      grid.style.gridTemplateColumns = `repeat(${this.state.width}, 40px)`;
      grid.style.marginBottom = '15px';
      
      layer.forEach((row, r) => {
        row.forEach((val, c) => {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.style.width = '40px';
          cell.style.height = '40px';
          cell.style.fontSize = '12px';
          const input = document.createElement('input');
          input.type = 'text';
          input.inputMode = 'numeric';
          input.pattern = '[0-9]*';
          input.value = val;
          input.style.width = '100%';
          input.style.height = '100%';
          input.style.border = 'none';
          input.style.background = 'transparent';
          input.style.textAlign = 'center';
          input.style.fontSize = '12px';
          input.style.color = '#0f1724';
          input.onchange = () => {
            const newVal = parseInt(input.value) || 0;
            this.state.input[d][r][c] = newVal;
          };
          cell.appendChild(input);
          grid.appendChild(cell);
        });
      });
      
      layerDiv.appendChild(grid);
      container.appendChild(layerDiv);
    });
  },
  
  renderKernel() {
    const container = document.getElementById('cnn3d-kernel');
    container.innerHTML = '';
    
    if (!this.state.kernel.length) {
      container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">Click Generate to create filter</p>';
      return;
    }
    
    const filterColors = ['#ff4444', '#44ff44', '#4444ff']; // Red, Green, Blue
    const filterNames = ['R Filter', 'G Filter', 'B Filter'];
    this.state.kernel.forEach((layer, d) => {
      const layerDiv = document.createElement('div');
      const filterName = filterNames[d] || `Filter ${d}`;
      const filterColor = filterColors[d] || 'var(--secondary)';
      layerDiv.innerHTML = `<h4 style="color:${filterColor};margin:10px 0 5px 0;">${filterName}</h4>`;
      
      const grid = document.createElement('div');
      grid.className = 'grid-display';
      grid.style.gridTemplateColumns = `repeat(${this.state.kWidth}, 40px)`;
      grid.style.marginBottom = '15px';
      
      layer.forEach((row, r) => {
        row.forEach((val, c) => {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.style.width = '40px';
          cell.style.height = '40px';
          cell.style.padding = '2px';
          cell.style.fontSize = '10px';
          const bgColors = ['#ff6666', '#66ff66', '#6666ff']; // Light red, green, blue
          cell.style.background = bgColors[d] || 'var(--secondary)';
          cell.style.color = 'white';
          const input = document.createElement('input');
          input.type = 'text';
          input.inputMode = 'decimal';
          input.value = val;
          input.style.width = '100%';
          input.style.height = '100%';
          input.style.border = 'none';
          input.style.background = 'transparent';
          input.style.textAlign = 'center';
          input.style.fontSize = '12px';
          input.style.fontWeight = 'bold';
          input.style.color = '#000';
          input.style.background = '#fff';
          input.style.borderRadius = '3px';
          input.style.padding = '0';
          input.style.boxShadow = 'none';
          input.style.width = '36px';
          input.style.height = '36px';
          input.onchange = () => {
            const newVal = parseFloat(input.value) || 0;
            this.state.kernel[d][r][c] = newVal.toFixed(1);
            input.value = newVal.toFixed(1);
          };
          cell.appendChild(input);
          grid.appendChild(cell);
        });
      });
      
      layerDiv.appendChild(grid);
      container.appendChild(layerDiv);
    });
  },
  
  compute() {
    const stride = parseInt(document.getElementById('cnn3d-stride').value);
    const padding = parseInt(document.getElementById('cnn3d-padding').value);
    
    // Pad input if needed
    const paddedInput = this.padTensor(this.state.input, padding);
    
    const outH = Math.floor((paddedInput[0].length - this.state.kHeight) / stride) + 1;
    const outW = Math.floor((paddedInput[0][0].length - this.state.kWidth) / stride) + 1;
    
    this.state.output = Array.from({length: outH}, () => Array(outW).fill(0));
    
    let steps = [];
    
    for (let oh = 0; oh < outH; oh++) {
      for (let ow = 0; ow < outW; ow++) {
        let sum = 0;
        let computation = `Output[${oh}][${ow}] = `;
        
        for (let kd = 0; kd < this.state.kDepth; kd++) {
          for (let kh = 0; kh < this.state.kHeight; kh++) {
            for (let kw = 0; kw < this.state.kWidth; kw++) {
              const ih = oh * stride + kh;
              const iw = ow * stride + kw;
              const inputVal = paddedInput[kd][ih][iw];
              const kernelVal = parseFloat(this.state.kernel[kd][kh][kw]);
              sum += inputVal * kernelVal;
              
              if (kd === 0 && kh === 0 && kw === 0) {
                computation += `${inputVal}×${kernelVal}`;
              } else {
                computation += ` + ${inputVal}×${kernelVal}`;
              }
            }
          }
        }
        
        this.state.output[oh][ow] = sum.toFixed(1);
        steps.push(computation + ` = ${sum.toFixed(1)}`);
      }
    }
    
    this.renderOutput();
    this.renderSteps(steps);
    document.getElementById('cnn3d-info').textContent = `Output Size: (${outH}, ${outW})`;
  },
  
  padTensor(tensor, padding) {
    if (padding === 0) return tensor;
    
    return tensor.map(layer => {
      const newH = layer.length + 2 * padding;
      const newW = layer[0].length + 2 * padding;
      const padded = Array.from({length: newH}, () => Array(newW).fill(0));
      
      for (let h = 0; h < layer.length; h++) {
        for (let w = 0; w < layer[0].length; w++) {
          padded[h + padding][w + padding] = layer[h][w];
        }
      }
      return padded;
    });
  },
  
  renderOutput() {
    const container = document.getElementById('cnn3d-output');
    const grid = document.createElement('div');
    grid.className = 'grid-display';
    grid.style.gridTemplateColumns = `repeat(${this.state.output[0].length}, 50px)`;
    
    container.innerHTML = '';
    this.state.output.forEach(row => {
      row.forEach(val => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.width = '50px';
        cell.style.height = '50px';
        cell.style.background = 'var(--accent)';
        cell.style.color = 'white';
        cell.style.fontWeight = 'bold';
        cell.textContent = val;
        grid.appendChild(cell);
      });
    });
    
    container.appendChild(grid);
  },
  
  renderSteps(steps) {
    const container = document.getElementById('cnn3d-steps');
    container.innerHTML = steps.map((step, i) => `<div style="margin:5px 0;">${i+1}. ${step}</div>`).join('');
  },
  
  loadRGB() {
    // RGB image example
    document.getElementById('cnn3d-d').value = 3;
    document.getElementById('cnn3d-h').value = 4;
    document.getElementById('cnn3d-w').value = 4;
    document.getElementById('cnn3d-kd').value = 3;
    document.getElementById('cnn3d-kh').value = 3;
    document.getElementById('cnn3d-kw').value = 3;
    
    this.state.depth = 3;
    this.state.height = 4;
    this.state.width = 4;
    this.state.kDepth = 3;
    this.state.kHeight = 3;
    this.state.kWidth = 3;
    
    // RGB channels with R and 0 together
    this.state.input = [
      [[255,0,150,0],[0,220,0,160],[140,0,200,0],[0,130,0,190]], // R with 0
      [[100,150,200,255],[120,160,180,200],[160,190,220,250],[200,230,255,220]], // G
      [[50,80,110,140],[70,100,130,160],[90,120,150,180],[110,140,170,200]]      // B
    ];
    
    // Edge detection kernel
    this.state.kernel = [
      [[-1,0,1],[-1,0,1],[-1,0,1]], // R channel
      [[-1,0,1],[-1,0,1],[-1,0,1]], // G channel  
      [[-1,0,1],[-1,0,1],[-1,0,1]]  // B channel
    ];
    
    this.renderInput();
    this.renderKernel();
    this.compute();
  },
  
  async play() {
    if (!this.state.output.length) {
      alert('Compute first!');
      return;
    }
    
    this.state.isPlaying = true;
    const stride = parseInt(document.getElementById('cnn3d-stride').value);
    const outH = this.state.output.length;
    const outW = this.state.output[0].length;
    
    // Animate convolution sliding window
    for (let oh = 0; oh < outH; oh++) {
      for (let ow = 0; ow < outW; ow++) {
        if (!this.state.isPlaying) break;
        
        // Clear previous highlights
        document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('highlight'));
        
        // Highlight filter sliding over input for each channel
        for (let d = 0; d < this.state.depth; d++) {
          const inputLayer = document.querySelectorAll('#cnn3d-input > div')[d];
          const kernelLayer = document.querySelectorAll('#cnn3d-kernel > div')[d];
          
          if (inputLayer && kernelLayer) {
            const inputCells = inputLayer.querySelectorAll('.cell');
            const kernelCells = kernelLayer.querySelectorAll('.cell');
            
            // Highlight input region being convolved with channel color
            const colorClasses = ['highlight-red', 'highlight-green', 'highlight-blue'];
            for (let kh = 0; kh < this.state.kHeight; kh++) {
              for (let kw = 0; kw < this.state.kWidth; kw++) {
                const ih = oh * stride + kh;
                const iw = ow * stride + kw;
                const inputIdx = ih * this.state.width + iw;
                if (inputCells[inputIdx]) inputCells[inputIdx].classList.add(colorClasses[d] || 'highlight');
              }
            }
            
            // Highlight corresponding kernel with channel color
            kernelCells.forEach(cell => {
              cell.classList.add(colorClasses[d] || 'highlight');
            });
          }
        }
        
        await sleep(600);
        
        // Highlight output cell being computed
        const outputCells = document.querySelectorAll('#cnn3d-output .cell');
        const outputIdx = oh * outW + ow;
        if (outputCells[outputIdx]) {
          outputCells[outputIdx].classList.add('highlight');
          await sleep(400);
          outputCells[outputIdx].classList.remove('highlight');
        }
      }
    }
    
    // Clear all highlights and effects
    document.querySelectorAll('.cell').forEach(cell => {
      cell.classList.remove('highlight', 'highlight-red', 'highlight-green', 'highlight-blue');
    });
    this.state.isPlaying = false;
  },
  
  reset() {
    this.state.input = [];
    this.state.kernel = [];
    this.state.output = [];
    this.state.isPlaying = false;
    
    document.getElementById('cnn3d-input').innerHTML = '';
    document.getElementById('cnn3d-kernel').innerHTML = '';
    document.getElementById('cnn3d-output').innerHTML = '';
    document.getElementById('cnn3d-steps').innerHTML = '';
    document.getElementById('cnn3d-info').textContent = 'Output Size: -';
  }
};