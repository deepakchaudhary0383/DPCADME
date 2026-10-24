import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getAllAlumni } from "../../services/alumniService";
import {
  getConnectionsByStudent,
  sendConnectionRequest,
} from "../../services/connectionService";
import { getStudentProfileByUserId } from "../../services/studentService";

import "../../styles/student-dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [alumni, setAlumni] = useState([]);
  const [connections, setConnections] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [connectingId, setConnectingId] = useState(null);
  const [connectionStatuses, setConnectionStatuses] = useState({});

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          setError("User information not found. Please login again.");
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);

        // Load all alumni
        const alumniData = await getAllAlumni();

        const formattedAlumni = alumniData.map((person) => ({
          ...person,
          skills: person.skills
            ? person.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
                .join(" · ")
            : "Skills not provided",
        }));

        setAlumni(formattedAlumni);

        // Load current student's profile
        const profile = await getStudentProfileByUserId(user.id);

        setStudentProfile(profile);

        // Load student's connections
        const connectionData = await getConnectionsByStudent(profile.id);

        setConnections(connectionData);

        // Build connection status map
        const statusMap = {};

        connectionData.forEach((connection) => {
          statusMap[connection.alumniId] = connection.status;
        });

        setConnectionStatuses(statusMap);
      } catch (error) {
        console.error("Dashboard loading error:", error);

        setError(error.message || "Failed to load dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleConnect = async (alumniId) => {
    try {
      if (!studentProfile) {
        return;
      }

      setConnectingId(alumniId);

      await sendConnectionRequest(studentProfile.id, alumniId);

      setConnectionStatuses((previous) => ({
        ...previous,
        [alumniId]: "PENDING",
      }));

      // Refresh connections so the dashboard counts update
      const updatedConnections = await getConnectionsByStudent(
        studentProfile.id,
      );

      setConnections(updatedConnections);
    } catch (error) {
      console.error("Connection request error:", error);

      alert(error.message || "Failed to send connection request.");
    } finally {
      setConnectingId(null);
    }
  };

  const handleViewProfile = (id) => {
    navigate(`/student/alumni/${id}`);
  };

  const acceptedConnections = connections.filter(
    (connection) => connection.status === "ACCEPTED",
  ).length;

  const pendingConnections = connections.filter(
    (connection) => connection.status === "PENDING",
  ).length;

  // Show first 3 alumni on dashboard
  const displayedAlumni = alumni.slice(0, 3);

  // Check whether the student profile is complete
  const profileFields = [
    studentProfile?.course,
    studentProfile?.department,
    studentProfile?.year,
    studentProfile?.skills,
    studentProfile?.bio,
  ];

  const isProfileComplete = profileFields.every(
    (field) =>
      field !== null && field !== undefined && String(field).trim() !== "",
  );

  if (isLoading) {
    return (
      <div className="student-dashboard">
        <section className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">STUDENT DASHBOARD</p>

            <h1>Build your network.</h1>

            <p className="dashboard-subtitle">Loading your network...</p>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-dashboard">
        <section className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">STUDENT DASHBOARD</p>

            <h1>Build your network.</h1>

            <p className="dashboard-subtitle">{error}</p>
          </div>

          <Link to="/student/alumni" className="discover-button">
            <span>Discover alumni</span>

            <span className="discover-arrow">→</span>
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      {/* PAGE HEADER */}
      <section className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">STUDENT DASHBOARD</p>

          <h1>Build your network.</h1>

          <p className="dashboard-subtitle">
            Discover alumni, learn from their experiences, and build connections
            that can shape your career.
          </p>
        </div>

        <Link to="/student/alumni" className="discover-button">
          <span>Discover alumni</span>

          <span className="discover-arrow">→</span>
        </Link>
      </section>

      {/* NETWORK OVERVIEW */}
      <section className="dashboard-stats">
        <div className="stat-item">
          <span className="stat-label">ALUMNI NETWORK</span>

          <strong>{alumni.length}</strong>

          <span className="stat-description">alumni available</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">CONNECTIONS</span>

          <strong>{acceptedConnections}</strong>

          <span className="stat-description">people in your network</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">PENDING</span>

          <strong>{pendingConnections}</strong>

          <span className="stat-description">connection requests</span>
        </div>
      </section>

      {/* MAIN DASHBOARD GRID */}
      <section className="dashboard-grid">
        {/* ALUMNI DISCOVERY */}
        <div className="dashboard-section alumni-section">
          <div className="section-heading">
            <div>
              <p className="section-label">DISCOVER</p>

              <h2>Alumni you may want to know</h2>
            </div>

            <Link to="/student/alumni" className="section-link">
              View all →
            </Link>
          </div>

          <div className="alumni-list">
            {displayedAlumni.length === 0 ? (
              <p>No alumni profiles available yet.</p>
            ) : (
              displayedAlumni.map((person) => {
                const status = connectionStatuses[person.id];

                return (
                  <article className="dashboard-alumni" key={person.id}>
                    <div
                      className="alumni-avatar"
                      onClick={() => handleViewProfile(person.id)}
                    >
                      {person.name.charAt(0)}
                    </div>

                    <div className="alumni-info">
                      <h3>{person.name}</h3>

                      <p className="alumni-role">
                        {person.role || "Professional"}
                      </p>

                      <p className="alumni-company">
                        {person.company || "Company not provided"}

                        {person.location && (
                          <>
                            <span> · </span>
                            {person.location}
                          </>
                        )}
                      </p>

                      <p className="alumni-skills">{person.skills}</p>
                    </div>

                    <button
                      type="button"
                      className="connect-small"
                      onClick={() => handleConnect(person.id)}
                      disabled={
                        connectingId === person.id ||
                        status === "PENDING" ||
                        status === "ACCEPTED"
                      }
                    >
                      {connectingId === person.id
                        ? "Sending..."
                        : status === "PENDING"
                          ? "Pending"
                          : status === "ACCEPTED"
                            ? "Connected"
                            : "Connect"}
                    </button>
                  </article>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="dashboard-side">
          {/* CONNECTION ACTIVITY */}
          <div className="dashboard-section activity-section">
            <div className="section-heading">
              <div>
                <p className="section-label">ACTIVITY</p>

                <h2>Your network</h2>
              </div>
            </div>

            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-mark">+</div>

                <div>
                  <strong>
                    {pendingConnections} pending
                    {pendingConnections === 1 ? " request" : " requests"}
                  </strong>

                  <p>Review your connection requests.</p>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-mark">→</div>

                <div>
                  <strong>
                    {acceptedConnections}{" "}
                    {acceptedConnections === 1 ? "connection" : "connections"}
                  </strong>

                  <p>People you've connected with.</p>
                </div>
              </div>
            </div>

            <Link to="/student/connections" className="activity-link">
              Manage connections →
            </Link>
          </div>

          {/* PROFILE PROMPT */}
          <div className="profile-prompt">
            <div>
              <p className="section-label">YOUR PROFILE</p>

              <h2>
                {isProfileComplete
                  ? "Your profile is ready."
                  : "Make it easier for alumni to know you."}
              </h2>

              <p>
                {isProfileComplete
                  ? "Keep your profile updated so alumni can quickly understand your background and interests."
                  : "Add your skills, course and interests to create a better professional profile."}
              </p>
            </div>

            <Link to="/student/profile" className="profile-link">
              {isProfileComplete ? "View profile →" : "Complete profile →"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
