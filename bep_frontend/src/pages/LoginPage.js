import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the backend
      const response = await axios.post('http://localhost:5001/api/auth/login', { email, password });

      localStorage.setItem('token', response.data.token);

      if (typeof setToken === 'function') {
        setToken(response.data.token);
      } else {
        console.error('setToken is not a function');
      }

      // Redirect to the home page
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(
        error.response?.data?.message || 'Login failed. Please check your credentials and try again.'
      );
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      {/* Display error messages */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <p>Don't have an account?</p>
      <button onClick={handleRegisterRedirect}>Register</button>
    </div>
  );
};

export default LoginPage;
