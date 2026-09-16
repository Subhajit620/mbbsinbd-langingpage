import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { username, password });
      if (response.data.status === 'success') {
        localStorage.setItem('adminToken', response.data.data.token);
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#ffffff', color: '#1f2937', overflowX: 'hidden' }}>
      <style>{`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Outfit', sans-serif;
        }
        .login-container {
            display: flex;
            width: 100%;
            min-height: 100vh;
        }
        .login-brand-panel {
            flex: 1.1;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px;
            position: relative;
        }
        .illustration-container {
            width: 100%;
            max-width: 480px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .svg-float-1 {
            animation: svg-drift-1 5s ease-in-out infinite alternate;
        }
        .svg-float-2 {
            animation: svg-drift-2 6s ease-in-out infinite alternate;
        }
        @keyframes svg-drift-1 {
            0% { transform: translateY(0); }
            100% { transform: translateY(-8px); }
        }
        @keyframes svg-drift-2 {
            0% { transform: translateY(0); }
            100% { transform: translateY(-10px); }
        }
        .login-form-panel {
            flex: 0.9;
            background: linear-gradient(135deg, #60a5fa 0%, #2563eb 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 48px;
            position: relative;
            overflow: hidden;
        }
        .decor-circles {
            position: absolute;
            bottom: -100px;
            right: -100px;
            width: 350px;
            height: 350px;
            pointer-events: none;
            z-index: 1;
            opacity: 0.15;
            animation: spin-decor 40s linear infinite;
            transform-origin: bottom right;
        }
        @keyframes spin-decor {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .decor-circles svg {
            width: 100%;
            height: 100%;
        }
        .login-card {
            width: 100%;
            max-width: 400px;
            background: #ffffff;
            border-radius: 28px;
            padding: 48px 40px;
            box-shadow: 0 25px 60px rgba(15, 23, 42, 0.15);
            z-index: 10;
            animation: card-pop 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            border: 1px solid rgba(255, 255, 255, 0.8);
        }
        @keyframes card-pop {
            from { opacity: 0; transform: scale(0.96) translateY(15px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .login-card h1 {
            font-size: clamp(28px, 4.5vw, 34px);
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 6px;
            letter-spacing: -0.5px;
        }
        .login-card p {
            font-size: 15px;
            color: #64748b;
            margin-bottom: 32px;
            font-weight: 500;
        }
        .input-group {
            position: relative;
            margin-bottom: 20px;
        }
        .input-group input {
            width: 100%;
            padding: 16px 20px 16px 54px;
            border: 1px solid #e2e8f0;
            border-radius: 999px;
            outline: none;
            background: #ffffff;
            color: #0f172a;
            font-size: 15px;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .input-group input::placeholder {
            color: #94a3b8;
        }
        .input-group input:focus {
            border-color: #60a5fa;
            box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.15);
        }
        .input-icon {
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            display: flex;
            align-items: center;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .input-group input:focus ~ .input-icon {
            color: #60a5fa;
            transform: translateY(-50%) scale(1.15);
        }
        .eye-toggle {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #94a3b8;
            display: flex;
            align-items: center;
            transition: color 0.2s;
        }
        .eye-toggle:hover {
            color: #0f172a;
        }
        .submit-btn {
            width: 100%;
            padding: 16px;
            border: none;
            border-radius: 999px;
            background: #60a5fa;
            color: #ffffff;
            font-weight: 700;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            margin-top: 12px;
            box-shadow: 0 8px 20px rgba(96, 165, 250, 0.25);
            position: relative;
            overflow: hidden;
        }
        .submit-btn::after {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: all 0.6s ease;
        }
        .submit-btn:hover::after {
            left: 100%;
        }
        .submit-btn:hover {
            background: #3b82f6;
            transform: translateY(-1px);
            box-shadow: 0 12px 28px rgba(59, 130, 246, 0.35);
        }
        .submit-btn:active {
            transform: translateY(0);
        }
        .forgot-link {
            display: inline-block;
            margin-top: 24px;
            font-size: 13px;
            font-weight: 600;
            color: #94a3b8;
            text-decoration: none;
            transition: color 0.2s;
            width: 100%;
            text-align: center;
        }
        .forgot-link:hover {
            color: #3b82f6;
        }
        .loader-text {
            text-align: center;
            margin-top: 16px;
            font-size: 13px;
            color: #3b82f6;
            animation: pulse-loader 1.5s infinite;
        }
        @keyframes pulse-loader {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
        }
        .error-banner {
            margin-top: 16px;
            padding: 12px;
            border-radius: 12px;
            background: #fff5f5;
            border: 1px solid #fed7d7;
            color: #e53e3e;
            font-size: 13px;
            text-align: center;
            animation: shake 0.4s ease;
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-6px); }
            40%, 80% { transform: translateX(6px); }
        }
        @media (max-width: 900px) {
            .login-brand-panel { display: none; }
            .login-form-panel { flex: 1; width: 100%; }
        }
        @media (max-width: 480px) {
            .login-form-panel { padding: 24px 16px; }
            .login-card { padding: 32px 24px; border-radius: 20px; }
            .login-card h1 { font-size: 26px; }
            .login-card p { font-size: 14px; margin-bottom: 24px; }
            .decor-circles { display: none; }
        }
      `}</style>
      <div className="login-container">
        {/* LEFT PANEL (ILLUSTRATION) */}
        <div className="login-brand-panel">
          <div className="illustration-container">
            <svg viewBox="0 0 500 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="250" cy="350" rx="180" ry="12" fill="#f1f5f9" />
              <rect x="100" y="270" width="300" height="10" rx="5" fill="#cbd5e1" />
              <line x1="140" y1="280" x2="120" y2="350" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
              <line x1="360" y1="280" x2="380" y2="350" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
              <path d="M190 280 L170 350" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
              <rect x="160" y="240" width="50" height="40" rx="8" fill="#475569" />
              <rect x="150" y="170" width="12" height="80" rx="4" fill="#334155" />
              <rect x="145" y="150" width="55" height="45" rx="6" fill="#334155" />
              <path d="M195 270 Q240 270 240 340" stroke="#60a5fa" strokeWidth="16" strokeLinecap="round" fill="none" />
              <path d="M185 180 Q210 180 215 260" stroke="#1e293b" strokeWidth="24" strokeLinecap="round" fill="none" />
              <circle cx="180" cy="115" r="18" fill="#fbcfe8" />
              <path d="M180 133 L180 150" stroke="#fbcfe8" strokeWidth="6" strokeLinecap="round" />
              <path d="M165 110 Q180 90 195 110 Q190 120 170 120 Z" fill="#1e293b" />
              <path d="M210 190 Q250 195 270 215" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" fill="none" />
              <path d="M270 215 L285 212" stroke="#fbcfe8" strokeWidth="8" strokeLinecap="round" />
              <rect x="300" y="250" width="16" height="30" fill="#64748b" />
              <ellipse cx="308" cy="275" rx="20" ry="6" fill="#64748b" />
              <rect x="250" y="160" width="100" height="90" rx="8" fill="#475569" />
              <rect x="255" y="165" width="90" height="80" rx="4" fill="#e0f2fe" />
              <g className="svg-float-1">
                <rect x="310" y="80" width="110" height="70" rx="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                <rect x="320" y="95" width="90" height="8" rx="4" fill="#60a5fa" />
                <rect x="320" y="110" width="70" height="8" rx="4" fill="#cbd5e1" />
                <rect x="320" y="125" width="40" height="8" rx="4" fill="#34d399" />
              </g>
              <g className="svg-float-2">
                <rect x="80" y="80" width="90" height="60" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                <circle cx="110" cy="110" r="14" fill="#38bdf8" opacity="0.2" />
                <circle cx="110" cy="110" r="8" fill="#38bdf8" />
                <rect x="135" y="100" width="25" height="6" rx="3" fill="#cbd5e1" />
                <rect x="135" y="112" width="15" height="6" rx="3" fill="#cbd5e1" />
              </g>
              <rect x="365" y="240" width="22" height="30" rx="4" fill="#d97706" />
              <path d="M376 240 Q376 210 390 200" stroke="#10b981" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M376 240 Q366 215 355 210" stroke="#10b981" strokeWidth="8" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        </div>

        {/* RIGHT PANEL (BLUE BACKDROP & CARD) */}
        <div className="login-form-panel">
          <div className="decor-circles">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="50" fill="none" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="login-card">
            <h1>Hello!</h1>
            <p>Sign In to Get Started</p>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <span className="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </span>
              </div>

              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <span className="eye-toggle" onClick={() => setShowPassword(!showPassword)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </span>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                Login
              </button>
              {loading && <div className="loader-text">Verifying credentials...</div>}
            </form>

            {error && <div className="error-banner">{error}</div>}
            <Link to="/" className="forgot-link">
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
