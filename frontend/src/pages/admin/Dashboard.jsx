import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/admin-dashboard.css";

const API_BASE_URL = "http://localhost:8080/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    students: 0,
    alumni: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCounts = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/users/counts`);

        if (!response.ok) {
          throw new Error("Unable to load dashboard statistics.");
        }

        const data = await response.json();

        setCounts({
          students: data.students ?? 0,
          alumni: data.alumni ?? 0,
        });
      } catch (err) {
        console.error("Admin dashboard error:", err);
        setError(err.message || "Failed to load dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCounts();
  }, []);

  return (
    <div className="admin-dashboard">
      <section className="admin-dashboard-header">
        <div>
          <p className="admin-dashboard-eyebrow">OVERVIEW</p>
          <h1>Admin Dashboard</h1>
          <p>Manage the DPCADME student and alumni community from one place.</p>
        </div>
      </section>

      {error && (
        <div className="admin-dashboard-error">
          {error}
          <button type="button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      <section className="admin-stats-grid">
        <article className="admin-stat-card">
          <div className="admin-stat-top">
            <span>Total Students</span>
            <div className="admin-stat-icon">♙</div>
          </div>

          <strong className="admin-stat-number">
            {isLoading ? "—" : counts.students}
          </strong>

          <p>Registered student accounts</p>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-top">
            <span>Total Alumni</span>
            <div className="admin-stat-icon">♧</div>
          </div>

          <strong className="admin-stat-number">
            {isLoading ? "—" : counts.alumni}
          </strong>

          <p>Registered alumni accounts</p>
        </article>
      </section>

      <section className="admin-management-section">
        <div className="admin-section-heading">
          <div>
            <p>ACCOUNT MANAGEMENT</p>
            <h2>Manage your community</h2>
          </div>
        </div>

        <div className="admin-management-grid">
          <article className="admin-management-card">
            <div className="admin-management-icon">♙</div>

            <h3>Manage Students</h3>

            <p>
              View student accounts, search by name or email, and remove
              accounts when necessary.
            </p>

            <button type="button" onClick={() => navigate("/admin/students")}>
              Manage students <span>→</span>
            </button>
          </article>

          <article className="admin-management-card">
            <div className="admin-management-icon">♧</div>

            <h3>Manage Alumni</h3>

            <p>
              Browse alumni accounts, find profiles quickly, and remove accounts
              when necessary.
            </p>

            <button type="button" onClick={() => navigate("/admin/alumni")}>
              Manage alumni <span>→</span>
            </button>
          </article>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
