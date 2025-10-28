// Stack & Queue Visualizer
const StackQueuePage = {
  state: {
    stack: [],
    queue: []
  },
  
  render() {
    return `
      <div class="page">
        <h2>📚 Stack & Queue Visualizer</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <h3>Stack (LIFO)</h3>
            <div class="control-panel">
              <input type="text" id="stack-input" placeholder="Value">
              <button onclick="StackQueuePage.stackPush()">Push</button>
              <button onclick="StackQueuePage.stackPop()">Pop</button>
              <button onclick="StackQueuePage.stackPeek()">Peek</button>
              <button onclick="StackQueuePage.stackClear()">Clear</button>
            </div>
            <div id="stack-container" style="min-height: 300px; background: var(--surface); border-radius: 10px; padding: 20px; display: flex; flex-direction: column-reverse; align-items: center; gap: 10px;">
              <div style="width: 200px; height: 5px; background: var(--primary); border-radius: 3px;"></div>
            </div>
            <p id="stack-info" style="text-align: center; margin-top: 10px;">Stack is empty</p>
          </div>
          
          <div>
            <h3>Queue (FIFO)</h3>
            <div class="control-panel">
              <input type="text" id="queue-input" placeholder="Value">
              <button onclick="StackQueuePage.queueEnqueue()">Enqueue</button>
              <button onclick="StackQueuePage.queueDequeue()">Dequeue</button>
              <button onclick="StackQueuePage.queuePeek()">Peek</button>
              <button onclick="StackQueuePage.queueClear()">Clear</button>
            </div>
            <div id="queue-container" style="min-height: 300px; background: var(--surface); border-radius: 10px; padding: 20px; display: flex; align-items: center; gap: 10px; overflow-x: auto;"></div>
            <p id="queue-info" style="text-align: center; margin-top: 10px;">Queue is empty</p>
          </div>
        </div>
      </div>
    `;
  },
  
  init() {
    this.renderStack();
    this.renderQueue();
  },
  
  stackPush() {
    const value = document.getElementById('stack-input').value.trim();
    if (!value) return;
    
    this.state.stack.push(value);
    this.renderStack();
    document.getElementById('stack-input').value = '';
    document.getElementById('stack-info').textContent = `Pushed "${value}" - Size: ${this.state.stack.length}`;
  },
  
  stackPop() {
    if (!this.state.stack.length) {
      document.getElementById('stack-info').textContent = 'Stack is empty!';
      return;
    }
    
    const value = this.state.stack.pop();
    this.renderStack();
    document.getElementById('stack-info').textContent = `Popped "${value}" - Size: ${this.state.stack.length}`;
  },
  
  stackPeek() {
    if (!this.state.stack.length) {
      document.getElementById('stack-info').textContent = 'Stack is empty!';
      return;
    }
    
    const value = this.state.stack[this.state.stack.length - 1];
    document.getElementById('stack-info').textContent = `Top element: "${value}"`;
  },
  
  stackClear() {
    this.state.stack = [];
    this.renderStack();
    document.getElementById('stack-info').textContent = 'Stack cleared';
  },
  
  renderStack() {
    const container = document.getElementById('stack-container');
    const base = container.querySelector('div');
    container.innerHTML = '';
    container.appendChild(base);
    
    if (!this.state.stack.length) {
      const msg = document.createElement('div');
      msg.textContent = 'Empty';
      msg.style.color = 'var(--text-muted)';
      container.appendChild(msg);
      return;
    }
    
    this.state.stack.forEach((val, idx) => {
      const el = document.createElement('div');
      el.className = 'stack-element';
      el.style.background = idx === this.state.stack.length - 1 ? 'var(--accent)' : 'var(--primary)';
      el.style.color = 'white';
      el.style.padding = '15px 30px';
      el.style.borderRadius = '8px';
      el.style.fontWeight = 'bold';
      el.style.minWidth = '150px';
      el.style.textAlign = 'center';
      el.textContent = val;
      if (idx === this.state.stack.length - 1) {
        el.textContent += ' ← TOP';
      }
      container.appendChild(el);
    });
  },
  
  queueEnqueue() {
    const value = document.getElementById('queue-input').value.trim();
    if (!value) return;
    
    this.state.queue.push(value);
    this.renderQueue();
    document.getElementById('queue-input').value = '';
    document.getElementById('queue-info').textContent = `Enqueued "${value}" - Size: ${this.state.queue.length}`;
  },
  
  queueDequeue() {
    if (!this.state.queue.length) {
      document.getElementById('queue-info').textContent = 'Queue is empty!';
      return;
    }
    
    const value = this.state.queue.shift();
    this.renderQueue();
    document.getElementById('queue-info').textContent = `Dequeued "${value}" - Size: ${this.state.queue.length}`;
  },
  
  queuePeek() {
    if (!this.state.queue.length) {
      document.getElementById('queue-info').textContent = 'Queue is empty!';
      return;
    }
    
    const value = this.state.queue[0];
    document.getElementById('queue-info').textContent = `Front element: "${value}"`;
  },
  
  queueClear() {
    this.state.queue = [];
    this.renderQueue();
    document.getElementById('queue-info').textContent = 'Queue cleared';
  },
  
  renderQueue() {
    const container = document.getElementById('queue-container');
    container.innerHTML = '';
    
    if (!this.state.queue.length) {
      const msg = document.createElement('div');
      msg.textContent = 'Empty';
      msg.style.color = 'var(--text-muted)';
      container.appendChild(msg);
      return;
    }
    
    this.state.queue.forEach((val, idx) => {
      const el = document.createElement('div');
      el.className = 'queue-element';
      el.style.background = 'var(--secondary)';
      el.style.color = 'white';
      el.style.padding = '15px 25px';
      el.style.borderRadius = '8px';
      el.style.fontWeight = 'bold';
      el.style.minWidth = '100px';
      el.style.textAlign = 'center';
      el.textContent = val;
      if (idx === 0) el.textContent = 'FRONT → ' + val;
      if (idx === this.state.queue.length - 1) el.textContent += ' ← REAR';
      container.appendChild(el);
      
      if (idx < this.state.queue.length - 1) {
        const arrow = document.createElement('div');
        arrow.textContent = '→';
        arrow.style.fontSize = '24px';
        arrow.style.color = 'var(--secondary)';
        container.appendChild(arrow);
      }
    });
  }
};
