// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState(''); // Changed from username to email
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (event) => {
    event.preventDefault();

    // Check if both fields are filled
    if (!email || !password) { // Check for email instead of username
      alert('Both email and password are required!');
      return;
    }

    // Send POST request to the backend login route
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Changed to email
      });

      const result = await response.text(); // Expecting a plain text response from the server

      if (response.ok) {
        // On success, store the token in localStorage and navigate to dashboard
        localStorage.setItem('authToken', result); // Assuming the result is a JWT token
        alert('Login Successful!');
        navigate('/dashboard'); // Redirect to the dashboard after successful login
      } else {
        setErrorMessage(result); // Display error message if login fails
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error occurred while logging in!');
    }
  };

  // Navigate to the signup page
  const handleSignupNavigate = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label> {/* Changed from Username to Email */}
          <input
            type="email" // Updated type to "email" for proper email validation
            placeholder="Enter your email"
            value={email} // Changed to email
            onChange={(e) => setEmail(e.target.value)} // Updated to setEmail
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {/* Error Message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Button to navigate to the signup page */}
      <div className="signup-link">
        <p>Don't have an account? <button onClick={handleSignupNavigate}>Sign Up</button></p>
      </div>
    </div>
  );
}

export default Login;
