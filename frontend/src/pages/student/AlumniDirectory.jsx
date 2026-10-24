import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAllAlumni } from "../../services/alumniService";
import { getStudentProfileByUserId } from "../../services/studentService";
import {
  getConnectionsByStudent,
  sendConnectionRequest,
} from "../../services/connectionService";

import "../../styles/alumni-directory.css";

function AlumniDirectory() {
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("All");

  const [alumni, setAlumni] = useState([]);
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [studentProfileId, setStudentProfileId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [connectingId, setConnectingId] = useState(null);

  useEffect(() => {
    const loadDirectory = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          throw new Error("No logged-in user found.");
        }

        const user = JSON.parse(storedUser);

        // Load alumni
        const alumniData = await getAllAlumni();

        const formattedAlumni = alumniData.map((person) => ({
          ...person,
          skills: person.skills
            ? person.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
            : [],
        }));

        setAlumni(formattedAlumni);

        // Get current student's profile
        const studentProfile = await getStudentProfileByUserId(user.id);

        setStudentProfileId(studentProfile.id);

        // Load existing connections
        const connections = await getConnectionsByStudent(studentProfile.id);

        const statusMap = {};

        connections.forEach((connection) => {
          statusMap[connection.alumniId] = connection.status;
        });

        setConnectionStatuses(statusMap);
      } catch (error) {
        console.error("Alumni directory loading error:", error);

        setError(error.message || "Failed to load alumni directory.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDirectory();
  }, []);

  const handleConnect = async (alumniId) => {
    if (!studentProfileId) {
      return;
    }

    const currentStatus = connectionStatuses[alumniId];

    // Don't send another request if already pending or connected
    if (currentStatus === "PENDING" || currentStatus === "ACCEPTED") {
      return;
    }

    try {
      setConnectingId(alumniId);

      const connection = await sendConnectionRequest(
        studentProfileId,
        alumniId,
      );

      setConnectionStatuses((previous) => ({
        ...previous,
        [alumniId]: connection.status,
      }));
    } catch (error) {
      console.error("Connection request error:", error);

      alert(error.message || "Failed to send connection request.");
    } finally {
      setConnectingId(null);
    }
  };

  const companies = [
    "All",
    ...new Set(alumni.map((person) => person.company).filter(Boolean)),
  ];

  const filteredAlumni = alumni.filter((person) => {
    const searchTerm = search.trim().toLowerCase();

    const matchesSearch =
      person.name?.toLowerCase().includes(searchTerm) ||
      person.role?.toLowerCase().includes(searchTerm) ||
      person.company?.toLowerCase().includes(searchTerm) ||
      person.location?.toLowerCase().includes(searchTerm) ||
      person.department?.toLowerCase().includes(searchTerm) ||
      person.skills.some((skill) => skill.toLowerCase().includes(searchTerm));

    const matchesCompany = company === "All" || person.company === company;

    return matchesSearch && matchesCompany;
  });

  if (isLoading) {
    return (
      <div className="alumni-directory">
        <section className="directory-results">
          <div className="directory-empty">
            <div className="empty-mark">—</div>

            <h2>Loading alumni...</h2>

            <p>Fetching alumni from the database.</p>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alumni-directory">
        <section className="directory-results">
          <div className="directory-empty">
            <div className="empty-mark">—</div>

            <h2>Unable to load alumni.</h2>

            <p>{error}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="alumni-directory">
      <section className="directory-header">
        <div>
          <p className="directory-eyebrow">ALUMNI NETWORK</p>

          <h1>Discover people.</h1>

          <p className="directory-subtitle">
            Find alumni by their experience, company, skills, and professional
            journey.
          </p>
        </div>

        <div className="directory-count">
          <strong>{filteredAlumni.length}</strong>

          <span>alumni found</span>
        </div>
      </section>

      <section className="directory-tools">
        <div className="search-wrapper">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search by name, role, company or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}
        </div>

        <div className="company-filter">
          <label htmlFor="company">COMPANY</label>

          <select
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          >
            {companies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="directory-results">
        {filteredAlumni.length > 0 ? (
          <div className="alumni-directory-grid">
            {filteredAlumni.map((person) => {
              const status = connectionStatuses[person.id];
              const isConnecting = connectingId === person.id;

              let buttonText = "Connect";

              if (isConnecting) {
                buttonText = "Sending...";
              } else if (status === "PENDING") {
                buttonText = "Request pending";
              } else if (status === "ACCEPTED") {
                buttonText = "Connected";
              } else if (status === "REJECTED") {
                buttonText = "Connect again";
              }

              return (
                <article className="directory-card" key={person.id}>
                  <div className="directory-card-top">
                    <div className="directory-avatar">
                      {person.name ? person.name.charAt(0) : "A"}
                    </div>

                    <span className="graduation-year">
                      {person.graduationYear || "Alumni"}
                    </span>
                  </div>

                  <div className="directory-card-content">
                    <h2>{person.name}</h2>

                    <p className="directory-role">
                      {person.role || "Professional"}
                    </p>

                    <p className="directory-company">
                      {person.company || "Company not provided"}

                      {person.location && (
                        <>
                          <span> · </span>
                          {person.location}
                        </>
                      )}
                    </p>

                    <p className="directory-department">
                      {person.department || "Department not provided"}
                    </p>

                    <div className="skill-list">
                      {person.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="directory-card-footer">
                    <Link
                      to={`/student/alumni/${person.id}`}
                      className="profile-button"
                    >
                      View profile
                    </Link>

                    <button
                      type="button"
                      className="directory-connect"
                      onClick={() => handleConnect(person.id)}
                      disabled={
                        isConnecting ||
                        status === "PENDING" ||
                        status === "ACCEPTED"
                      }
                    >
                      {buttonText}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="directory-empty">
            <div className="empty-mark">—</div>

            <h2>No alumni found.</h2>

            <p>Try changing your search or selecting a different company.</p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCompany("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default AlumniDirectory;
