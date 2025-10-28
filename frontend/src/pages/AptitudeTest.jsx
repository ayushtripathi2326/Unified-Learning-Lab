import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AptitudeTest.css';

function AptitudeTest({ user }) {
  const { category } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/questions/${category}`)
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [category]);

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = () => {
    axios.post('http://localhost:5000/api/questions/submit', { category, answers })
      .then(res => setResult(res.data))
      .catch(err => console.error(err));
  };

  if (loading) return <div className="loading">Loading questions...</div>;
  if (result) {
    return (
      <div className="result-card">
        <h2>Test Completed!</h2>
        <div className="score">
          <p>Score: {result.score} / {result.total}</p>
          <p>Percentage: {result.percentage}%</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Back to Dashboard</button>
      </div>
    );
  }

  const question = questions[currentIndex];
  if (!question) return <div>No questions available</div>;

  return (
    <div className="aptitude-test">
      <h2>{category} Test</h2>
      <div className="progress">Question {currentIndex + 1} of {questions.length}</div>
      <div className="question-card">
        <h3>{question.text}</h3>
        <div className="options">
          {question.options.map((option, idx) => (
            <label key={idx} className="option">
              <input
                type="radio"
                name={question._id}
                checked={answers[question._id] === idx}
                onChange={() => handleAnswer(question._id, idx)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="navigation">
        <button onClick={() => setCurrentIndex(currentIndex - 1)} disabled={currentIndex === 0} className="btn">Previous</button>
        {currentIndex < questions.length - 1 ? (
          <button onClick={() => setCurrentIndex(currentIndex + 1)} className="btn btn-primary">Next</button>
        ) : (
          <button onClick={handleSubmit} className="btn btn-success">Submit</button>
        )}
      </div>
    </div>
  );
}

export default AptitudeTest;
