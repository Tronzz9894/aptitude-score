import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      alert('Both email and password are required!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.text();

      if (response.ok) {
        localStorage.setItem('authToken', result);
        alert('Login Successful!');
        navigate('/dashboard');
      } else {
        setErrorMessage(result);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error occurred while logging in!');
    }
  };

  const handleSignupNavigate = () => {
    navigate('/signup');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitButton}>Login</button>
      </form>

      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}

      <div style={styles.signupLink}>
        <p>Don't have an account? <button onClick={handleSignupNavigate} style={styles.signupButton}>Sign Up</button></p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: '14px',
    marginBottom: '5px',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
  },
  submitButton: {
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  errorMessage: {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px',
  },
  signupLink: {
    marginTop: '20px',
  },
  signupButton: {
    background: 'none',
    border: 'none',
    color: '#007BFF',
    cursor: 'pointer',
  },
  '@media (max-width: 768px)': {
    container: {
      padding: '15px',
    },
    heading: {
      fontSize: '20px',
    },
    input: {
      fontSize: '12px',
    },
    submitButton: {
      fontSize: '14px',
    },
  },
  '@media (max-width: 480px)': {
    container: {
      padding: '10px',
    },
    heading: {
      fontSize: '18px',
    },
    input: {
      fontSize: '11px',
    },
    submitButton: {
      fontSize: '12px',
    },
  },
};

export default Login;
