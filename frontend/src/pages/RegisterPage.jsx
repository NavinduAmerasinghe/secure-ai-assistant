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
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label><br />
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>Username</label><br />
          <input name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>Password</label><br />
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ marginTop: "1rem" }}>Register</button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;