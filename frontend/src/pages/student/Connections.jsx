import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getConnectionsByStudent } from "../../services/connectionService";

import "../../styles/student-connections.css";

function Connections() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [connections, setConnections] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadConnections = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          setError("User information not found. Please login again.");
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);

        const studentProfileResponse = await fetch(
          `http://localhost:8080/api/students/user/${user.id}`,
        );

        const studentProfile = await studentProfileResponse.json();

        if (!studentProfileResponse.ok) {
          throw new Error(
            studentProfile.message || "Failed to load student profile.",
          );
        }

        const data = await getConnectionsByStudent(studentProfile.id);

        const pending = data.filter(
          (connection) => connection.status === "PENDING",
        );

        const accepted = data.filter(
          (connection) => connection.status === "ACCEPTED",
        );

        setPendingRequests(pending);
        setConnections(accepted);
      } catch (error) {
        console.error("Connections loading error:", error);

        setError(error.message || "Failed to load connections.");
      } finally {
        setIsLoading(false);
      }
    };

    loadConnections();
  }, []);

  if (isLoading) {
    return (
      <div className="student-connections">
        <section className="connections-header">
          <div>
            <p className="connections-eyebrow">YOUR NETWORK</p>

            <h1>Connections.</h1>

            <p className="connections-subtitle">Loading your connections...</p>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-connections">
        <section className="connections-header">
          <div>
            <p className="connections-eyebrow">YOUR NETWORK</p>

            <h1>Connections.</h1>

            <p className="connections-subtitle">{error}</p>
          </div>

          <Link to="/student/alumni" className="connections-discover">
            <span>Discover alumni</span>
            <span>→</span>
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="student-connections">
      <section className="connections-header">
        <div>
          <p className="connections-eyebrow">YOUR NETWORK</p>

          <h1>Connections.</h1>

          <p className="connections-subtitle">
            Manage the people you've connected with and respond to new
            connection requests.
          </p>
        </div>

        <Link to="/student/alumni" className="connections-discover">
          <span>Discover alumni</span>
          <span>→</span>
        </Link>
      </section>

      <section className="connection-summary">
        <div className="summary-item">
          <span className="summary-label">CONNECTIONS</span>

          <strong>{connections.length}</strong>

          <span>people in your network</span>
        </div>

        <div className="summary-item">
          <span className="summary-label">PENDING</span>

          <strong>{pendingRequests.length}</strong>

          <span>requests to review</span>
        </div>
      </section>

      <section className="connection-section">
        <div className="connection-section-heading">
          <div>
            <p className="connection-section-label">REQUESTS</p>

            <h2>Pending connections</h2>
          </div>

          <span className="section-count">{pendingRequests.length}</span>
        </div>

        <div className="request-list">
          {pendingRequests.length === 0 ? (
            <p className="connection-empty">
              You don't have any pending connection requests.
            </p>
          ) : (
            pendingRequests.map((connection) => (
              <article className="request-item" key={connection.id}>
                <div className="request-avatar">
                  {connection.alumniName.charAt(0)}
                </div>

                <div className="request-info">
                  <h3>{connection.alumniName}</h3>

                  <p>Alumni</p>

                  <span>{connection.alumniEmail}</span>
                </div>

                <div className="request-status">
                  <span>Request pending</span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="connection-section">
        <div className="connection-section-heading">
          <div>
            <p className="connection-section-label">NETWORK</p>

            <h2>People you're connected with</h2>
          </div>

          <span className="section-count">{connections.length}</span>
        </div>

        <div className="connected-list">
          {connections.length === 0 ? (
            <p className="connection-empty">
              You haven't connected with anyone yet.
            </p>
          ) : (
            connections.map((connection) => (
              <article className="connected-item" key={connection.id}>
                <div className="connected-avatar">
                  {connection.alumniName.charAt(0)}
                </div>

                <div className="connected-info">
                  <h3>{connection.alumniName}</h3>

                  <p>Alumni</p>

                  <span>{connection.alumniEmail}</span>
                </div>

                <Link
                  to={`/student/alumni/${connection.alumniId}`}
                  className="view-connection"
                >
                  View profile →
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Connections;
