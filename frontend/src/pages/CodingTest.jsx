import React, { useState, useEffect } from 'react';
import './CodingTest.css';

const CodingTest = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const languages = {
    javascript: {
      name: 'JavaScript',
      icon: '🟨',
      questions: [
        {
          id: 1,
          question: "What will be the output of the following code?\n\nconsole.log(typeof null);",
          options: ["null", "undefined", "object", "boolean"],
          correct: 2,
          explanation: "In JavaScript, typeof null returns 'object' due to a historical bug."
        },
        {
          id: 2,
          question: "Which method is used to add elements to the end of an array?",
          options: ["push()", "pop()", "shift()", "unshift()"],
          correct: 0,
          explanation: "push() adds elements to the end of an array."
        },
        {
          id: 3,
          question: "What is the correct way to create a function in JavaScript?",
          options: ["function = myFunction() {}", "function myFunction() {}", "create myFunction() {}", "def myFunction() {}"],
          correct: 1,
          explanation: "The correct syntax is 'function myFunction() {}'."
        },
        {
          id: 4,
          question: "What will be the output?\n\nlet x = [1, 2, 3];\nlet y = x;\ny.push(4);\nconsole.log(x.length);",
          options: ["3", "4", "undefined", "Error"],
          correct: 1,
          explanation: "Arrays are reference types, so y and x point to the same array."
        },
        {
          id: 5,
          question: "Which of the following is NOT a JavaScript data type?",
          options: ["undefined", "boolean", "float", "symbol"],
          correct: 2,
          explanation: "JavaScript uses 'number' for all numeric values, not separate 'float' type."
        }
      ]
    },
    python: {
      name: 'Python',
      icon: '🐍',
      questions: [
        {
          id: 1,
          question: "What will be the output of the following code?\n\nprint(type([]))",
          options: ["<class 'array'>", "<class 'list'>", "<class 'tuple'>", "<class 'dict'>"],
          correct: 1,
          explanation: "[] creates a list in Python, so type([]) returns <class 'list'>."
        },
        {
          id: 2,
          question: "Which keyword is used to create a function in Python?",
          options: ["function", "def", "create", "func"],
          correct: 1,
          explanation: "The 'def' keyword is used to define functions in Python."
        },
        {
          id: 3,
          question: "What is the correct way to create a dictionary in Python?",
          options: ["{key: value}", "{'key': 'value'}", "[key: value]", "(key: value)"],
          correct: 1,
          explanation: "Dictionaries in Python are created using curly braces with quoted keys."
        },
        {
          id: 4,
          question: "What will be the output?\n\nx = [1, 2, 3]\ny = x[:]\ny.append(4)\nprint(len(x))",
          options: ["3", "4", "Error", "None"],
          correct: 0,
          explanation: "x[:] creates a shallow copy, so modifying y doesn't affect x."
        },
        {
          id: 5,
          question: "Which method is used to remove and return the last element from a list?",
          options: ["remove()", "pop()", "delete()", "clear()"],
          correct: 1,
          explanation: "pop() removes and returns the last element from a list."
        }
      ]
    },
    java: {
      name: 'Java',
      icon: '☕',
      questions: [
        {
          id: 1,
          question: "Which of the following is the correct way to declare a variable in Java?",
          options: ["int x;", "var x;", "x int;", "declare int x;"],
          correct: 0,
          explanation: "In Java, variables are declared with the data type followed by the variable name."
        },
        {
          id: 2,
          question: "What is the entry point of a Java application?",
          options: ["start()", "begin()", "main()", "init()"],
          correct: 2,
          explanation: "The main() method is the entry point of a Java application."
        },
        {
          id: 3,
          question: "Which access modifier makes a member accessible only within the same class?",
          options: ["public", "protected", "private", "default"],
          correct: 2,
          explanation: "The 'private' access modifier restricts access to the same class only."
        },
        {
          id: 4,
          question: "What will be the output?\n\nString s1 = \"Hello\";\nString s2 = \"Hello\";\nSystem.out.println(s1 == s2);",
          options: ["true", "false", "Error", "null"],
          correct: 0,
          explanation: "String literals are stored in string pool, so s1 and s2 reference the same object."
        },
        {
          id: 5,
          question: "Which keyword is used to inherit a class in Java?",
          options: ["inherits", "extends", "implements", "super"],
          correct: 1,
          explanation: "The 'extends' keyword is used for class inheritance in Java."
        }
      ]
    },
    cpp: {
      name: 'C++',
      icon: '⚡',
      questions: [
        {
          id: 1,
          question: "Which header file is required for input/output operations in C++?",
          options: ["<stdio.h>", "<iostream>", "<conio.h>", "<fstream>"],
          correct: 1,
          explanation: "<iostream> is the standard header for input/output operations in C++."
        },
        {
          id: 2,
          question: "What is the correct way to declare a pointer in C++?",
          options: ["int ptr;", "int *ptr;", "int &ptr;", "pointer int ptr;"],
          correct: 1,
          explanation: "Pointers are declared using the asterisk (*) symbol."
        },
        {
          id: 3,
          question: "Which operator is used for dynamic memory allocation in C++?",
          options: ["malloc", "alloc", "new", "create"],
          correct: 2,
          explanation: "The 'new' operator is used for dynamic memory allocation in C++."
        },
        {
          id: 4,
          question: "What is the difference between '++i' and 'i++'?",
          options: ["No difference", "++i is faster", "++i increments before use, i++ after", "i++ is faster"],
          correct: 2,
          explanation: "++i (pre-increment) increments before use, i++ (post-increment) increments after use."
        },
        {
          id: 5,
          question: "Which access specifier is used by default in a C++ class?",
          options: ["public", "private", "protected", "internal"],
          correct: 1,
          explanation: "Class members are private by default in C++."
        }
      ]
    },
    react: {
      name: 'React',
      icon: '⚛️',
      questions: [
        {
          id: 1,
          question: "What is JSX in React?",
          options: ["A JavaScript library", "A syntax extension for JavaScript", "A CSS framework", "A database"],
          correct: 1,
          explanation: "JSX is a syntax extension for JavaScript that allows writing HTML-like code in React."
        },
        {
          id: 2,
          question: "Which hook is used to manage state in functional components?",
          options: ["useEffect", "useState", "useContext", "useReducer"],
          correct: 1,
          explanation: "useState is the primary hook for managing state in functional components."
        },
        {
          id: 3,
          question: "What is the purpose of useEffect hook?",
          options: ["Managing state", "Handling side effects", "Creating components", "Styling components"],
          correct: 1,
          explanation: "useEffect is used to handle side effects like API calls, subscriptions, etc."
        },
        {
          id: 4,
          question: "How do you pass data from parent to child component?",
          options: ["Using state", "Using props", "Using context", "Using refs"],
          correct: 1,
          explanation: "Props are used to pass data from parent to child components."
        },
        {
          id: 5,
          question: "What is the virtual DOM in React?",
          options: ["A real DOM copy", "A JavaScript representation of the real DOM", "A CSS framework", "A database"],
          correct: 1,
          explanation: "Virtual DOM is a JavaScript representation of the real DOM for efficient updates."
        }
      ]
    },
    nodejs: {
      name: 'Node.js',
      icon: '🟢',
      questions: [
        {
          id: 1,
          question: "What is Node.js?",
          options: ["A JavaScript framework", "A JavaScript runtime", "A database", "A web browser"],
          correct: 1,
          explanation: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine."
        },
        {
          id: 2,
          question: "Which module is used to create a web server in Node.js?",
          options: ["fs", "path", "http", "url"],
          correct: 2,
          explanation: "The 'http' module is used to create web servers in Node.js."
        },
        {
          id: 3,
          question: "What is npm?",
          options: ["Node Package Manager", "New Programming Method", "Network Protocol Manager", "Node Process Manager"],
          correct: 0,
          explanation: "npm stands for Node Package Manager, used to manage Node.js packages."
        },
        {
          id: 4,
          question: "Which method is used to read files asynchronously in Node.js?",
          options: ["fs.readFileSync()", "fs.readFile()", "fs.read()", "fs.open()"],
          correct: 1,
          explanation: "fs.readFile() is used for asynchronous file reading in Node.js."
        },
        {
          id: 5,
          question: "What is Express.js?",
          options: ["A database", "A web framework for Node.js", "A testing library", "A CSS framework"],
          correct: 1,
          explanation: "Express.js is a minimal and flexible web application framework for Node.js."
        }
      ]
    }
  };

  useEffect(() => {
    let timer;
    if (isTestStarted && timeLeft > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestStarted, timeLeft, showResults]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    setIsTestStarted(true);
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < languages[selectedLanguage].questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitTest = () => {
    setShowResults(true);
    setIsTestStarted(false);
  };

  const calculateScore = () => {
    const questions = languages[selectedLanguage].questions;
    let correct = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correct) {
        correct++;
      }
    });
    return { correct, total: questions.length, percentage: Math.round((correct / questions.length) * 100) };
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setTimeLeft(900);
    setIsTestStarted(false);
    setShowResults(false);
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="coding-test">
        <div className="test-results">
          <div className="results-header">
            <h2>🎉 Test Completed!</h2>
            <div className="language-badge">
              <span className="language-icon">{languages[selectedLanguage].icon}</span>
              {languages[selectedLanguage].name}
            </div>
          </div>

          <div className="score-summary">
            <div className="score-circle">
              <div className="score-percentage">{score.percentage}%</div>
              <div className="score-fraction">{score.correct}/{score.total}</div>
            </div>
          </div>

          <div className="detailed-results">
            <h3>📋 Detailed Results</h3>
            {languages[selectedLanguage].questions.map((q, index) => (
              <div key={q.id} className={`result-item ${userAnswers[q.id] === q.correct ? 'correct' : 'incorrect'}`}>
                <div className="result-header">
                  <span className="question-number">Q{index + 1}</span>
                  <span className={`result-status ${userAnswers[q.id] === q.correct ? 'correct' : 'incorrect'}`}>
                    {userAnswers[q.id] === q.correct ? '✅ Correct' : '❌ Incorrect'}
                  </span>
                </div>
                <div className="result-question">{q.question}</div>
                <div className="result-answers">
                  <div className="your-answer">
                    <strong>Your Answer:</strong> {q.options[userAnswers[q.id]] || 'Not answered'}
                  </div>
                  <div className="correct-answer">
                    <strong>Correct Answer:</strong> {q.options[q.correct]}
                  </div>
                  <div className="explanation">
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="results-actions">
            <button className="btn btn-primary" onClick={resetTest}>
              🔄 Take Another Test
            </button>
            <button className="btn btn-secondary" onClick={() => setSelectedLanguage('')}>
              🏠 Back to Languages
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isTestStarted) {
    return (
      <div className="coding-test">
        <div className="test-setup">
          <div className="setup-header">
            <h1>💻 Coding Test</h1>
            <p>Test your programming knowledge across different languages</p>
          </div>

          <div className="language-selection">
            <h2>🎯 Select Programming Language</h2>
            <div className="languages-grid">
              {Object.entries(languages).map(([key, lang]) => (
                <div
                  key={key}
                  className={`language-card ${selectedLanguage === key ? 'selected' : ''}`}
                  onClick={() => setSelectedLanguage(key)}
                >
                  <div className="language-icon">{lang.icon}</div>
                  <div className="language-name">{lang.name}</div>
                  <div className="question-count">{lang.questions.length} Questions</div>
                </div>
              ))}
            </div>
          </div>

          <div className="test-info">
            <h3>📋 Test Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon">⏱️</span>
                <div>
                  <strong>Duration</strong>
                  <p>15 minutes</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">❓</span>
                <div>
                  <strong>Questions</strong>
                  <p>{languages[selectedLanguage].questions.length} multiple choice</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🎯</span>
                <div>
                  <strong>Language</strong>
                  <p>{languages[selectedLanguage].name}</p>
                </div>
              </div>
            </div>
          </div>

          <button className="btn btn-primary btn-large" onClick={handleStartTest}>
            🚀 Start Test
          </button>
        </div>
      </div>
    );
  }

  const currentQ = languages[selectedLanguage].questions[currentQuestion];
  const progress = ((currentQuestion + 1) / languages[selectedLanguage].questions.length) * 100;

  return (
    <div className="coding-test">
      <div className="test-header">
        <div className="test-info-bar">
          <div className="language-info">
            <span className="language-icon">{languages[selectedLanguage].icon}</span>
            {languages[selectedLanguage].name} Test
          </div>
          <div className="timer">
            <span className="timer-icon">⏱️</span>
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          <span className="progress-text">
            Question {currentQuestion + 1} of {languages[selectedLanguage].questions.length}
          </span>
        </div>
      </div>

      <div className="test-content">
        <div className="question-section">
          <div className="question-header">
            <span className="question-number">Q{currentQuestion + 1}</span>
          </div>
          
          <div className="question-text">
            <pre>{currentQ.question}</pre>
          </div>

          <div className="options-list">
            {currentQ.options.map((option, index) => (
              <div
                key={index}
                className={`option-item ${userAnswers[currentQ.id] === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(currentQ.id, index)}
              >
                <div className="option-radio">
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    checked={userAnswers[currentQ.id] === index}
                    onChange={() => handleAnswerSelect(currentQ.id, index)}
                  />
                </div>
                <div className="option-text">
                  <span className="option-label">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="test-navigation">
          <div className="nav-buttons">
            <button
              className="btn btn-secondary"
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>
            
            {currentQuestion === languages[selectedLanguage].questions.length - 1 ? (
              <button className="btn btn-success" onClick={handleSubmitTest}>
                ✅ Submit Test
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleNextQuestion}>
                Next →
              </button>
            )}
          </div>

          <div className="question-navigator">
            {languages[selectedLanguage].questions.map((_, index) => (
              <button
                key={index}
                className={`nav-dot ${index === currentQuestion ? 'current' : ''} ${
                  userAnswers[languages[selectedLanguage].questions[index].id] !== undefined ? 'answered' : ''
                }`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingTest;