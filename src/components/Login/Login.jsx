// filepath: c:\Users\STARK\OneDrive\Desktop\PSQUARE Test\Hr_Dashboard_Frontend\src\components\Login\Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import dashboardImage from "../../assets/dashboard.png";
import './Login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('https://hr-dashboard-backend-vishal.vercel.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });
      if (!res.ok) throw new Error('Login failed');
      setSuccess('Login successful!');
      navigate('/candidate');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="top-logo">
        <span className="logo-icon">🔲</span>
        <span className="logo-text">LOGO</span>
      </div>
      <div className="app-container">
        <div className="left-panel">
          <img src={dashboardImage} alt="Dashboard Preview" className="dashboard-image" />
          <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</h2>
          <p>
            Tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <div className="dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
        <div className="right-panel">
          <div className="form-box">
            <h2>Welcome to Dashboard</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Email Address<span>*</span>
                <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} />
              </label>
              <label className="password-label">
                Password<span>*</span>
                <div className="input-icon-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <span
                    className="icon-eye"
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{ cursor: 'pointer' }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg width="22" height="22" fill="#4b007d" viewBox="0 0 24 24"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z" /></svg>
                    ) : (
                      <svg width="22" height="22" fill="#4b007d" viewBox="0 0 24 24"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7c2.389 0 4.418-.522 6.126-1.393l-1.414-1.414c-1.263.563-2.684.807-4.712.807-5.523 0-8.485-4.477-8.485-4.477s2.962-4.477 8.485-4.477c2.028 0 3.449.244 4.712.807l1.414-1.414c-1.708-.871-3.737-1.393-6.126-1.393zm0 12c-2.761 0-5-2.239-5-5 0-.828.168-1.613.471-2.324l1.414 1.414c-.195.393-.305.832-.305 1.324 0 1.657 1.343 3 3 3 .492 0 .931-.11 1.324-.305l1.414 1.414c-.711.303-1.496.471-2.324.471zm7.293-2.707l-1.414-1.414c.195-.393.305-.832.305-1.324 0-1.657-1.343-3-3-3-.492 0-.931.11-1.324.305l-1.414-1.414c.711-.303 1.496-.471 2.324-.471 2.761 0 5 2.239 5 5 0 .828-.168 1.613-.471 2.324z" /></svg>
                    )}
                  </span>
                </div>
              </label>
              <div className="forgot-link" style={{ marginBottom: "10px", fontSize: "13px", color: "#aaa" }}>
                Forgot password?
              </div>
              {error && <div style={{ color: 'red', fontSize: 13 }}>{error}</div>}
              {success && <div style={{ color: 'green', fontSize: 13 }}>{success}</div>}
              <button type="submit" className="login-button"> 
                Login
              </button>
            </form>
            <div className="login-link">
              Don’t have an account? <Link to="/">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;