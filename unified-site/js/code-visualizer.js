// Code Visualizer Page - Multi-language step-by-step execution
const CodeVisualizerPage = {
  state: {
    language: 'javascript',
    code: '',
    lines: [],
    steps: [],
    currentStep: 0,
    variables: {},
    output: [],
    autoRunning: false
  },
  
  examples: {
    javascript: `let sum = 0;
for(let i = 0; i < 3; i++) {
  sum = sum + i;
  console.log('i =', i, 'sum =', sum);
}
console.log('Final:', sum);`,
    python: `sum = 0
for i in range(3):
    sum = sum + i
    print('i =', i, 'sum =', sum)
print('Final:', sum)`,
    java: `int sum = 0;
for(int i = 0; i < 3; i++) {
  sum = sum + i;
  System.out.println("i = " + i + " sum = " + sum);
}
System.out.println("Final: " + sum);`
  },
  
  render() {
    return `
      <div class="page">
        <h2>💻 Multi-Language Code Visualizer</h2>
        
        <div class="control-panel">
          <select id="cv-lang">
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <button onclick="CodeVisualizerPage.start()">▶ Start</button>
          <button onclick="CodeVisualizerPage.nextStep()" id="cv-next" disabled>⏭ Next</button>
          <button onclick="CodeVisualizerPage.autoRun()" id="cv-auto" disabled>⚡ Auto</button>
          <button onclick="CodeVisualizerPage.reset()">Reset</button>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
          <div>
            <h3 style="color:var(--primary);margin-bottom:10px;">Code Input</h3>
            <textarea id="cv-code" style="width:100%;height:300px;font-family:monospace;padding:10px;border-radius:8px;background:#1e293b;color:#d4d4d4;border:2px solid #334155;"></textarea>
          </div>
          
          <div>
            <h3 style="color:var(--primary);margin-bottom:10px;">Execution</h3>
            <div class="code-display" id="cv-display"></div>
          </div>
          
          <div>
            <h3 style="color:var(--primary);margin-bottom:10px;">Variables</h3>
            <div style="background:var(--surface);padding:15px;border-radius:8px;min-height:150px;" id="cv-vars">No variables yet...</div>
          </div>
          
          <div>
            <h3 style="color:var(--primary);margin-bottom:10px;">Console Output</h3>
            <div style="background:#1e1e1e;color:#0f0;padding:15px;border-radius:8px;min-height:150px;font-family:monospace;" id="cv-output">Waiting...</div>
          </div>
        </div>
      </div>
    `;
  },
  
  init() {
    document.getElementById('cv-lang').addEventListener('change', (e) => {
      this.state.language = e.target.value;
      document.getElementById('cv-code').value = this.examples[e.target.value];
    });
    document.getElementById('cv-code').value = this.examples.javascript;
  },
  
  start() {
    this.state.code = document.getElementById('cv-code').value;
    this.state.lines = this.state.code.split('\n').filter(l => l.trim());
    this.parseSteps();
    this.state.currentStep = 0;
    this.state.variables = {};
    this.state.output = [];
    
    document.getElementById('cv-next').disabled = false;
    document.getElementById('cv-auto').disabled = false;
    
    this.renderCode();
    this.updateVars();
    this.updateOutput();
  },
  
  parseSteps() {
    this.state.steps = [];
    this.state.lines.forEach((line, i) => {
      this.state.steps.push({type: 'execute', line: i, code: line});
    });
  },
  
  nextStep() {
    if (this.state.currentStep >= this.state.steps.length) return;
    
    const step = this.state.steps[this.state.currentStep];
    this.executeLine(step.code);
    
    this.state.currentStep++;
    this.renderCode();
    this.updateVars();
    this.updateOutput();
    
    if (this.state.currentStep >= this.state.steps.length) {
      document.getElementById('cv-next').disabled = true;
      document.getElementById('cv-auto').disabled = true;
    }
  },
  
  executeLine(line) {
    const trimmed = line.trim();
    
    // For loop handling (simplified)
    if (trimmed.includes('for')) {
      const forMatch = trimmed.match(/for\s*\(.*?(\w+)\s*=\s*(\d+).*?<\s*(\d+)/);
      if (forMatch) {
        const [, varName, start, end] = forMatch;
        if (!this.state.variables[varName + '_loop']) {
          this.state.variables[varName + '_loop'] = parseInt(start);
          this.state.variables[varName] = parseInt(start);
        } else {
          this.state.variables[varName + '_loop']++;
          this.state.variables[varName] = this.state.variables[varName + '_loop'];
        }
      }
      return;
    }
    
    // Variable assignment
    const varMatch = trimmed.match(/(?:let|const|var|int)?\s*(\w+)\s*=\s*(.+?);?$/);
    if (varMatch && !trimmed.includes('print') && !trimmed.includes('console')) {
      const varName = varMatch[1];
      let varValue = varMatch[2].replace(/;$/, '');
      try {
        this.state.variables[varName] = this.evalInContext(varValue);
      } catch (e) {
        this.state.variables[varName] = varValue;
      }
      return;
    }
    
    // Console output
    if (trimmed.includes('console.log') || trimmed.includes('print') || trimmed.includes('System.out')) {
      const match = trimmed.match(/(?:console\.log|print|System\.out\.println)\((.*)\)/);
      if (match) {
        let args = match[1];
        try {
          const parts = args.split(',').map(p => {
            p = p.trim().replace(/['"]/g, '');
            return this.state.variables[p] !== undefined ? this.state.variables[p] : p;
          });
          this.state.output.push(parts.join(' '));
        } catch (e) {
          this.state.output.push(args);
        }
      }
    }
  },
  
  evalInContext(expr) {
    try {
      const func = new Function(...Object.keys(this.state.variables), `return ${expr}`);
      return func(...Object.values(this.state.variables));
    } catch (e) {
      return expr;
    }
  },
  
  renderCode() {
    const display = document.getElementById('cv-display');
    display.innerHTML = '';
    
    this.state.lines.forEach((line, i) => {
      const div = document.createElement('div');
      div.className = 'code-line';
      div.textContent = `${i + 1}: ${line}`;
      
      if (i < this.state.currentStep) div.classList.add('executed');
      else if (i === this.state.currentStep) div.classList.add('current');
      
      display.appendChild(div);
    });
  },
  
  updateVars() {
    const display = document.getElementById('cv-vars');
    if (Object.keys(this.state.variables).length === 0) {
      display.innerHTML = 'No variables yet...';
      return;
    }
    
    display.innerHTML = '';
    for (const [name, value] of Object.entries(this.state.variables)) {
      const div = document.createElement('div');
      div.className = 'variable-item';
      div.innerHTML = `<span>${name}</span><span>${JSON.stringify(value)}</span>`;
      display.appendChild(div);
    }
  },
  
  updateOutput() {
    const display = document.getElementById('cv-output');
    display.textContent = this.state.output.length ? this.state.output.join('\n') : 'Waiting...';
  },
  
  async autoRun() {
    if (this.state.autoRunning) {
      this.state.autoRunning = false;
      document.getElementById('cv-auto').textContent = '⚡ Auto';
      return;
    }
    
    this.state.autoRunning = true;
    document.getElementById('cv-auto').textContent = '⏸ Pause';
    
    while (this.state.autoRunning && this.state.currentStep < this.state.steps.length) {
      this.nextStep();
      await sleep(800);
    }
    
    this.state.autoRunning = false;
    document.getElementById('cv-auto').textContent = '⚡ Auto';
  },
  
  reset() {
    this.state.currentStep = 0;
    this.state.variables = {};
    this.state.output = [];
    this.state.autoRunning = false;
    
    document.getElementById('cv-display').innerHTML = '';
    document.getElementById('cv-vars').innerHTML = 'No variables yet...';
    document.getElementById('cv-output').textContent = 'Waiting...';
    document.getElementById('cv-next').disabled = true;
    document.getElementById('cv-auto').disabled = true;
  }
};
