import React, { useState, useEffect } from 'react';
import axios from 'axios';

function decodeHtmlEntities(text) {
  const doc = new DOMParser().parseFromString(text, "text/html");
  return doc.documentElement.textContent;
}

function AptitudeTest() {
  const [quizData, setQuizData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userId] = useState('67a09ba10f07e4ff1bcb0ce3'); 

  useEffect(() => {
    axios
      .get('https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple')
      .then((response) => {
        const formattedData = response.data.results.map((question) => ({
          ...question,
          options: [...question.incorrect_answers, question.correct_answer]
            .sort(() => Math.random() - 0.5),
        }));
        setQuizData(formattedData);
      })
      .catch((err) => console.error('Error fetching quiz data:', err));
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption === quizData[currentQuestion].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption('');
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = () => {
    const finalScore = score + (selectedOption === quizData[currentQuestion].correct_answer ? 1 : 0);
    setQuizCompleted(true);

    axios.post('http://localhost:3001/saveScore', { 
      userId, 
      score: finalScore 
    })
    .then(() => alert(`Quiz completed! Your score is ${finalScore}`))
    .catch(error => console.error("Error saving score:", error));
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Aptitude Test</h1>
      {quizData.length === 0 ? (
        <p>Loading quiz...</p>
      ) : quizCompleted ? (
        <p style={styles.result}>Quiz Completed! Your score is {score}.</p>
      ) : (
        <div style={styles.quizBox}>
          <h2 style={styles.question}>{decodeHtmlEntities(quizData[currentQuestion].question)}</h2>
          <div style={styles.optionsContainer}>
            {quizData[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                style={{
                  ...styles.optionButton,
                  backgroundColor: selectedOption === option ? '#4CAF50' : '#ffffff',
                  color: selectedOption === option ? '#fff' : '#000',
                  border: selectedOption === option ? '2px solid #4CAF50' : '2px solid #ddd',
                }}
              >
                <strong>{optionLabels[index]}.</strong> {decodeHtmlEntities(option)}
              </button>
            ))}
          </div>
          <button
            onClick={handleNextQuestion}
            style={styles.nextButton}
            disabled={!selectedOption}
          >
            {currentQuestion === quizData.length - 1 ? 'Submit Quiz' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: '600px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    border: '2px solid #ddd',
    borderRadius: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  quizBox: {
    padding: '10px',
  },
  question: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  optionsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  optionButton: {
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    transition: 'background-color 0.3s ease, color 0.3s ease, border 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
  },
  nextButton: {
    marginTop: '20px',
    padding: '12px 18px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  result: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
};

export default AptitudeTest;
