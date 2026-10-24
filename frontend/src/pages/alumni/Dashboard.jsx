import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAlumniProfileByUserId } from "../../services/alumniService";
import { getConnectionsByAlumni } from "../../services/connectionService";

import "../../styles/alumni-dashboard.css";

function Dashboard() {
  const [connections, setConnections] = useState([]);
  const [alumniProfile, setAlumniProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError("");

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          throw new Error("No logged-in user found.");
        }

        const user = JSON.parse(storedUser);

        const profile = await getAlumniProfileByUserId(user.id);
        setAlumniProfile(profile);

        const connectionData = await getConnectionsByAlumni(profile.id);

        setConnections(connectionData || []);
      } catch (err) {
        console.error("Alumni dashboard loading error:", err);
        setError(err.message || "Failed to load alumni dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const pendingConnections = connections.filter(
    (connection) => connection.status === "PENDING",
  );

  const acceptedConnections = connections.filter(
    (connection) => connection.status === "ACCEPTED",
  );

  if (isLoading) {
    return (
      <div className="alumni-dashboard-page">
        <div className="alumni-dashboard-loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alumni-dashboard-page">
        <div className="alumni-dashboard-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="alumni-dashboard-page">
      {/* PAGE HEADER */}
      <section className="alumni-dashboard-header">
        <div>
          <p className="alumni-eyebrow">ALUMNI DASHBOARD</p>

          <h1>
            Welcome back
            {alumniProfile?.name ? `, ${alumniProfile.name.split(" ")[0]}` : ""}
            .
          </h1>

          <p>Stay connected with students and help them move forward.</p>
        </div>
      </section>

      {/* TOP AREA */}
      <section className="alumni-top-dashboard">
        {/* TOTAL CONNECTIONS */}
        <div className="alumni-stat-card">
          <span>Total connections</span>

          <strong>{acceptedConnections.length}</strong>

          <p>Students you are connected with</p>
        </div>

        {/* PENDING REQUESTS */}
        <div className="alumni-stat-card">
          <span>Pending requests</span>

          <strong>{pendingConnections.length}</strong>

          <p>Students waiting for your response</p>
        </div>

        {/* CONNECTION REQUESTS */}
        <div className="alumni-dashboard-card alumni-action-card">
          <p className="alumni-card-label">CONNECTION REQUESTS</p>

          <h2>
            {pendingConnections.length > 0
              ? "Students are waiting."
              : "No pending requests."}
          </h2>

          <p>
            {pendingConnections.length > 0
              ? `You have ${pendingConnections.length} pending ${
                  pendingConnections.length === 1 ? "request" : "requests"
                } waiting for your response.`
              : "New student connection requests will appear here."}
          </p>

          <Link to="/alumni/requests" className="alumni-secondary-button">
            Review requests
          </Link>
        </div>
      </section>

      {/* LOWER DASHBOARD AREA */}
      <section className="alumni-dashboard-grid">
        {/* RECENT CONNECTIONS */}
        <div className="alumni-dashboard-card">
          <div className="alumni-card-heading">
            <div>
              <p className="alumni-card-label">NETWORK</p>

              <h2>Recent connections</h2>
            </div>

            <Link to="/alumni/connections">View all</Link>
          </div>

          {acceptedConnections.length === 0 ? (
            <div className="alumni-empty-state">
              <h3>No connections yet</h3>

              <p>Accepted student connections will appear here.</p>
            </div>
          ) : (
            <div className="alumni-connection-list">
              {acceptedConnections.slice(0, 5).map((connection) => (
                <div className="alumni-connection-row" key={connection.id}>
                  <div className="alumni-avatar">
                    {connection.studentName?.charAt(0)?.toUpperCase()}
                  </div>

                  <div className="alumni-connection-info">
                    <strong>{connection.studentName}</strong>

                    <span>{connection.studentEmail}</span>
                  </div>

                  <span className="alumni-status accepted">Connected</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* YOUR NETWORK */}
        <div className="alumni-dashboard-card alumni-action-card">
          <p className="alumni-card-label">YOUR NETWORK</p>

          <h2>Stay connected.</h2>

          <p>
            View the students you have connected with and keep your professional
            network growing.
          </p>

          <Link to="/alumni/connections" className="alumni-secondary-button">
            View connections
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
