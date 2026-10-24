import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getAlumniById } from "../../services/alumniService";
import {
  sendConnectionRequest,
  getConnectionsByStudent,
} from "../../services/connectionService";
import { getStudentProfileByUserId } from "../../services/studentService";
import "../../styles/alumni-profile.css";

function AlumniProfile() {
  const { id } = useParams();

  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSent, setConnectionSent] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState("");

  useEffect(() => {
    const loadAlumniProfile = async () => {
      try {
        // Load alumni profile
        const data = await getAlumniById(id);

        const formattedProfile = {
          ...data,
          skills: data.skills
            ? data.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
            : [],
        };

        setPerson(formattedProfile);

        // Check whether current student already has a request
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          const user = JSON.parse(storedUser);

          const studentProfile = await getStudentProfileByUserId(user.id);

          const connections = await getConnectionsByStudent(studentProfile.id);

          const existingConnection = connections.find(
            (connection) => Number(connection.alumniId) === Number(id),
          );

          if (existingConnection) {
            setConnectionSent(true);

            if (existingConnection.status === "PENDING") {
              setConnectionMessage("Connection request is already pending.");
            } else if (existingConnection.status === "ACCEPTED") {
              setConnectionMessage("You are connected with this alumni.");
            }
          }
        }
      } catch (error) {
        console.error("Alumni profile loading error:", error);
        setError(error.message || "Failed to load alumni profile.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAlumniProfile();
  }, [id]);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setConnectionMessage("");

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setConnectionMessage("Please login again.");
        return;
      }

      const user = JSON.parse(storedUser);

      // Get current student's profile
      const studentProfile = await getStudentProfileByUserId(user.id);

      // Send connection request
      await sendConnectionRequest(studentProfile.id, Number(id));

      // Update frontend state immediately
      setConnectionSent(true);

      setConnectionMessage("Connection request sent successfully.");
    } catch (error) {
      console.error("Connection request error:", error);

      setConnectionMessage(
        error.message || "Failed to send connection request.",
      );
    } finally {
      setIsConnecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-not-found">
        <p className="profile-eyebrow">ALUMNI NETWORK</p>

        <h1>Loading profile...</h1>

        <p>Fetching alumni information.</p>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="profile-not-found">
        <p className="profile-eyebrow">ALUMNI NETWORK</p>

        <h1>Alumni profile not found.</h1>

        <p>{error || "The profile you're looking for doesn't exist."}</p>

        <Link to="/student/alumni">← Back to alumni</Link>
      </div>
    );
  }

  return (
    <div className="alumni-profile">
      <Link to="/student/alumni" className="profile-back">
        ← Back to alumni
      </Link>

      <section className="profile-header">
        <div className="profile-identity">
          <div className="profile-avatar">{person.name.charAt(0)}</div>

          <div className="profile-heading">
            <p className="profile-eyebrow">ALUMNI PROFILE</p>

            <h1>{person.name}</h1>

            <p className="profile-role">{person.role || "Professional"}</p>

            <p className="profile-company">
              {person.company || "Company not provided"}

              {person.location && (
                <>
                  <span> · </span>
                  {person.location}
                </>
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="profile-connect"
          onClick={handleConnect}
          disabled={isConnecting || connectionSent}
        >
          <span>
            {isConnecting
              ? "Sending..."
              : connectionSent
                ? "Request Sent"
                : "Connect"}
          </span>

          <span>→</span>
        </button>
      </section>

      {connectionMessage && (
        <p className="connection-message">{connectionMessage}</p>
      )}

      <div className="profile-layout">
        <main className="profile-main">
          <section className="profile-section">
            <p className="profile-section-label">ABOUT</p>

            <h2>Professional journey</h2>

            <p className="profile-bio">
              {person.bio || "This alumni has not added a bio yet."}
            </p>
          </section>

          <section className="profile-section">
            <p className="profile-section-label">EXPERTISE</p>

            <h2>Skills &amp; interests</h2>

            <div className="profile-skills">
              {person.skills.length > 0 ? (
                person.skills.map((skill) => <span key={skill}>{skill}</span>)
              ) : (
                <span>No skills added yet.</span>
              )}
            </div>
          </section>
        </main>

        <aside className="profile-sidebar">
          <section className="profile-details">
            <p className="profile-section-label">EDUCATION</p>

            <div className="detail-item">
              <span className="detail-label">Course</span>

              <strong>{person.course || "Not provided"}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Department</span>

              <strong>{person.department || "Not provided"}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Graduated</span>

              <strong>{person.graduationYear || "Not provided"}</strong>
            </div>
          </section>

          <section className="profile-help">
            <p className="profile-section-label">LOOKING FOR GUIDANCE?</p>

            <h2>Start a conversation.</h2>

            <p>
              Connect with alumni who can share experience and perspective from
              their professional journey.
            </p>

            <button
              type="button"
              className="help-connect"
              onClick={handleConnect}
              disabled={isConnecting || connectionSent}
            >
              {isConnecting
                ? "Sending..."
                : connectionSent
                  ? "Request Sent"
                  : `Connect with ${person.name.split(" ")[0]}`}

              <span>→</span>
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default AlumniProfile;
