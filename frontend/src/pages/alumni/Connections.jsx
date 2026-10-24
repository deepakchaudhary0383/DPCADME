import { useEffect, useState } from "react";

import { getAlumniProfileByUserId } from "../../services/alumniService";
import { getConnectionsByAlumni } from "../../services/connectionService";
import { getStudentById } from "../../services/studentService";

import "../../styles/alumni-connections.css";

function Connections() {
  const [connections, setConnections] = useState([]);
  const [alumniProfile, setAlumniProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadConnections = async () => {
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

        const acceptedConnections = (connectionData || []).filter(
          (connection) => connection.status === "ACCEPTED",
        );

        const enrichedConnections = await Promise.all(
          acceptedConnections.map(async (connection) => {
            try {
              const student = await getStudentById(connection.studentId);

              return {
                ...connection,
                student,
              };
            } catch (studentError) {
              console.error(
                `Failed to load student ${connection.studentId}:`,
                studentError,
              );

              return {
                ...connection,
                student: null,
              };
            }
          }),
        );

        setConnections(enrichedConnections);
      } catch (err) {
        console.error("Alumni connections loading error:", err);
        setError(err.message || "Failed to load connections.");
      } finally {
        setIsLoading(false);
      }
    };

    loadConnections();
  }, []);

  const getStudentName = (connection) => {
    return (
      connection.student?.user?.name || connection.studentName || "Student"
    );
  };

  const getStudentEmail = (connection) => {
    return (
      connection.student?.user?.email ||
      connection.studentEmail ||
      "Email unavailable"
    );
  };

  const getStudentBranch = (connection) => {
    return (
      connection.student?.branch ||
      connection.student?.course ||
      "Not specified"
    );
  };

  const getStudentDepartment = (connection) => {
    return connection.student?.department || "Not specified";
  };

  const getGraduationYear = (connection) => {
    return (
      connection.student?.graduationYear ||
      connection.student?.year ||
      "Not specified"
    );
  };

  const getInitial = (connection) => {
    const name = getStudentName(connection);

    return name.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="alumni-connections-page">
        <div className="alumni-connections-loading">
          Loading your connections...
        </div>
      </div>
    );
  }

  return (
    <div className="alumni-connections-page">
      {/* HEADER */}

      <section className="alumni-connections-header">
        <div>
          <p className="alumni-eyebrow">MY NETWORK</p>

          <h1>Your connections</h1>

          <p>Students you have connected with through DPCADME.</p>
        </div>
      </section>

      {/* NETWORK STATUS */}

      <div className="alumni-network-summary">
        <div>
          <span className="alumni-summary-label">NETWORK STATUS</span>

          <strong>
            {connections.length === 0
              ? "Ready to connect"
              : `${connections.length} ${
                  connections.length === 1 ? "student" : "students"
                } connected`}
          </strong>
        </div>
      </div>

      {/* ERROR */}

      {error && <div className="alumni-connections-error">{error}</div>}

      {/* EMPTY STATE */}

      {connections.length === 0 ? (
        <section className="alumni-connections-empty">
          <div className="alumni-empty-icon">◎</div>

          <h2>No connections yet</h2>

          <p>
            Students you accept will appear here. Once you build your network,
            you can view all your accepted connections from this page.
          </p>
        </section>
      ) : (
        /* CONNECTION LIST */

        <section className="alumni-connections-list">
          {connections.map((connection) => (
            <article className="alumni-connection-card" key={connection.id}>
              {/* AVATAR */}

              <div className="alumni-connection-avatar">
                {getInitial(connection)}
              </div>

              {/* MAIN CONTENT */}

              <div className="alumni-connection-content">
                <div className="alumni-connection-top">
                  <div>
                    <h2>{getStudentName(connection)}</h2>

                    <p className="alumni-connection-email">
                      {getStudentEmail(connection)}
                    </p>
                  </div>

                  <span className="alumni-connection-status">Connected</span>
                </div>

                {/* STUDENT DETAILS */}

                <div className="alumni-connection-details">
                  <div className="alumni-connection-detail">
                    <span>Branch</span>

                    <strong>{getStudentBranch(connection)}</strong>
                  </div>

                  <div className="alumni-connection-detail">
                    <span>Department</span>

                    <strong>{getStudentDepartment(connection)}</strong>
                  </div>

                  <div className="alumni-connection-detail">
                    <span>Graduation Year</span>

                    <strong>{getGraduationYear(connection)}</strong>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default Connections;
