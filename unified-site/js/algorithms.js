// Algorithms Page - Binary Search & Sorting
const AlgorithmsPage = {
  state: {
    array: [],
    target: null,
    currentAlgo: 'binary-search'
  },
  
  render() {
    return `
      <div class="page">
        <h2>🔍 Search & Sorting Algorithms</h2>
        <p style="color: var(--text-muted); margin-bottom: 20px;">Visualize how different algorithms work step-by-step. Now includes Quick Sort, Reverse Array, and Find Maximum!</p>
        
        <div class="control-panel">
          <select id="algo-select">
            <option value="binary-search">Binary Search</option>
            <option value="linear-search">Linear Search</option>
            <option value="bubble-sort">Bubble Sort</option>
            <option value="selection-sort">Selection Sort</option>
            <option value="insertion-sort">Insertion Sort</option>
            <option value="quick-sort">Quick Sort</option>
            <option value="reverse-array">Reverse Array</option>
            <option value="find-max">Find Maximum</option>
          </select>
          <label>Size: <input type="number" id="algo-size" value="10" min="5" max="15"></label>
          <button onclick="AlgorithmsPage.generateArray()">Generate</button>
          <label>Target: <input type="number" id="algo-target" placeholder="Target"></label>
          <button onclick="AlgorithmsPage.play()">▶ Play</button>
          <button onclick="AlgorithmsPage.reset()">Reset</button>
        </div>
        
        <div class="animation-area">
          <div id="algo-array" class="array-container"></div>
        </div>
        
        <div class="info-panel">
          <h3>Algorithm Info</h3>
          <p id="algo-info">Select an algorithm to see its visualization.</p>
        </div>
      </div>
    `;
  },
  
  init() {
    document.getElementById('algo-select').addEventListener('change', (e) => {
      this.state.currentAlgo = e.target.value;
      this.updateInfo();
    });
    this.updateInfo();
  },
  
  generateArray() {
    const size = parseInt(document.getElementById('algo-size').value);
    const algo = this.state.currentAlgo;
    
    if (algo.includes('search')) {
      this.state.array = Array.from({length: size}, (_, i) => (i + 1) * 3);
    } else if (algo === 'find-max') {
      this.state.array = Array.from({length: size}, () => Math.floor(Math.random() * 50) + 1);
    } else {
      this.state.array = Array.from({length: size}, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    }
    
    this.renderArray();
    document.getElementById('algo-info').textContent = `Array generated with ${size} elements.`;
  },
  
  renderArray() {
    const container = document.getElementById('algo-array');
    container.innerHTML = '';
    this.state.array.forEach((val, idx) => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.id = 'algo-bar-' + idx;
      bar.textContent = val;
      container.appendChild(bar);
    });
  },
  
  async play() {
    const algo = this.state.currentAlgo;
    
    if (!this.state.array.length) {
      document.getElementById('algo-info').textContent = 'Generate array first.';
      return;
    }
    
    if (algo === 'binary-search') await this.binarySearch();
    else if (algo === 'linear-search') await this.linearSearch();
    else if (algo === 'bubble-sort') await this.bubbleSort();
    else if (algo === 'selection-sort') await this.selectionSort();
    else if (algo === 'insertion-sort') await this.insertionSort();
    else if (algo === 'quick-sort') await this.quickSort();
    else if (algo === 'reverse-array') await this.reverseArray();
    else if (algo === 'find-max') await this.findMax();
  },
  
  async binarySearch() {
    this.state.target = parseInt(document.getElementById('algo-target').value);
    if (isNaN(this.state.target)) {
      document.getElementById('algo-info').textContent = 'Enter target value.';
      return;
    }
    
    let low = 0, high = this.state.array.length - 1;
    
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      
      document.querySelectorAll('.bar').forEach(b => b.className = 'bar');
      document.getElementById('algo-bar-' + low).classList.add('low');
      document.getElementById('algo-bar-' + mid).classList.add('mid');
      document.getElementById('algo-bar-' + high).classList.add('high');
      
      document.getElementById('algo-info').textContent = `Checking mid=${mid}, value=${this.state.array[mid]}`;
      await sleep(800);
      
      if (this.state.array[mid] === this.state.target) {
        document.getElementById('algo-bar-' + mid).classList.add('found');
        document.getElementById('algo-info').textContent = `✓ Found ${this.state.target} at index ${mid}!`;
        return;
      } else if (this.state.array[mid] < this.state.target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    document.getElementById('algo-info').textContent = `✗ Target ${this.state.target} not found.`;
  },
  
  async linearSearch() {
    this.state.target = parseInt(document.getElementById('algo-target').value);
    if (isNaN(this.state.target)) return;
    
    for (let i = 0; i < this.state.array.length; i++) {
      document.querySelectorAll('.bar').forEach(b => b.className = 'bar');
      document.getElementById('algo-bar-' + i).classList.add('mid');
      await sleep(500);
      
      if (this.state.array[i] === this.state.target) {
        document.getElementById('algo-bar-' + i).classList.add('found');
        document.getElementById('algo-info').textContent = `✓ Found at index ${i}!`;
        return;
      }
    }
    document.getElementById('algo-info').textContent = `✗ Not found.`;
  },
  
  async bubbleSort() {
    const n = this.state.array.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        document.querySelectorAll('.bar').forEach(b => b.className = 'bar');
        document.getElementById('algo-bar-' + j).classList.add('mid');
        document.getElementById('algo-bar-' + (j + 1)).classList.add('mid');
        await sleep(400);
        
        if (this.state.array[j] > this.state.array[j + 1]) {
          [this.state.array[j], this.state.array[j + 1]] = [this.state.array[j + 1], this.state.array[j]];
          this.renderArray();
        }
      }
    }
    document.getElementById('algo-info').textContent = '✓ Sorted!';
  },
  
  async selectionSort() {
    const n = this.state.array.length;
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        document.querySelectorAll('.bar').forEach(b => b.className = 'bar');
        document.getElementById('algo-bar-' + minIdx).classList.add('low');
        document.getElementById('algo-bar-' + j).classList.add('mid');
        await sleep(400);
        
        if (this.state.array[j] < this.state.array[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [this.state.array[i], this.state.array[minIdx]] = [this.state.array[minIdx], this.state.array[i]];
        this.renderArray();
      }
    }
    document.getElementById('algo-info').textContent = '✓ Sorted!';
  },
  
  async insertionSort() {
    const n = this.state.array.length;
    for (let i = 1; i < n; i++) {
      let key = this.state.array[i];
      let j = i - 1;
      
      document.querySelectorAll('.bar').forEach(b => b.className = 'bar');
      document.getElementById('algo-bar-' + i).classList.add('mid');
      await sleep(400);
      
      while (j >= 0 && this.state.array[j] > key) {
        this.state.array[j + 1] = this.state.array[j];
        j--;
        this.renderArray();
        await sleep(200);
      }
      this.state.array[j + 1] = key;
      this.renderArray();
    }
    document.getElementById('algo-info').textContent = '✓ Sorted!';
  },
  
  reset() {
    this.state.array = [];
    document.getElementById('algo-array').innerHTML = '';
    document.getElementById('algo-info').textContent = 'Generate array to start.';
  },
  
  async quickSort() {
    await this.quickSortHelper(0, this.state.array.length - 1);
    document.getElementById('algo-info').textContent = '✓ Quick Sort complete!';
  },
  
  async quickSortHelper(low, high) {
    if (low < high) {
      const pi = await this.partition(low, high);
      await this.quickSortHelper(low, pi - 1);
      await this.quickSortHelper(pi + 1, high);
    }
  },
  
  async partition(low, high) {
    const pivot = this.state.array[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      document.querySelectorAll('.bar').forEach(b => b.className = 'bar');
      document.getElementById('algo-bar-' + j).classList.add('mid');
      document.getElementById('algo-bar-' + high).classList.add('found');
      await sleep(300);
      
      if (this.state.array[j] < pivot) {
        i++;
        [this.state.array[i], this.state.array[j]] = [this.state.array[j], this.state.array[i]];
        this.renderArray();
      }
    }
    [this.state.array[i + 1], this.state.array[high]] = [this.state.array[high], this.state.array[i + 1]];
    this.renderArray();
    return i + 1;
  },
  
  async reverseArray() {
    let left = 0, right = this.state.array.length - 1;
    
    while (left < right) {
      document.querySelectorAll('.bar').forEach(b => b.className = 'bar');
      document.getElementById('algo-bar-' + left).classList.add('low');
      document.getElementById('algo-bar-' + right).classList.add('high');
      await sleep(600);
      
      [this.state.array[left], this.state.array[right]] = [this.state.array[right], this.state.array[left]];
      this.renderArray();
      left++;
      right--;
    }
    document.getElementById('algo-info').textContent = '✓ Array reversed!';
  },
  
  async findMax() {
    let maxIdx = 0;
    document.getElementById('algo-bar-0').classList.add('found');
    
    for (let i = 1; i < this.state.array.length; i++) {
      document.querySelectorAll('.bar').forEach(b => b.className = 'bar');
      document.getElementById('algo-bar-' + maxIdx).classList.add('found');
      document.getElementById('algo-bar-' + i).classList.add('mid');
      await sleep(500);
      
      if (this.state.array[i] > this.state.array[maxIdx]) {
        maxIdx = i;
      }
    }
    
    document.querySelectorAll('.bar').forEach(b => b.className = 'bar');
    document.getElementById('algo-bar-' + maxIdx).classList.add('found');
    document.getElementById('algo-info').textContent = `✓ Maximum: ${this.state.array[maxIdx]} at index ${maxIdx}`;
  },
  
  updateInfo() {
    const info = {
      'binary-search': 'Binary Search: O(log n) - Divides sorted array in half each step.',
      'linear-search': 'Linear Search: O(n) - Checks each element sequentially.',
      'bubble-sort': 'Bubble Sort: O(n²) - Repeatedly swaps adjacent elements.',
      'selection-sort': 'Selection Sort: O(n²) - Finds minimum and places it.',
      'insertion-sort': 'Insertion Sort: O(n²) - Builds sorted array incrementally.',
      'quick-sort': 'Quick Sort: O(n log n) - Divide and conquer with pivot partitioning.',
      'reverse-array': 'Reverse Array: O(n) - Swaps elements from both ends.',
      'find-max': 'Find Maximum: O(n) - Iterates to find largest element.'
    };
    document.getElementById('algo-info').textContent = info[this.state.currentAlgo];
  }
};
