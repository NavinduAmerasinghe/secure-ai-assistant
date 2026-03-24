import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMySubmissions } from "../services/submissionService";
import { getScansForSubmission, runScan } from "../services/scanService";

const LANG_ICONS = {
  python: "🐍", javascript: "🟨", typescript: "🔷", java: "☕", text: "📄",
};

const statusMeta = {
  completed: { color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)" },
  running:   { color: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.2)" },
  failed:    { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)" },
  pending:   { color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)" },
};

const StatusDot = ({ status }) => {
  const s = statusMeta[(status || "").toLowerCase()] || statusMeta.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px", borderRadius: 999,
      fontSize: 11.5, fontWeight: 500, letterSpacing: "0.04em",
      textTransform: "capitalize",
      color: s.color, background: s.bg, border: `1px solid ${s.border}`,
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: "50%", background: s.color,
        boxShadow: status?.toLowerCase() === "running" ? `0 0 0 2px ${s.border}` : "none",
        animation: status?.toLowerCase() === "running" ? "statusPulse 1.5s ease infinite" : "none",
      }} />
      {status || "pending"}
    </span>
  );
};

const DashboardPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [scanMap, setScanMap]         = useState({});
  const [loading, setLoading]         = useState(true);
  const [scanning, setScanning]       = useState({});
  const [scanError, setScanError]     = useState({});
  const [expanded, setExpanded]       = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const submissionData = await getMySubmissions();
      setSubmissions(submissionData);
      const scansBySubmission = {};
      for (const submission of submissionData) {
        const scans = await getScansForSubmission(submission.id);
        scansBySubmission[submission.id] = scans;
      }
      setScanMap(scansBySubmission);
      // Auto-expand all by default
      const exp = {};
      submissionData.forEach((s) => { exp[s.id] = true; });
      setExpanded(exp);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunScan = async (submissionId) => {
    setScanning((p) => ({ ...p, [submissionId]: true }));
    setScanError((p) => ({ ...p, [submissionId]: "" }));
    try {
      await runScan(submissionId);
      await loadData();
    } catch (error) {
      setScanError((p) => ({
        ...p,
        [submissionId]: error?.response?.data?.detail || "Scan failed",
      }));
    } finally {
      setScanning((p) => ({ ...p, [submissionId]: false }));
    }
  };

  const toggleExpand = (id) =>
    setExpanded((p) => ({ ...p, [id]: !p[id] }));

  useEffect(() => { loadData(); }, []);

  const totalScans = Object.values(scanMap).reduce((a, s) => a + (s?.length || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .db-page {
          min-height: 100vh;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          padding: 2.5rem 1.5rem;
        }

        .db-inner {
          max-width: 900px;
          margin: 0 auto;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes statusPulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Header ── */
        .db-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .db-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.4rem, 3vw, 1.9rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 0.3rem;
        }

        .db-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.35);
          font-weight: 300;
        }

        .new-sub-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          background: linear-gradient(135deg, #634af2, #7c5ef5);
          border-radius: 9px;
          font-family: 'Syne', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          color: #fff;
          text-decoration: none;
          transition: transform 0.15s, box-shadow 0.2s, filter 0.15s;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .new-sub-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(255,255,255,0.08), transparent);
          pointer-events: none;
        }

        .new-sub-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(99,74,242,0.38);
          filter: brightness(1.05);
        }

        /* ── Stat row ── */
        .db-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 1rem 1.25rem;
        }

        .stat-card-label {
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.28);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .stat-card-value {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        /* ── Loading / empty ── */
        .db-state {
          min-height: 50vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          text-align: center;
        }

        .db-state-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: rgba(99,74,242,0.1);
          border: 1px solid rgba(99,74,242,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b78f7;
        }

        .db-state-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: rgba(255,255,255,0.65);
        }

        .db-state-sub { font-size: 13.5px; color: rgba(255,255,255,0.28); }

        .spinner {
          width: 24px; height: 24px;
          border: 2.5px solid rgba(99,74,242,0.2);
          border-top-color: #8b78f7;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* ── Submission cards ── */
        .sub-list { display: flex; flex-direction: column; gap: 12px; }

        .sub-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .sub-card:hover { border-color: rgba(255,255,255,0.12); }

        /* Card header row */
        .sub-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 1rem 1.25rem;
          cursor: pointer;
          user-select: none;
        }

        .sub-type-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(99,74,242,0.1);
          border: 1px solid rgba(99,74,242,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          flex-shrink: 0;
        }

        .sub-card-meta { flex: 1; min-width: 0; }

        .sub-card-name {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 3px;
        }

        .sub-card-tags {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 5px;
          font-size: 11.5px;
          color: rgba(255,255,255,0.4);
          text-transform: capitalize;
        }

        .sub-card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .run-scan-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 13px;
          background: rgba(99,74,242,0.12);
          border: 1px solid rgba(99,74,242,0.25);
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          color: #a899fa;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
          white-space: nowrap;
        }

        .run-scan-btn:hover:not(:disabled) {
          background: rgba(99,74,242,0.22);
          border-color: rgba(99,74,242,0.4);
          color: #c4b8fd;
        }

        .run-scan-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .chevron {
          color: rgba(255,255,255,0.2);
          transition: transform 0.2s;
          flex-shrink: 0;
        }

        .chevron.open { transform: rotate(180deg); }

        /* Card body */
        .sub-card-body {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 1rem 1.25rem;
        }

        .scan-error {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 12px;
          background: rgba(248,113,113,0.07);
          border: 1px solid rgba(248,113,113,0.18);
          border-radius: 7px;
          font-size: 12.5px;
          color: #f87171;
          margin-bottom: 10px;
        }

        .scans-label {
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .scan-list { display: flex; flex-direction: column; gap: 6px; }

        .scan-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.15s, border-color 0.15s;
        }

        .scan-item:hover {
          background: rgba(99,74,242,0.07);
          border-color: rgba(99,74,242,0.2);
        }

        .scan-item-id {
          font-family: 'Syne', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          color: #8b78f7;
          flex-shrink: 0;
        }

        .scan-item-summary {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .scan-item-arrow {
          color: rgba(255,255,255,0.15);
          flex-shrink: 0;
        }

        .no-scans {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: rgba(255,255,255,0.2);
          padding: 4px 0;
        }
      `}</style>

      <div className="db-page">
        <div className="db-inner">

          {/* Header */}
          <div className="db-header">
            <div>
              <h1 className="db-title">Dashboard</h1>
              <p className="db-subtitle">Manage your submissions and security scans</p>
            </div>
            <Link to="/submit" className="new-sub-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Submission
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="db-state">
              <div className="db-state-icon"><div className="spinner" /></div>
              <p className="db-state-title">Loading your dashboard…</p>
              <p className="db-state-sub">Fetching submissions and scan history</p>
            </div>
          )}

          {/* Loaded */}
          {!loading && (
            <>
              {/* Stats */}
              <div className="db-stats">
                <div className="stat-card">
                  <p className="stat-card-label">Submissions</p>
                  <p className="stat-card-value">{submissions.length}</p>
                </div>
                <div className="stat-card">
                  <p className="stat-card-label">Total Scans</p>
                  <p className="stat-card-value">{totalScans}</p>
                </div>
                <div className="stat-card">
                  <p className="stat-card-label">Completed</p>
                  <p className="stat-card-value">
                    {Object.values(scanMap).flat().filter(s => s?.status?.toLowerCase() === "completed").length}
                  </p>
                </div>
                <div className="stat-card">
                  <p className="stat-card-label">Failed</p>
                  <p className="stat-card-value" style={{ color: submissions.length > 0 ? "#f87171" : "inherit" }}>
                    {Object.values(scanMap).flat().filter(s => s?.status?.toLowerCase() === "failed").length}
                  </p>
                </div>
              </div>

              {/* Empty */}
              {submissions.length === 0 ? (
                <div className="db-state">
                  <div className="db-state-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                    </svg>
                  </div>
                  <p className="db-state-title">No submissions yet</p>
                  <p className="db-state-sub">Create your first submission to get started</p>
                </div>
              ) : (
                <div className="sub-list">
                  {submissions.map((submission, i) => {
                    const scans = scanMap[submission.id] || [];
                    const isOpen = expanded[submission.id];
                    const isScanning = scanning[submission.id];
                    const err = scanError[submission.id];
                    const langIcon = LANG_ICONS[submission.language] || "📄";

                    return (
                      <div
                        className="sub-card"
                        key={submission.id}
                        style={{ animationDelay: `${i * 0.05}s`, animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}
                      >
                        {/* Header row */}
                        <div className="sub-card-header" onClick={() => toggleExpand(submission.id)}>
                          <div className="sub-type-icon">{langIcon}</div>

                          <div className="sub-card-meta">
                            <p className="sub-card-name">
                              {submission.original_filename || "Pasted content"}
                            </p>
                            <div className="sub-card-tags">
                              <span className="tag">#{submission.id}</span>
                              <span className="tag">{submission.input_type}</span>
                              {submission.language && (
                                <span className="tag">{submission.language}</span>
                              )}
                              {scans.length > 0 && (
                                <StatusDot status={scans[scans.length - 1]?.status} />
                              )}
                            </div>
                          </div>

                          <div className="sub-card-actions" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="run-scan-btn"
                              onClick={() => handleRunScan(submission.id)}
                              disabled={isScanning}
                            >
                              {isScanning ? (
                                <>
                                  <div style={{ width: 11, height: 11, border: "2px solid rgba(168,153,250,0.3)", borderTopColor: "#a899fa", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                                  Scanning…
                                </>
                              ) : (
                                <>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="5 3 19 12 5 21 5 3"/>
                                  </svg>
                                  Run Scan
                                </>
                              )}
                            </button>
                          </div>

                          <svg className={`chevron ${isOpen ? "open" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        </div>

                        {/* Expandable body */}
                        {isOpen && (
                          <div className="sub-card-body">
                            {err && (
                              <div className="scan-error">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                                {err}
                              </div>
                            )}

                            <p className="scans-label">Scan history · {scans.length}</p>

                            {scans.length > 0 ? (
                              <div className="scan-list">
                                {scans.map((scan) => (
                                  <Link key={scan.id} to={`/scan/${scan.id}`} className="scan-item">
                                    <span className="scan-item-id">#{scan.id}</span>
                                    <StatusDot status={scan.status} />
                                    <span className="scan-item-summary">{scan.summary || "No summary available"}</span>
                                    <svg className="scan-item-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="9 18 15 12 9 6"/>
                                    </svg>
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <div className="no-scans">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                                No scans yet — hit Run Scan to start
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default DashboardPage;