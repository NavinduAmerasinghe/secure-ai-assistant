import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .reg-root {
          min-height: 100vh;
          display: flex;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        .reg-root::before {
          content: '';
          position: fixed;
          top: -20%;
          right: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          animation: floatBlob 13s ease-in-out infinite alternate;
        }

        .reg-root::after {
          content: '';
          position: fixed;
          bottom: -10%;
          left: -10%;
          width: 520px;
          height: 520px;
          background: radial-gradient(circle, rgba(99, 74, 242, 0.13) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          animation: floatBlob 16s ease-in-out infinite alternate-reverse;
        }

        @keyframes floatBlob {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(40px, 30px) scale(1.08); }
        }

        /* Left form panel */
        .reg-panel-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          min-height: 100vh;
          padding: 2rem;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 900px) {
          .reg-panel-left {
            width: 480px;
            flex: 0 0 480px;
            padding: 2rem 3rem;
            border-right: 1px solid rgba(255,255,255,0.06);
          }
        }

        /* Right decorative panel */
        .reg-panel-right {
          display: none;
          flex: 1;
          min-height: 100vh;
          position: relative;
          z-index: 1;
          align-items: center;
          justify-content: center;
          padding: 3rem 4rem;
        }

        @media (min-width: 900px) {
          .reg-panel-right { display: flex; }
        }

        .grid-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* Decorative card stack on the right */
        .deco-wrap {
          max-width: 400px;
          width: 100%;
        }

        .deco-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 2rem;
        }

        .deco-tag-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ec4899;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }

        .deco-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 3vw, 3rem);
          font-weight: 800;
          line-height: 1.1;
          color: #fff;
          margin-bottom: 1.5rem;
        }

        .deco-headline em {
          font-style: normal;
          background: linear-gradient(135deg, #ec4899, #634af2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .deco-body {
          font-size: 15px;
          line-height: 1.7;
          color: rgba(255,255,255,0.4);
          font-weight: 300;
          margin-bottom: 2.5rem;
        }

        .deco-perks {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .perk {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: rgba(255,255,255,0.5);
        }

        .perk-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(99, 74, 242, 0.12);
          border: 1px solid rgba(99, 74, 242, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #8b78f7;
        }

        /* Form card */
        .form-card {
          width: 100%;
          max-width: 420px;
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .form-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 2.5rem;
        }

        .form-logo-mark {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #634af2, #9b59f5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
        }

        .form-logo-name {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .form-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .form-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 2.5rem;
          font-weight: 300;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field-label {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.02em;
        }

        .field-input-wrap {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.2);
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .field-input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }

        .field-input::placeholder {
          color: rgba(255,255,255,0.18);
        }

        .field-input:focus {
          border-color: rgba(99, 74, 242, 0.7);
          background: rgba(99, 74, 242, 0.06);
          box-shadow: 0 0 0 3px rgba(99, 74, 242, 0.12);
        }

        .field-input:-webkit-autofill,
        .field-input:-webkit-autofill:hover,
        .field-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #12111a inset;
          -webkit-text-fill-color: #fff;
          caret-color: #fff;
        }

        .error-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 14px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          font-size: 13px;
          color: #f87171;
          margin-bottom: 1.5rem;
          animation: shake 0.35s cubic-bezier(.36,.07,.19,.97) both;
        }

        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(3px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #634af2 0%, #7c5ef5 100%);
          border: none;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: transform 0.15s, box-shadow 0.2s, filter 0.2s;
          position: relative;
          overflow: hidden;
        }

        .submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(255,255,255,0.1), transparent);
          pointer-events: none;
        }

        .submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(99, 74, 242, 0.4);
          filter: brightness(1.05);
        }

        .submit-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(99, 74, 242, 0.3);
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 1.75rem 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }

        .divider-text {
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.05em;
        }

        .login-link {
          text-align: center;
          font-size: 14px;
          color: rgba(255,255,255,0.35);
        }

        .login-link a {
          color: #8b78f7;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .login-link a:hover {
          color: #a899fa;
        }

        .footer-note {
          margin-top: 3rem;
          font-size: 12px;
          color: rgba(255,255,255,0.15);
          text-align: center;
        }
      `}</style>

      <div className="reg-root">

        {/* Left form panel */}
        <div className="reg-panel-left">
          <div className="form-card">

            <div className="custom-logo" style={{textAlign: 'center', marginBottom: '2.5rem'}}>
              <h1 style={{
                fontFamily: 'Merriweather, serif',
                fontWeight: 400,
                fontSize: '1.5rem',
                color: '#3d3937',
                margin: 0,
                letterSpacing: '0.01em',
                fontStyle: 'italic',
              }}>Secure AI Assistant</h1>
              <div style={{
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 400,
                fontSize: '0.85rem',
                color: '#5c5753',
                marginTop: '0.3rem',
                letterSpacing: '0.13em',
              }}>Analyze. Secure. Code Smarter</div>
            </div>

            <h2 className="form-title">Create account</h2>
            <p className="form-subtitle">Get started — it only takes a minute</p>

            <form onSubmit={handleSubmit}>
              <div className="field-group">

                <div className="field">
                  <label className="field-label">Email address</label>
                  <div className="field-input-wrap">
                    <span className="field-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                    </span>
                    <input
                      className="field-input"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">Username</label>
                  <div className="field-input-wrap">
                    <span className="field-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                    </span>
                    <input
                      className="field-input"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="username"
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">Password</label>
                  <div className="field-input-wrap">
                    <span className="field-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                    <input
                      className="field-input"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

              </div>

              {error && (
                <div className="error-box">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" className="submit-btn">
                Create account →
              </button>
            </form>

            <div className="divider">
              <span className="divider-line" />
              <span className="divider-text">or</span>
              <span className="divider-line" />
            </div>

            <p className="login-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>

            <p className="footer-note">Protected by enterprise-grade security</p>
          </div>
        </div>

        {/* Right decorative panel */}
        <div className="reg-panel-right">
          <div className="grid-lines" />
          <div className="deco-wrap">
            <div className="deco-tag">
              <span className="deco-tag-dot" />
              START SECURING YOUR CODE
            </div>
            <h2 className="deco-headline">
              Everything you<br />need for <em>secure code<br />review</em>
            </h2>
            <p className="deco-body">
             Create your account to upload code, detect vulnerabilities, and receive grounded AI explanations with safer remediation guidance.
            </p>
            <div className="deco-perks">
              <div className="perk">
                <span className="perk-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </span>
                Scan code for common security issues and risky patterns
              </div>
              <div className="perk">
                <span className="perk-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </span>
                Upload files or paste code for secure analysis
              </div>
              <div className="perk">
                <span className="perk-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </span>
                Get AI-powered explanations and safer fixes
              </div>
              <div className="perk">
                <span className="perk-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </span>
               Track submissions, scans, and results in one place
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default RegisterPage;