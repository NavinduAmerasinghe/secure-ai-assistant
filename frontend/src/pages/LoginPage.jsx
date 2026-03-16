import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
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
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label><br />
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>Password</label><br />
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ marginTop: "1rem" }}>Login</button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;