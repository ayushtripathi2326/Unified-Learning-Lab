class APIClient {
    constructor(baseURL = 'http://localhost:5000/api') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('token');
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    async getQuestions(topic) {
        return this.request(`/questions?topic=${topic}`);
    }

    async submitResult(data) {
        return this.request('/results', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        this.token = response.token;
        localStorage.setItem('token', response.token);
        return response;
    }

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }
}

export default new APIClient();// Convolution Page - 2D Convolution Visualizer
const ConvolutionPage = {
  state: {
    imageRows: 5,
    imageCols: 5,
    filterRows: 3,
    filterCols: 3,
    paddedImage: [],
    kernel: [],
    output: [],
    steps: [],
    currentStep: 0,
    isPlaying: false
  },

  render() {
    return `
      <div class="page">
        <h2>🧠 2D Convolution Visualizer</h2>

        <div class="control-panel">
          <label>Image: <input type="number" id="conv-img-r" value="5" min="1" max="10" style="width:60px"> ×
          <input type="number" id="conv-img-c" value="5" min="1" max="10" style="width:60px"></label>
          <button onclick="ConvolutionPage.setImage()">Set Image</button>

          <label>Filter: <input type="number" id="conv-filt-r" value="3" min="1" max="5" style="width:60px"> ×
          <input type="number" id="conv-filt-c" value="3" min="1" max="5" style="width:60px"></label>
          <button onclick="ConvolutionPage.setFilter()">Set Filter</button>

          <label>Stride: <input type="number" id="conv-stride" value="1" min="1" style="width:60px"></label>
          <label>Padding: <input type="number" id="conv-padding" value="0" min="0" style="width:60px"></label>

          <button onclick="ConvolutionPage.compute()">Compute</button>
          <button onclick="ConvolutionPage.loadExample()">Example</button>
          <button onclick="ConvolutionPage.play()">▶ Play</button>
          <button onclick="ConvolutionPage.reset()">Reset</button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
          <div>
            <h3 style="color:var(--primary);margin-bottom:10px;">Image Matrix</h3>
            <div id="conv-image-matrix"></div>
          </div>

          <div>
            <h3 style="color:var(--primary);margin-bottom:10px;">Filter Matrix</h3>
            <div id="conv-filter-matrix"></div>
          </div>

          <div>
            <h3 style="color:var(--primary);margin-bottom:10px;">Padded Image</h3>
            <div id="conv-padded" class="grid-display"></div>
          </div>

          <div>
            <h3 style="color:var(--primary);margin-bottom:10px;">Output Feature Map</h3>
            <div id="conv-output" class="grid-display"></div>
            <div style="margin-top:10px;color:var(--text);" id="conv-info">Feature Map Size: -</div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    this.createMatrix('image');
    this.createMatrix('filter');
  },

  createMatrix(type) {
    const rows = type === 'image' ? this.state.imageRows : this.state.filterRows;
    const cols = type === 'image' ? this.state.imageCols : this.state.filterCols;
    const container = document.getElementById(`conv-${type}-matrix`);

    let html = '<div style="display:grid;gap:4px;grid-template-columns:repeat(' + cols + ',1fr);">';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        html += `<input type="number" id="${type}_${r}_${c}" value="0" style="width:50px;height:40px;text-align:center;border-radius:6px;border:1px solid #334155;background:var(--bg);color:var(--text);">`;
      }
    }
    html += '</div>';
    container.innerHTML = html;
  },

  setImage() {
    this.state.imageRows = parseInt(document.getElementById('conv-img-r').value);
    this.state.imageCols = parseInt(document.getElementById('conv-img-c').value);
    this.createMatrix('image');
  },

  setFilter() {
    this.state.filterRows = parseInt(document.getElementById('conv-filt-r').value);
    this.state.filterCols = parseInt(document.getElementById('conv-filt-c').value);
    this.createMatrix('filter');
  },

  getMatrix(type) {
    const rows = type === 'image' ? this.state.imageRows : this.state.filterRows;
    const cols = type === 'image' ? this.state.imageCols : this.state.filterCols;
    const mat = [];

    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const val = parseFloat(document.getElementById(`${type}_${r}_${c}`).value);
        row.push(isNaN(val) ? 0 : val);
      }
      mat.push(row);
    }
    return mat;
  },

  padMatrix(mat, padding) {
    const r = mat.length, c = mat[0].length;
    const newR = r + 2 * padding, newC = c + 2 * padding;
    const out = Array.from({length: newR}, () => Array(newC).fill(0));

    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        out[i + padding][j + padding] = mat[i][j];
      }
    }
    return out;
  },

  compute() {
    const img = this.getMatrix('image');
    this.state.kernel = this.getMatrix('filter');
    const stride = parseInt(document.getElementById('conv-stride').value);
    const padding = parseInt(document.getElementById('conv-padding').value);

    this.state.paddedImage = this.padMatrix(img, padding);
    const paddedR = this.state.paddedImage.length;
    const paddedC = this.state.paddedImage[0].length;

    const kR = this.state.kernel.length;
    const kC = this.state.kernel[0].length;
    const outRows = Math.floor((paddedR - kR) / stride) + 1;
    const outCols = Math.floor((paddedC - kC) / stride) + 1;

    this.state.output = Array.from({length: outRows}, () => Array(outCols).fill(0));

    for (let or = 0; or < outRows; or++) {
      for (let oc = 0; oc < outCols; oc++) {
        let sum = 0;
        for (let fr = 0; fr < kR; fr++) {
          for (let fc = 0; fc < kC; fc++) {
            sum += this.state.paddedImage[or * stride + fr][oc * stride + fc] * this.state.kernel[fr][fc];
          }
        }
        this.state.output[or][oc] = sum;
      }
    }

    this.renderPadded();
    this.renderOutput();
    document.getElementById('conv-info').textContent = `Feature Map Size: (${outRows}, ${outCols})`;
  },

  renderPadded() {
    const container = document.getElementById('conv-padded');
    const rows = this.state.paddedImage.length;
    const cols = this.state.paddedImage[0].length;

    container.style.gridTemplateColumns = `repeat(${cols}, 56px)`;
    container.innerHTML = '';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = this.state.paddedImage[r][c];
        container.appendChild(cell);
      }
    }
  },

  renderOutput() {
    const container = document.getElementById('conv-output');
    const rows = this.state.output.length;
    const cols = this.state.output[0].length;

    container.style.gridTemplateColumns = `repeat(${cols}, 56px)`;
    container.innerHTML = '';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = this.state.output[r][c];
        cell.style.background = 'linear-gradient(135deg, var(--primary), var(--primary-dark))';
        cell.style.color = 'white';
        container.appendChild(cell);
      }
    }
  },

  loadExample() {
    document.getElementById('conv-img-r').value = 5;
    document.getElementById('conv-img-c').value = 5;
    this.state.imageRows = 5;
    this.state.imageCols = 5;
    this.createMatrix('image');

    let v = 1;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        document.getElementById(`image_${i}_${j}`).value = v++;
      }
    }

    document.getElementById('conv-filt-r').value = 3;
    document.getElementById('conv-filt-c').value = 3;
    this.state.filterRows = 3;
    this.state.filterCols = 3;
    this.createMatrix('filter');

    const filt = [[1, 0, -1], [1, 0, -1], [1, 0, -1]];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        document.getElementById(`filter_${i}_${j}`).value = filt[i][j];
      }
    }
  },

  async play() {
    if (!this.state.paddedImage.length) {
      alert('Compute first!');
      return;
    }

    this.state.isPlaying = true;
    const cells = document.querySelectorAll('#conv-padded .cell');

    for (let i = 0; i < cells.length; i++) {
      if (!this.state.isPlaying) break;
      cells[i].classList.add('highlight');
      await sleep(200);
      cells[i].classList.remove('highlight');
    }

    this.state.isPlaying = false;
  },

  reset() {
    this.state.paddedImage = [];
    this.state.output = [];
    document.getElementById('conv-padded').innerHTML = '';
    document.getElementById('conv-output').innerHTML = '';
    document.getElementById('conv-info').textContent = 'Feature Map Size: -';
  }
};
