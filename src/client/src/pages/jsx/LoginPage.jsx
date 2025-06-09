// File: src/client/src/pages/jsx/LoginPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import gmailImg from '../../assets/gmailLogo.png';
import '../../styles/auth.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // TODO: Add validation for all fields\
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const email = username.includes('@') ? username : `${username}@gmail.com`;

    try {
      const loginRes = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (loginRes.ok) {
        const data = await loginRes.json();
        login(data.token, username);
        navigate('/inbox');
      } else {
        const err = await loginRes.json();
        setError(err.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <img src={gmailImg} alt="Gmail" className="auth-logo" />
        <div className="auth-title">Sign in</div>
        <form className="auth-form" onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-btn" type="submit">Login</button>
        </form>
        <div className="auth-link">
          Don't have an account? <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  );
}
