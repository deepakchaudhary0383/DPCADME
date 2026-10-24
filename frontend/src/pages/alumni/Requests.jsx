import { useEffect, useState } from "react";

import { getAlumniProfileByUserId } from "../../services/alumniService";
import {
  getConnectionsByAlumni,
  acceptConnection,
  rejectConnection,
} from "../../services/connectionService";
import { getStudentById } from "../../services/studentService";

import "../../styles/alumni-requests.css";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [studentProfiles, setStudentProfiles] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setIsLoading(true);
        setError("");

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          throw new Error("No logged-in user found.");
        }

        const user = JSON.parse(storedUser);

        // Get logged-in alumni profile
        const alumniProfile = await getAlumniProfileByUserId(user.id);

        // Get all connections for this alumni
        const connectionData = await getConnectionsByAlumni(alumniProfile.id);

        // Only show pending requests
        const pendingRequests = (connectionData || []).filter(
          (connection) => connection.status === "PENDING",
        );

        setRequests(pendingRequests);

        // Load student profile details
        const profileResults = await Promise.all(
          pendingRequests.map(async (request) => {
            try {
              const student = await getStudentById(request.studentId);

              return {
                studentId: request.studentId,
                profile: student,
              };
            } catch (studentError) {
              console.error(
                `Failed to load student ${request.studentId}:`,
                studentError,
              );

              return {
                studentId: request.studentId,
                profile: null,
              };
            }
          }),
        );

        const profileMap = {};

        profileResults.forEach(({ studentId, profile }) => {
          profileMap[studentId] = profile;
        });

        setStudentProfiles(profileMap);
      } catch (err) {
        console.error("Alumni requests loading error:", err);

        setError(err.message || "Failed to load connection requests.");
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  const handleAccept = async (connectionId) => {
    try {
      setProcessingId(connectionId);
      setError("");

      await acceptConnection(connectionId);

      // Remove accepted request from pending list
      setRequests((currentRequests) =>
        currentRequests.filter((request) => request.id !== connectionId),
      );
    } catch (err) {
      console.error("Accept request error:", err);

      setError(err.message || "Failed to accept connection request.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (connectionId) => {
    try {
      setProcessingId(connectionId);
      setError("");

      await rejectConnection(connectionId);

      // Remove rejected request from pending list
      setRequests((currentRequests) =>
        currentRequests.filter((request) => request.id !== connectionId),
      );
    } catch (err) {
      console.error("Reject request error:", err);

      setError(err.message || "Failed to reject connection request.");
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="alumni-requests-page">
        <div className="alumni-requests-loading">
          Loading connection requests...
        </div>
      </div>
    );
  }

  return (
    <div className="alumni-requests-page">
      {/* PAGE HEADER */}
      <section className="alumni-requests-header">
        <div>
          <p className="alumni-eyebrow">CONNECTION REQUESTS</p>

          <h1>Student requests</h1>

          <p>Review students who want to connect with you.</p>
        </div>

        <div className="alumni-request-count">
          <span>Pending</span>
          <strong>{requests.length}</strong>
        </div>
      </section>

      {/* ERROR MESSAGE */}
      {error && <div className="alumni-requests-error">{error}</div>}

      {/* EMPTY STATE */}
      {requests.length === 0 ? (
        <div className="alumni-requests-empty">
          <div className="alumni-empty-icon">✓</div>

          <h2>No pending requests</h2>

          <p>
            You're all caught up. New student connection requests will appear
            here.
          </p>
        </div>
      ) : (
        /* REQUEST LIST */
        <section className="alumni-requests-list">
          {requests.map((request) => {
            const student = studentProfiles[request.studentId];

            const isProcessing = processingId === request.id;

            return (
              <div className="alumni-request-card" key={request.id}>
                {/* STUDENT AVATAR */}
                <div className="alumni-request-avatar">
                  {request.studentName?.charAt(0)?.toUpperCase()}
                </div>

                {/* STUDENT INFORMATION */}
                <div className="alumni-request-content">
                  <div className="alumni-request-main">
                    <h2>{request.studentName}</h2>

                    <p className="alumni-request-email">
                      {request.studentEmail}
                    </p>
                  </div>

                  {/* EXTRA STUDENT DETAILS */}
                  <div className="alumni-request-details">
                    <div className="alumni-request-detail">
                      <span>Branch</span>

                      <strong>{student?.course || "Not provided"}</strong>
                    </div>

                    <div className="alumni-request-detail">
                      <span>Department</span>

                      <strong>{student?.department || "Not provided"}</strong>
                    </div>

                    <div className="alumni-request-detail">
                      <span>Graduation Year</span>

                      <strong>
                        {student?.graduationYear || "Not provided"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="alumni-request-actions">
                  <button
                    type="button"
                    className="alumni-reject-button"
                    disabled={isProcessing}
                    onClick={() => handleReject(request.id)}
                  >
                    {isProcessing ? "Processing..." : "Reject"}
                  </button>

                  <button
                    type="button"
                    className="alumni-accept-button"
                    disabled={isProcessing}
                    onClick={() => handleAccept(request.id)}
                  >
                    {isProcessing ? "Processing..." : "Accept"}
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}

export default Requests;
