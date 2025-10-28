import React, { useState, useEffect, useRef } from 'react';
import './TypingSpeed.css';

function TypingSpeed() {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [customText, setCustomText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [timerMode, setTimerMode] = useState(null); // null, 1, 3, 5, 10 (minutes)
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const inputRef = useRef(null);
  const textDisplayRef = useRef(null);
  const currentCharRef = useRef(null);

  const sampleTexts = {
    easy: [
      "The quick brown fox jumps over the lazy dog.",
      "A journey of a thousand miles begins with a single step.",
      "Practice makes perfect when you work hard every day.",
      "Learning to type fast is a valuable skill to have.",
      "The sun rises in the east and sets in the west."
    ],
    medium: [
      "Programming is the art of algorithm design and the craft of debugging errant code.",
      "Technology is best when it brings people together and makes life easier for everyone.",
      "The only way to do great work is to love what you do and keep improving.",
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "Innovation distinguishes between a leader and a follower in the modern world."
    ],
    hard: [
      "The intricate algorithms and data structures form the backbone of efficient software development.",
      "Artificial intelligence and machine learning revolutionize industries by automating complex tasks.",
      "Quantum computing promises unprecedented computational power for solving intractable problems.",
      "Cybersecurity professionals constantly battle sophisticated threats in the digital landscape.",
      "Full-stack developers must master both frontend frameworks and backend architectures simultaneously."
    ]
  };

  useEffect(() => {
    if (difficulty !== 'custom') {
      resetTest();
    }
  }, [difficulty]);

  useEffect(() => {
    if (isRunning && userInput.length > 0) {
      calculateMetrics();
    }
  }, [userInput]);

  useEffect(() => {
    // Auto-scroll to keep current typing position visible
    if (currentCharRef.current && textDisplayRef.current) {
      const charElement = currentCharRef.current;
      const displayElement = textDisplayRef.current;

      const charRect = charElement.getBoundingClientRect();
      const displayRect = displayElement.getBoundingClientRect();

      // Calculate if current character is outside the visible area
      const isAboveView = charRect.top < displayRect.top;
      const isBelowView = charRect.bottom > displayRect.bottom;

      if (isAboveView || isBelowView) {
        // Scroll to center the current character
        const scrollOffset = charElement.offsetTop - (displayElement.clientHeight / 2) + (charElement.offsetHeight / 2);
        displayElement.scrollTo({
          top: scrollOffset,
          behavior: 'smooth'
        });
      }
    }
  }, [userInput.length]);

  useEffect(() => {
    // Timer countdown effect
    if (timerMode && isRunning && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    }
  }, [timerMode, isRunning]);

  const handleTimerEnd = () => {
    setIsRunning(false);
    setEndTime(Date.now());
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const startTimerMode = (minutes) => {
    setTimerMode(minutes);
    setTimeRemaining(minutes * 60);
    generateLongText();
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsRunning(false);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setCorrectChars(0);

    // Scroll text display to top
    setTimeout(() => {
      if (textDisplayRef.current) {
        textDisplayRef.current.scrollTop = 0;
      }
    }, 100);
  };

  const generateLongText = () => {
    // Generate a long text by combining multiple sentences
    const allTexts = [...sampleTexts.easy, ...sampleTexts.medium, ...sampleTexts.hard];
    let longText = '';
    for (let i = 0; i < 20; i++) {
      const randomText = allTexts[Math.floor(Math.random() * allTexts.length)];
      longText += randomText + ' ';
    }
    setText(longText.trim());
  };

  const cancelTimerMode = () => {
    setTimerMode(null);
    setTimeRemaining(0);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsRunning(false);
    resetTest();
  };

  const resetTest = () => {
    if (difficulty === 'custom') {
      if (customText.trim().length === 0) {
        setText('Please enter your custom text above and click "Start with Custom Text"');
      } else {
        setText(customText);
      }
    } else {
      const texts = sampleTexts[difficulty];
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      setText(randomText);
    }
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsRunning(false);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setCorrectChars(0);

    // Scroll text display to top
    if (textDisplayRef.current) {
      textDisplayRef.current.scrollTop = 0;
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (!isRunning && value.length > 0) {
      setIsRunning(true);
      setStartTime(Date.now());
    }

    setUserInput(value);

    // In timer mode, don't stop when text ends - let timer expire
    if (!timerMode && value === text) {
      setEndTime(Date.now());
      setIsRunning(false);
    }
  };

  const calculateMetrics = () => {
    const currentTime = Date.now();
    const timeElapsed = (currentTime - startTime) / 1000 / 60; // in minutes

    // Calculate WPM
    const wordsTyped = userInput.trim().split(/\s+/).length;
    const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;
    setWpm(currentWpm);

    // Calculate accuracy
    let correct = 0;
    let totalErrors = 0;

    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) {
        correct++;
      } else {
        totalErrors++;
      }
    }

    setCorrectChars(correct);
    setErrors(totalErrors);

    const currentAccuracy = userInput.length > 0
      ? Math.round((correct / userInput.length) * 100)
      : 100;
    setAccuracy(currentAccuracy);
  };

  const getCharClassName = (index) => {
    if (index >= userInput.length) {
      return 'char';
    }
    return userInput[index] === text[index] ? 'char correct' : 'char incorrect';
  };

  const startNewTest = () => {
    resetTest();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCustomTextSubmit = () => {
    if (customText.trim().length > 0) {
      setText(customText);
      setUserInput('');
      setStartTime(null);
      setEndTime(null);
      setIsRunning(false);
      setWpm(0);
      setAccuracy(100);
      setErrors(0);
      setCorrectChars(0);
      setShowCustomInput(false);

      // Scroll text display to top
      setTimeout(() => {
        if (textDisplayRef.current) {
          textDisplayRef.current.scrollTop = 0;
        }
      }, 100);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      alert('Please enter some text to practice with!');
    }
  };

  const formatTime = () => {
    if (timerMode) {
      // Show countdown timer in MM:SS format
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    if (!startTime) return '0.00';
    const elapsed = ((endTime || Date.now()) - startTime) / 1000;
    return elapsed.toFixed(2);
  };

  return (
    <div className="typing-speed-page">
      <div className="page-header">
        <h2>⌨️ Typing Speed Test</h2>
        <p className="page-subtitle">Improve your typing speed and accuracy with keyboard practice</p>
      </div>

      <div className="typing-container">
        {!isRunning && !endTime && (
          <div className="controls-section">
            <div className="difficulty-selector">
              <label>Difficulty Level:</label>
              <div className="difficulty-buttons">
                <button
                  className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
                  onClick={() => setDifficulty('easy')}
                >
                  🟢 Easy
                </button>
                <button
                  className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
                  onClick={() => setDifficulty('medium')}
                >
                  🟡 Medium
                </button>
                <button
                  className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
                  onClick={() => setDifficulty('hard')}
                >
                  🔴 Hard
                </button>
                <button
                  className={`difficulty-btn ${difficulty === 'custom' ? 'active' : ''}`}
                  onClick={() => {
                    setDifficulty('custom');
                    setShowCustomInput(true);
                  }}
                >
                  ✏️ Custom
                </button>
              </div>
            </div>

            <div className="timer-selector">
              <label>⏱️ Timer Mode (Optional):</label>
              <div className="timer-buttons">
                <button
                  className={`timer-btn ${timerMode === 1 ? 'active' : ''}`}
                  onClick={() => startTimerMode(1)}
                >
                  1 Min
                </button>
                <button
                  className={`timer-btn ${timerMode === 3 ? 'active' : ''}`}
                  onClick={() => startTimerMode(3)}
                >
                  3 Min
                </button>
                <button
                  className={`timer-btn ${timerMode === 5 ? 'active' : ''}`}
                  onClick={() => startTimerMode(5)}
                >
                  5 Min
                </button>
                <button
                  className={`timer-btn ${timerMode === 10 ? 'active' : ''}`}
                  onClick={() => startTimerMode(10)}
                >
                  10 Min
                </button>
                {timerMode && (
                  <button
                    className="timer-btn cancel-timer"
                    onClick={cancelTimerMode}
                  >
                    ✕ Cancel Timer
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {(isRunning || endTime) && (
          <div className="stats-display-active">
            <div className="stat-box">
              <div className="stat-label">WPM</div>
              <div className="stat-value">{wpm}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Accuracy</div>
              <div className="stat-value">{accuracy}%</div>
            </div>
            {(startTime || timerMode) && (
              <div className="stat-box">
                <div className="stat-label">Time</div>
                <div className="stat-value">{formatTime()}{timerMode ? '' : 's'}</div>
              </div>
            )}
            <div className="stat-box">
              <div className="stat-label">Errors</div>
              <div className="stat-value">{errors}</div>
            </div>
          </div>
        )}

        {showCustomInput && (
          <div className="custom-text-section">
            <h3>✏️ Enter Your Custom Text</h3>
            <textarea
              className="custom-text-input"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Enter the text you want to practice typing. It can be anything - a quote, a paragraph from a book, code snippet, or any other text..."
              rows="4"
            />
            <div className="custom-text-buttons">
              <button className="btn btn-submit" onClick={handleCustomTextSubmit}>
                ✓ Start with Custom Text
              </button>
              <button
                className="btn btn-cancel"
                onClick={() => {
                  setShowCustomInput(false);
                  setDifficulty('easy');
                }}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        )}

        <div className="text-display-section">
          <div className="text-display" ref={textDisplayRef}>
            {text.split('').map((char, index) => {
              const isCurrent = index === userInput.length;
              return (
                <span
                  key={index}
                  className={`${getCharClassName(index)} ${isCurrent ? 'current-char' : ''}`}
                  ref={isCurrent ? currentCharRef : null}
                >
                  {char}
                </span>
              );
            })}
            {userInput.length === text.length && userInput === text && (
              <span className="completion-indicator">✓</span>
            )}
          </div>
        </div>

        <div className="input-section">
          <textarea
            ref={inputRef}
            className="typing-input"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing here..."
            disabled={endTime !== null}
            spellCheck="false"
            autoComplete="off"
            rows="4"
          />
        </div>

        <div className="action-buttons">
          <button className="btn btn-restart" onClick={startNewTest}>
            🔄 New Test
          </button>
          {endTime && (
            <div className="completion-message">
              <span className="celebration-emoji">🎉</span>
              <span>Test completed! Your speed: <strong>{wpm} WPM</strong> with <strong>{accuracy}% accuracy</strong></span>
            </div>
          )}
        </div>

        <div className="progress-section">
          <div className="progress-label">Progress: {userInput.length} / {text.length} characters</div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${(userInput.length / text.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="tips-section">
        <h3>💡 Tips to Improve Your Typing Speed</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>🎯 Proper Posture</h4>
            <p>Sit up straight with feet flat on the floor. Keep your wrists elevated and not resting on the desk.</p>
          </div>
          <div className="tip-card">
            <h4>👀 Don't Look at Keyboard</h4>
            <p>Train yourself to type without looking at the keys. Focus on the screen to build muscle memory.</p>
          </div>
          <div className="tip-card">
            <h4>🖐️ Use All Fingers</h4>
            <p>Place your fingers on the home row (ASDF JKL;) and use the proper finger for each key.</p>
          </div>
          <div className="tip-card">
            <h4>⏱️ Practice Daily</h4>
            <p>Consistent practice is key. Spend 15-30 minutes daily to see significant improvement.</p>
          </div>
          <div className="tip-card">
            <h4>🎵 Find Your Rhythm</h4>
            <p>Type at a steady, comfortable pace. Speed will come naturally as you improve accuracy.</p>
          </div>
          <div className="tip-card">
            <h4>🔄 Take Breaks</h4>
            <p>Rest your hands and eyes every 20-30 minutes to avoid strain and maintain focus.</p>
          </div>
        </div>
      </div>

      <div className="keyboard-layout-section">
        <h3>⌨️ Standard Keyboard Layout</h3>
        <div className="keyboard-visual">
          <div className="keyboard-row">
            <span className="key">Q</span>
            <span className="key">W</span>
            <span className="key">E</span>
            <span className="key">R</span>
            <span className="key">T</span>
            <span className="key">Y</span>
            <span className="key">U</span>
            <span className="key">I</span>
            <span className="key">O</span>
            <span className="key">P</span>
          </div>
          <div className="keyboard-row">
            <span className="key home-key">A</span>
            <span className="key home-key">S</span>
            <span className="key home-key">D</span>
            <span className="key home-key">F</span>
            <span className="key">G</span>
            <span className="key">H</span>
            <span className="key home-key">J</span>
            <span className="key home-key">K</span>
            <span className="key home-key">L</span>
            <span className="key">;</span>
          </div>
          <div className="keyboard-row">
            <span className="key">Z</span>
            <span className="key">X</span>
            <span className="key">C</span>
            <span className="key">V</span>
            <span className="key">B</span>
            <span className="key">N</span>
            <span className="key">M</span>
            <span className="key">,</span>
            <span className="key">.</span>
            <span className="key">/</span>
          </div>
          <div className="keyboard-row">
            <span className="key spacebar">Space</span>
          </div>
        </div>
        <p className="keyboard-note">🏠 Highlighted keys represent the home row position</p>
      </div>
    </div>
  );
}

export default TypingSpeed;
