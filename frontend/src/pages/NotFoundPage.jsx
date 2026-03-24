import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .nf-page {
          min-height: 100vh;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        /* Ambient blobs */
        .nf-page::before {
          content: '';
          position: fixed;
          top: -15%;
          left: -10%;
          width: 560px;
          height: 560px;
          background: radial-gradient(circle, rgba(99,74,242,0.13) 0%, transparent 70%);
          pointer-events: none;
          animation: floatBlob 14s ease-in-out infinite alternate;
        }

        .nf-page::after {
          content: '';
          position: fixed;
          bottom: -10%;
          right: -8%;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%);
          pointer-events: none;
          animation: floatBlob 18s ease-in-out infinite alternate-reverse;
        }

        @keyframes floatBlob {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(40px,30px) scale(1.08); }
        }

        /* Grid */
        .nf-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        .nf-inner {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 500px;
          animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Giant 404 */
        .nf-code {
          font-family: 'Syne', sans-serif;
          font-size: clamp(6rem, 18vw, 10rem);
          font-weight: 800;
          letter-spacing: -0.06em;
          line-height: 1;
          background: linear-gradient(135deg, rgba(99,74,242,0.9), rgba(236,72,153,0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.25rem;
          filter: drop-shadow(0 0 60px rgba(99,74,242,0.25));
          user-select: none;
        }

        /* Decorative line under 404 */
        .nf-rule {
          width: 40px;
          height: 3px;
          border-radius: 99px;
          background: linear-gradient(90deg, #634af2, #ec4899);
          margin: 0 auto 1.75rem;
        }

        .nf-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.35rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: rgba(255,255,255,0.85);
          margin-bottom: 0.65rem;
        }

        .nf-body {
          font-size: 14.5px;
          line-height: 1.7;
          color: rgba(255,255,255,0.35);
          font-weight: 300;
          margin-bottom: 2.25rem;
        }

        /* CTA buttons */
        .nf-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
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
        }

        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(255,255,255,0.08), transparent);
          pointer-events: none;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(99,74,242,0.38);
          filter: brightness(1.05);
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
        }

        .btn-ghost:hover {
          color: rgba(255,255,255,0.75);
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.04);
        }
      `}</style>

      <div className="nf-page">
        <div className="nf-grid" />

        <div className="nf-inner">
          <p className="nf-code">404</p>
          <div className="nf-rule" />
          <h1 className="nf-title">Page not found</h1>
          <p className="nf-body">
            The page you're looking for doesn't exist or has been moved.<br />
            Head back to safety from here.
          </p>
          <div className="nf-actions">
            <Link to="/" className="btn-primary">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back to Dashboard
            </Link>
            <Link to="/submit" className="btn-ghost">
              New Submission
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;