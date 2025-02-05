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
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h1 style={styles.title}>Aptitude Test</h1>
        {quizData.length === 0 ? (
          <p style={styles.loading}>Loading quiz...</p>
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
                    ...(selectedOption === option ? styles.optionButtonSelected : {}),
                  }}
                >
                  <strong style={styles.optionLabel}>{optionLabels[index]}.</strong> {decodeHtmlEntities(option)}
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
    </div>
  );
}

// **Updated Full-Screen Styles with Fixed Colors**
const styles = {
  pageContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fd', // Light blue background
  },
  container: {
    width: '90%',
    maxWidth: '800px',
    height: '85vh',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e3a8a', // Deep blue
    marginBottom: '20px',
  },
  loading: {
    fontSize: '18px',
    color: '#666',
  },
  quizBox: {
    width: '100%',
  },
  question: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#222',
    marginBottom: '20px',
  },
  optionsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    width: '100%',
  },
  optionButton: {
    padding: '15px',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    fontSize: '16px',
    fontWeight: '500',
    border: '2px solid #1e88e5', // Blue border
    backgroundColor: '#fff',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#000', // Ensuring visible text color
  },
  optionButtonSelected: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: '2px solid #4CAF50',
  },
  optionLabel: {
    color: '#1e3a8a', // Dark blue for option letters A, B, C, D
    fontWeight: 'bold',
  },
  nextButton: {
    marginTop: '20px',
    padding: '15px 25px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  result: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#222',
  },
};

export default AptitudeTest;
