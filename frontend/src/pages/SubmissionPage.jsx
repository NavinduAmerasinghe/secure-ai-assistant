import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPasteSubmission, uploadSubmissionFile } from "../services/submissionService";

const LANGUAGES = [
  { value: "python",     label: "Python",     icon: "🐍" },
  { value: "javascript", label: "JavaScript",  icon: "🟨" },
  { value: "typescript", label: "TypeScript",  icon: "🔷" },
  { value: "java",       label: "Java",        icon: "☕" },
  { value: "text",       label: "Plain Text",  icon: "📄" },
];

const SubmissionPage = () => {
  const navigate = useNavigate();

  const [pasteContent, setPasteContent]   = useState("");
  const [pasteLanguage, setPasteLanguage] = useState("python");
  const [file, setFile]                   = useState(null);
  const [fileLanguage, setFileLanguage]   = useState("python");
  const [message, setMessage]             = useState("");
  const [error, setError]                 = useState("");
  const [activeTab, setActiveTab]         = useState("paste"); // "paste" | "file"
  const [dragging, setDragging]           = useState(false);

  const handlePasteSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");
    try {
      await createPasteSubmission({ content: pasteContent, language: pasteLanguage });
      setMessage("Paste submitted successfully — redirecting…");
      setPasteContent("");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to submit code");
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");
    if (!file) { setError("Please select a file"); return; }
    try {
      await uploadSubmissionFile(file, fileLanguage);
      setMessage("File uploaded successfully — redirecting…");
      setFile(null);
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to upload file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sub-page {
          min-height: 100vh;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          padding: 2.5rem 1.5rem;
        }

        .sub-inner {
          max-width: 820px;
          margin: 0 auto;
          animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Page header ── */
        .sub-header { margin-bottom: 2rem; }

        .sub-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 1rem;
        }

        .sub-breadcrumb-sep { opacity: 0.3; }
        .sub-breadcrumb-cur { color: rgba(255,255,255,0.5); }

        .sub-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.4rem, 3vw, 1.9rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 0.4rem;
        }

        .sub-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.35);
          font-weight: 300;
        }

        /* ── Tab switcher ── */
        .tab-bar {
          display: inline-flex;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 4px;
          gap: 4px;
          margin-bottom: 1.75rem;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 7px;
          border: none;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
        }

        .tab-btn:hover { color: rgba(255,255,255,0.7); }

        .tab-btn.active {
          background: rgba(99,74,242,0.18);
          color: #c4b8fd;
        }

        /* ── Card ── */
        .sub-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 1.75rem;
        }

        /* ── Field ── */
        .field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.25rem; }

        .field-label {
          font-size: 12.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ── Select ── */
        .lang-select-wrap { position: relative; display: inline-block; }

        .lang-select {
          appearance: none;
          -webkit-appearance: none;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px;
          padding: 10px 36px 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.75);
          cursor: pointer;
          outline: none;
          min-width: 160px;
          transition: border-color 0.2s, background 0.2s;
        }

        .lang-select:focus {
          border-color: rgba(99,74,242,0.6);
          background: rgba(99,74,242,0.06);
          box-shadow: 0 0 0 3px rgba(99,74,242,0.1);
        }

        .lang-select option { background: #1a1825; }

        .select-chevron {
          position: absolute;
          right: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.25);
          pointer-events: none;
        }

        /* ── Textarea ── */
        .code-area {
          width: 100%;
          min-height: 280px;
          resize: vertical;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 1rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.7;
          color: rgba(255,255,255,0.8);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          tab-size: 2;
        }

        .code-area::placeholder { color: rgba(255,255,255,0.15); }

        .code-area:focus {
          border-color: rgba(99,74,242,0.5);
          box-shadow: 0 0 0 3px rgba(99,74,242,0.08);
        }

        /* ── Drop zone ── */
        .drop-zone {
          border: 2px dashed rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          text-align: center;
          position: relative;
        }

        .drop-zone.dragging {
          border-color: rgba(99,74,242,0.5);
          background: rgba(99,74,242,0.06);
        }

        .drop-zone.has-file {
          border-color: rgba(99,74,242,0.35);
          background: rgba(99,74,242,0.04);
        }

        .drop-zone-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(99,74,242,0.1);
          border: 1px solid rgba(99,74,242,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b78f7;
        }

        .drop-zone-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
        }

        .drop-zone-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.25);
        }

        .drop-zone-browse {
          color: #8b78f7;
          font-weight: 500;
        }

        .file-chosen {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: rgba(99,74,242,0.08);
          border: 1px solid rgba(99,74,242,0.2);
          border-radius: 8px;
          font-size: 13.5px;
          color: rgba(255,255,255,0.7);
          margin-top: 4px;
          width: 100%;
          max-width: 400px;
        }

        .file-chosen-name {
          font-weight: 500;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .file-chosen-size {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          flex-shrink: 0;
        }

        .file-remove {
          background: none;
          border: none;
          color: rgba(255,255,255,0.25);
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
          flex-shrink: 0;
        }
        .file-remove:hover { color: #f87171; }

        .hidden-input { display: none; }

        /* ── Submit button ── */
        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #634af2, #7c5ef5);
          border: none;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 14.5px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.2s, filter 0.2s;
          margin-top: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(255,255,255,0.08), transparent);
          pointer-events: none;
        }

        .submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(99,74,242,0.38);
          filter: brightness(1.05);
        }

        .submit-btn:active { transform: translateY(0); }

        /* ── Toast messages ── */
        .toast {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13.5px;
          margin-top: 1.25rem;
          animation: fadeUp 0.3s ease both;
        }

        .toast-success {
          background: rgba(52,211,153,0.08);
          border: 1px solid rgba(52,211,153,0.2);
          color: #6ee7b7;
        }

        .toast-error {
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          color: #f87171;
          animation: shake 0.35s cubic-bezier(.36,.07,.19,.97) both;
        }

        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(3px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }

        /* ── Char counter ── */
        .code-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 6px;
        }

        .char-count {
          font-size: 11.5px;
          color: rgba(255,255,255,0.2);
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      <div className="sub-page">
        <div className="sub-inner">

          {/* Header */}
          <div className="sub-header">
            <div className="sub-breadcrumb">
              <span>Dashboard</span>
              <span className="sub-breadcrumb-sep">/</span>
              <span className="sub-breadcrumb-cur">New Submission</span>
            </div>
            <h1 className="sub-title">New Submission</h1>
            <p className="sub-subtitle">Paste code directly or upload a file for security scanning</p>
          </div>

          {/* Tab bar */}
          <div className="tab-bar">
            <button
              className={`tab-btn ${activeTab === "paste" ? "active" : ""}`}
              onClick={() => { setActiveTab("paste"); setMessage(""); setError(""); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
              </svg>
              Paste Code
            </button>
            <button
              className={`tab-btn ${activeTab === "file" ? "active" : ""}`}
              onClick={() => { setActiveTab("file"); setMessage(""); setError(""); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload File
            </button>
          </div>

          {/* ── Paste tab ── */}
          {activeTab === "paste" && (
            <div className="sub-card">
              <form onSubmit={handlePasteSubmit}>
                <div className="field">
                  <label className="field-label">Language</label>
                  <div className="lang-select-wrap">
                    <select
                      className="lang-select"
                      value={pasteLanguage}
                      onChange={(e) => setPasteLanguage(e.target.value)}
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.value} value={l.value}>{l.icon}  {l.label}</option>
                      ))}
                    </select>
                    <span className="select-chevron">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">Code</label>
                  <textarea
                    className="code-area"
                    value={pasteContent}
                    onChange={(e) => setPasteContent(e.target.value)}
                    placeholder={`# Paste your ${pasteLanguage} code here…`}
                    required
                    spellCheck={false}
                  />
                  <div className="code-footer">
                    <span className="char-count">{pasteContent.length} chars</span>
                  </div>
                </div>

                <button type="submit" className="submit-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Submit for Scanning
                </button>
              </form>
            </div>
          )}

          {/* ── File tab ── */}
          {activeTab === "file" && (
            <div className="sub-card">
              <form onSubmit={handleFileSubmit}>
                <div className="field">
                  <label className="field-label">Language</label>
                  <div className="lang-select-wrap">
                    <select
                      className="lang-select"
                      value={fileLanguage}
                      onChange={(e) => setFileLanguage(e.target.value)}
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.value} value={l.value}>{l.icon}  {l.label}</option>
                      ))}
                    </select>
                    <span className="select-chevron">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">File</label>
                  <input
                    id="file-input"
                    className="hidden-input"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <label
                    htmlFor="file-input"
                    className={`drop-zone ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                  >
                    <div className="drop-zone-icon">
                      {file ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                      )}
                    </div>
                    {file ? (
                      <>
                        <p className="drop-zone-title">File selected</p>
                        <p className="drop-zone-sub">Click to change</p>
                      </>
                    ) : (
                      <>
                        <p className="drop-zone-title">Drop your file here</p>
                        <p className="drop-zone-sub">or <span className="drop-zone-browse">browse</span> to choose a file</p>
                      </>
                    )}
                  </label>

                  {file && (
                    <div className="file-chosen">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b78f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span className="file-chosen-name">{file.name}</span>
                      <span className="file-chosen-size">{(file.size / 1024).toFixed(1)} KB</span>
                      <button
                        type="button"
                        className="file-remove"
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        title="Remove file"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <button type="submit" className="submit-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Upload & Scan
                </button>
              </form>
            </div>
          )}

          {/* Feedback toasts */}
          {message && (
            <div className="toast toast-success">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {message}
            </div>
          )}
          {error && (
            <div className="toast toast-error">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default SubmissionPage;