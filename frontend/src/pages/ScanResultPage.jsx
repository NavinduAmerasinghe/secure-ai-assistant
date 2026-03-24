import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getScanResult } from "../services/scanService";
import VulnerabilityCard from "../components/VulnerabilityCard";

const ScanResultPage = () => {
  const { scanId } = useParams();
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScanResult = async () => {
      try {
        const data = await getScanResult(scanId);
        setScanResult(data);
      } catch (error) {
        console.error("Failed to load scan result", error);
      } finally {
        setLoading(false);
      }
    };

    loadScanResult();
  }, [scanId]);

  const getSeverityCounts = () => {
    if (!scanResult?.vulnerabilities?.length) return {};
    return scanResult.vulnerabilities.reduce((acc, v) => {
      const s = (v.severity || "unknown").toLowerCase();
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
  };

  const severityCounts = getSeverityCounts();

  const statusMeta = {
    completed: { color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)", icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    )},
    running: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    )},
    failed: { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)", icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    )},
  };

  const severityMeta = {
    critical: { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)" },
    high:     { color: "#fb923c", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.2)"  },
    medium:   { color: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.2)"  },
    low:      { color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)"  },
    unknown:  { color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)" },
  };

  const currentStatus = statusMeta[(scanResult?.status || "").toLowerCase()] || statusMeta.running;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sr-page {
          min-height: 100vh;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          padding: 2.5rem 1.5rem;
        }

        .sr-inner {
          max-width: 900px;
          margin: 0 auto;
          animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── State screens ── */
        .sr-state {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          text-align: center;
        }

        .sr-state-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: rgba(99,74,242,0.1);
          border: 1px solid rgba(99,74,242,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b78f7;
        }

        .sr-state-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
        }

        .sr-state-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.3);
        }

        /* Spinner */
        .spinner {
          width: 28px;
          height: 28px;
          border: 2.5px solid rgba(99,74,242,0.2);
          border-top-color: #8b78f7;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Header ── */
        .sr-header {
          margin-bottom: 2rem;
        }

        .sr-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 1.25rem;
        }

        .sr-breadcrumb-sep {
          opacity: 0.3;
        }

        .sr-breadcrumb-current {
          color: rgba(255,255,255,0.5);
        }

        .sr-title-row {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .sr-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.4rem, 3vw, 1.9rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #fff;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.02em;
          text-transform: capitalize;
          border: 1px solid;
          flex-shrink: 0;
        }

        /* ── Meta cards row ── */
        .sr-meta-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 1.75rem;
        }

        .meta-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .meta-card-label {
          font-size: 11.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .meta-card-value {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
        }

        /* ── Summary box ── */
        .sr-summary {
          background: rgba(99,74,242,0.05);
          border: 1px solid rgba(99,74,242,0.12);
          border-radius: 12px;
          padding: 1.1rem 1.4rem;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .sr-summary-icon {
          color: #8b78f7;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .sr-summary-text {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.55);
          font-weight: 300;
        }

        /* ── Severity breakdown ── */
        .sr-breakdown {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .sev-chip {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid;
        }

        .sev-chip-count {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
        }

        /* ── Section header ── */
        .sr-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .sr-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sr-section-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 22px;
          height: 22px;
          padding: 0 6px;
          background: rgba(99,74,242,0.15);
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #8b78f7;
        }

        /* ── Vuln list ── */
        .vuln-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .vuln-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 3rem;
          background: rgba(255,255,255,0.02);
          border: 1px dashed rgba(255,255,255,0.07);
          border-radius: 12px;
          text-align: center;
        }

        .vuln-empty-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(52,211,153,0.08);
          border: 1px solid rgba(52,211,153,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #34d399;
        }

        .vuln-empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
        }

        .vuln-empty-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.25);
        }

        /* Divider */
        .sr-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 2rem 0;
        }
      `}</style>

      <div className="sr-page">
        <div className="sr-inner">

          {/* Loading */}
          {loading && (
            <div className="sr-state">
              <div className="sr-state-icon">
                <div className="spinner" />
              </div>
              <p className="sr-state-title">Loading scan result…</p>
              <p className="sr-state-sub">Fetching data for scan #{scanId}</p>
            </div>
          )}

          {/* Not found */}
          {!loading && !scanResult && (
            <div className="sr-state">
              <div className="sr-state-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/><line x1="11" y1="16" x2="11.01" y2="16"/>
                </svg>
              </div>
              <p className="sr-state-title">Scan result not found</p>
              <p className="sr-state-sub">No data available for scan #{scanId}</p>
            </div>
          )}

          {/* Main content */}
          {!loading && scanResult && (() => {
            const statusKey = (scanResult.status || "").toLowerCase();
            const sm = statusMeta[statusKey] || statusMeta.running;
            const vulnCount = scanResult.vulnerabilities?.length || 0;

            return (
              <>
                {/* Header */}
                <div className="sr-header">
                  <div className="sr-breadcrumb">
                    <span>Dashboard</span>
                    <span className="sr-breadcrumb-sep">/</span>
                    <span>Scans</span>
                    <span className="sr-breadcrumb-sep">/</span>
                    <span className="sr-breadcrumb-current">#{scanResult.id}</span>
                  </div>
                  <div className="sr-title-row">
                    <h1 className="sr-title">Scan Result #{scanResult.id}</h1>
                    <span
                      className="status-badge"
                      style={{ color: sm.color, background: sm.bg, borderColor: sm.border }}
                    >
                      {sm.icon}
                      {scanResult.status}
                    </span>
                  </div>
                </div>

                {/* Meta cards */}
                <div className="sr-meta-row">
                  <div className="meta-card">
                    <span className="meta-card-label">Scan ID</span>
                    <span className="meta-card-value">#{scanResult.id}</span>
                  </div>
                  <div className="meta-card">
                    <span className="meta-card-label">Submission ID</span>
                    <span className="meta-card-value">#{scanResult.submission_id}</span>
                  </div>
                  <div className="meta-card">
                    <span className="meta-card-label">Vulnerabilities</span>
                    <span className="meta-card-value">{vulnCount}</span>
                  </div>
                  <div className="meta-card">
                    <span className="meta-card-label">Status</span>
                    <span className="meta-card-value" style={{ color: sm.color, textTransform: "capitalize" }}>
                      {scanResult.status}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                {scanResult.summary && (
                  <div className="sr-summary">
                    <span className="sr-summary-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                      </svg>
                    </span>
                    <p className="sr-summary-text">{scanResult.summary}</p>
                  </div>
                )}

                <div className="sr-divider" />

                {/* Vulnerabilities section */}
                <div className="sr-section-header">
                  <h2 className="sr-section-title">
                    Vulnerabilities
                    <span className="sr-section-count">{vulnCount}</span>
                  </h2>

                  {/* Severity breakdown chips */}
                  {vulnCount > 0 && (
                    <div className="sr-breakdown">
                      {Object.entries(severityCounts).map(([sev, count]) => {
                        const m = severityMeta[sev] || severityMeta.unknown;
                        return (
                          <span
                            key={sev}
                            className="sev-chip"
                            style={{ color: m.color, background: m.bg, borderColor: m.border }}
                          >
                            <span className="sev-chip-count">{count}</span>
                            <span style={{ textTransform: "capitalize", opacity: 0.8 }}>{sev}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {vulnCount > 0 ? (
                  <div className="vuln-list">
                    {scanResult.vulnerabilities.map((vuln) => (
                      <VulnerabilityCard key={vuln.id} vulnerability={vuln} />
                    ))}
                  </div>
                ) : (
                  <div className="vuln-empty">
                    <div className="vuln-empty-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <polyline points="9 12 11 14 15 10"/>
                      </svg>
                    </div>
                    <p className="vuln-empty-title">No vulnerabilities found</p>
                    <p className="vuln-empty-sub">This scan came back clean — no issues detected.</p>
                  </div>
                )}
              </>
            );
          })()}

        </div>
      </div>
    </>
  );
};

export default ScanResultPage;