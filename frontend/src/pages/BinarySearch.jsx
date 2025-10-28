import React, { useState, useEffect } from 'react';
import './BinarySearch.css';

function BinarySearch() {
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [size, setSize] = useState(12);

  const generateArray = () => {
    const arr = Array.from({ length: size }, (_, i) => (i + 1) * 3);
    setArray(arr);
    setSteps([]);
    setCurrentStep(-1);
  };

  const prepareSteps = () => {
    const searchSteps = [];
    let low = 0, high = array.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      searchSteps.push({ low, mid, high, value: array[mid] });

      if (array[mid] === parseInt(target)) {
        searchSteps.push({ low, mid, high, found: true });
        break;
      } else if (array[mid] < parseInt(target)) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    if (low > high) searchSteps.push({ notFound: true });
    setSteps(searchSteps);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const step = steps[currentStep];

  return (
    <div className="binary-search">
      <div className="page-header">
        <h2>🔍 Binary Search Visualizer</h2>
        <p className="page-subtitle">Step-by-step visualization of binary search algorithm</p>
      </div>

      <div className="controls">
        <input type="number" value={size} onChange={(e) => setSize(+e.target.value)} min="5" max="20" placeholder="Array Size" />
        <button onClick={generateArray} className="btn btn-primary">Generate Array</button>
        <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Search Target" />
        <button onClick={prepareSteps} className="btn btn-success">Start Search</button>
      </div>

      {array.length > 0 && (
        <div className="array-container">
          {array.map((val, idx) => (
            <div key={idx} className={`array-item ${
              step?.low === idx ? 'low' :
              step?.mid === idx ? 'mid' :
              step?.high === idx ? 'high' :
              step?.found && step?.mid === idx ? 'found' : ''
            }`}>
              <div className="value">{val}</div>
              <div className="index">{idx}</div>
            </div>
          ))}
        </div>
      )}

      {steps.length > 0 && (
        <>
          <div className="step-controls">
            <button onClick={prevStep} disabled={currentStep <= 0} className="btn">Previous</button>
            <span>Step {currentStep + 1} / {steps.length}</span>
            <button onClick={nextStep} disabled={currentStep >= steps.length - 1} className="btn">Next</button>
          </div>

          <div className="explanation">
            {step?.found ? `Found ${target} at index ${step.mid}!` :
             step?.notFound ? `${target} not found` :
             `Checking mid=${step?.mid}, value=${step?.value}`}
          </div>
        </>
      )}
    </div>
  );
}

export default BinarySearch;
