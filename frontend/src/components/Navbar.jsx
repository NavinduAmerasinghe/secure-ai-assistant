// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc", marginBottom: "1rem" }}>
//       <Link to="/" style={{ marginRight: "1rem" }}>Dashboard</Link>
//       <Link to="/submit" style={{ marginRight: "1rem" }}>New Submission</Link>
//       {user ? (
//         <>
//           <span style={{ marginRight: "1rem" }}>Logged in as {user.username}</span>
//           <button onClick={handleLogout}>Logout</button>
//         </>
//       ) : (
//         <>
//           <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
//           <Link to="/register">Register</Link>
//         </>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
          background: rgba(10, 10, 15, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          font-family: 'DM Sans', sans-serif;
        }

        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        /* Logo */
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .navbar-logo-mark {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #634af2, #9b59f5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 800;
          color: #fff;
        }

        .navbar-logo-name {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
        }

        /* Nav links */
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
          padding-left: 1.5rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.45);
          text-decoration: none;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
        }

        .nav-link:hover {
          color: rgba(255, 255, 255, 0.85);
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-link.active {
          color: #fff;
          background: rgba(99, 74, 242, 0.15);
        }

        .nav-link.active .nav-link-icon {
          color: #8b78f7;
        }

        .nav-link-icon {
          color: rgba(255, 255, 255, 0.25);
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }

        .nav-link:hover .nav-link-icon {
          color: rgba(255, 255, 255, 0.5);
        }

        /* Right side */
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        /* User pill */
        .user-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px 5px 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 999px;
        }

        .user-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, #634af2, #ec4899);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .user-name {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Logout button */
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 13px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
        }

        .logout-btn:hover {
          color: #f87171;
          border-color: rgba(248, 113, 113, 0.3);
          background: rgba(248, 113, 113, 0.06);
        }

        /* Auth buttons */
        .auth-link {
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.15s, background 0.15s, box-shadow 0.15s;
        }

        .auth-link-ghost {
          color: rgba(255, 255, 255, 0.45);
          border: 1px solid transparent;
        }

        .auth-link-ghost:hover {
          color: rgba(255, 255, 255, 0.85);
          background: rgba(255, 255, 255, 0.05);
        }

        .auth-link-solid {
          background: linear-gradient(135deg, #634af2, #7c5ef5);
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .auth-link-solid::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(255,255,255,0.08), transparent);
          pointer-events: none;
        }

        .auth-link-solid:hover {
          box-shadow: 0 4px 18px rgba(99, 74, 242, 0.35);
          filter: brightness(1.05);
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-inner">

          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-mark">A</div>
            <span className="navbar-logo-name">Acme</span>
          </Link>

          {/* Nav links */}
          <div className="navbar-links">
            <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
              <span className="nav-link-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </span>
              Dashboard
            </Link>
            <Link to="/submit" className={`nav-link ${isActive("/submit") ? "active" : ""}`}>
              <span className="nav-link-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </span>
              New Submission
            </Link>
          </div>

          {/* Right side */}
          <div className="navbar-right">
            {user ? (
              <>
                <div className="user-pill">
                  <div className="user-avatar">
                    {user.username?.[0] ?? "U"}
                  </div>
                  <span className="user-name">{user.username}</span>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-link auth-link-ghost">Sign in</Link>
                <Link to="/register" className="auth-link auth-link-solid">Get started</Link>
              </>
            )}
          </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;