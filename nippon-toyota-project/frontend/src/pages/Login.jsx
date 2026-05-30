import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      
      // Redirect based on user role
      if (data.role === "admin") {
        window.location.href = "/admin";
      } else if (data.role === "sales") {
        window.location.href = "/sales";
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-visual" aria-label="Nippon Toyota sales portal">
        <div className="brand-mark">NT</div>
        <div>
          <p className="eyebrow">Nippon Toyota</p>
          <h1>Sales performance, inventory, and incentives in one workspace.</h1>
          <p>
            A focused portal for branch teams to manage vehicle data and monthly
            sales payouts with confidence.
          </p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">Secure Access</p>
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to continue to your dashboard.</p>

          {error && <p className="message error">{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              <span>Email address</span>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="primary-action" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
