import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc", marginBottom: "1rem" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>Dashboard</Link>
      <Link to="/submit" style={{ marginRight: "1rem" }}>New Submission</Link>
      {user ? (
        <>
          <span style={{ marginRight: "1rem" }}>Logged in as {user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;