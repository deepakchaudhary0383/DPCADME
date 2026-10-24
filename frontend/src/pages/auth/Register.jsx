import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../../services/authService";

import "../../styles/register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const user = await registerUser({
        name,
        email,
        password,
        role,
      });

      console.log("Registration successful:", user);

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-intro">
        <div className="register-brand">
          <div className="brand-mark">D</div>

          <span>DPCADME</span>
        </div>

        <div className="register-copy">
          <p className="eyebrow">JOIN THE ALUMNI NETWORK</p>

          <h1>
            Digital Platform for
            <br />
            Centralized Alumni
            <br />
            Data Management
            <br />
            and Engagement
          </h1>

          <p>
            Join your university community and create meaningful connections
            that continue beyond the classroom.
          </p>

          <div className="register-features">
            <div className="register-feature">
              <span>01</span>
              <p>Connect with alumni</p>
            </div>

            <div className="register-feature">
              <span>02</span>
              <p>Discover experiences</p>
            </div>

            <div className="register-feature">
              <span>03</span>
              <p>Build your network</p>
            </div>
          </div>
        </div>

        <div className="register-footer">
          <span>DPCADME</span>

          <span className="footer-divider">•</span>

          <span>Your university. Your network.</span>
        </div>
      </section>

      <section className="register-panel">
        <div className="register-container">
          <div className="mobile-register-brand">
            <div className="brand-mark small">D</div>

            <span>DPCADME</span>
          </div>

          <div className="register-header">
            <p className="section-label">CREATE ACCOUNT</p>

            <h2>Become part of the network.</h2>

            <p className="register-description">
              Create your account to connect with your university community.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="register-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">Full name</label>

              <input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="form-group role-group">
              <label className="role-heading">I am joining as</label>

              <div className="role-options">
                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="STUDENT"
                    checked={role === "STUDENT"}
                    onChange={(e) => setRole(e.target.value)}
                  />

                  <span className="custom-radio"></span>

                  <span className="role-content">
                    <span className="role-title">Student</span>

                    <span className="role-description">
                      Connect with alumni and explore guidance.
                    </span>
                  </span>
                </label>

                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="ALUMNI"
                    checked={role === "ALUMNI"}
                    onChange={(e) => setRole(e.target.value)}
                  />

                  <span className="custom-radio"></span>

                  <span className="role-content">
                    <span className="role-title">Alumni</span>

                    <span className="role-description">
                      Share experience and support students.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={isLoading}
            >
              <span>
                {isLoading ? "Creating account..." : "Create account"}
              </span>

              {!isLoading && <span className="button-arrow">→</span>}
            </button>
          </form>

          <div className="login-prompt">
            <span>Already have an account?</span>

            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;
