import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";

import "../../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const user = await loginUser({
        email,
        password,
      });

      console.log("Login successful:", user);

      localStorage.setItem("user", JSON.stringify(user));

      const role = user.role?.toUpperCase();

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "STUDENT") {
        navigate("/student/dashboard");
      } else if (role === "ALUMNI") {
        navigate("/alumni/dashboard");
      } else {
        setError("Invalid user role.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. INVALID EMAIL OR PASSWORD !");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-brand">
        <div className="brand-top">
          <div className="brand-mark">D</div>

          <div className="brand-name">DPCADME</div>
        </div>

        <div className="brand-content">
          <p className="eyebrow">ALUMNI NETWORK</p>

          <h1>
            Digital Platform for
            <br />
            Centralized Alumni
            <br />
            Data Management
            <br />
            and Engagement
          </h1>

          <p className="brand-description">
            A connected space for students and alumni to discover people, share
            experiences, and build meaningful professional relationships.
          </p>

          <div className="brand-features">
            <div className="brand-feature">
              <span className="feature-number">01</span>
              <span>Discover alumni</span>
            </div>

            <div className="brand-feature">
              <span className="feature-number">02</span>
              <span>Build connections</span>
            </div>

            <div className="brand-feature">
              <span className="feature-number">03</span>
              <span>Grow together</span>
            </div>
          </div>
        </div>

        <div className="brand-footer">
          <span>DPCADME</span>
          <span>•</span>
          <span>Your university. Your network.</span>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-container">
          <div className="mobile-brand">
            <div className="brand-mark small">D</div>

            <span>DPCADME</span>
          </div>

          <div className="login-header">
            <p className="section-label">WELCOME BACK</p>

            <h2>Sign in to your network.</h2>

            <p>Access your alumni community and continue where you left off.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="login-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              <span>{isLoading ? "Signing in..." : "Sign in"}</span>

              {!isLoading && <span className="button-arrow">→</span>}
            </button>
          </form>

          <div className="register-prompt">
            <span>Don't have an account?</span>

            <Link to="/register">Create one</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
