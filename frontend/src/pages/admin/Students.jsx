import { useEffect, useState } from "react";
import "../../styles/admin-students.css";

const API_BASE_URL = "http://localhost:8080/api";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadStudents = async (keyword = "") => {
    try {
      setIsLoading(true);
      setError("");

      const url = keyword.trim()
        ? `${API_BASE_URL}/users/students/search?keyword=${encodeURIComponent(keyword.trim())}`
        : `${API_BASE_URL}/users/students`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to load student accounts.");
      }

      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Loading students failed:", err);
      setError(err.message || "Failed to load students.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStudents(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/users/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "This account no longer exists."
            : "Unable to delete the student account.",
        );
      }

      setDeleteTarget(null);
      await loadStudents(search);
    } catch (err) {
      console.error("Deleting student failed:", err);
      setError(err.message || "Failed to delete student.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitial = (name) => name?.trim()?.charAt(0)?.toUpperCase() || "S";

  return (
    <div className="admin-students-page">
      <header className="admin-students-header">
        <div>
          <p className="admin-students-eyebrow">ACCOUNT MANAGEMENT</p>
          <h1>Manage Students</h1>
          <p>Search student accounts and manage the student directory.</p>
        </div>

        <div className="admin-students-total">
          <span>Total Students</span>
          <strong>{isLoading ? "—" : students.length}</strong>
        </div>
      </header>

      <section className="admin-students-panel">
        <div className="admin-students-toolbar">
          <div>
            <h2>Student directory</h2>
            <p>Search by student name or email address.</p>
          </div>

          <label className="admin-students-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search students..."
              aria-label="Search students by name or email"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>
        </div>

        {error && (
          <div className="admin-students-error" role="alert">
            {error}
            <button type="button" onClick={() => loadStudents(search)}>
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="admin-students-state">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="admin-students-state">
            <div className="admin-students-empty-icon">♙</div>
            <h3>{search ? "No matching students" : "No students found"}</h3>
            <p>
              {search
                ? "Try another name or email address."
                : "Student accounts will appear here."}
            </p>
          </div>
        ) : (
          <div className="admin-students-table-wrap">
            <table className="admin-students-table">
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>EMAIL ADDRESS</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th className="admin-students-action-heading">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="admin-student-identity">
                        <div className="admin-student-avatar">
                          {getInitial(student.name)}
                        </div>
                        <div>
                          <strong>{student.name || "Unnamed student"}</strong>
                          <span>ID: {student.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="admin-student-email">
                      {student.email || "—"}
                    </td>

                    <td>
                      <span className="admin-student-role">
                        {student.role || "STUDENT"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-student-status ${
                          student.status?.toUpperCase() === "ACTIVE"
                            ? "is-active"
                            : "is-other"
                        }`}
                      >
                        {student.status || "Unknown"}
                      </span>
                    </td>

                    <td className="admin-students-action-cell">
                      <button
                        type="button"
                        className="admin-student-delete-button"
                        onClick={() => setDeleteTarget(student)}
                        aria-label={`Delete account for ${student.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && students.length > 0 && (
          <footer className="admin-students-footer">
            Showing {students.length} student
            {students.length === 1 ? "" : "s"}
            {search ? " matching your search" : ""}
          </footer>
        )}
      </section>

      {deleteTarget && (
        <div
          className="admin-delete-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) {
              setDeleteTarget(null);
            }
          }}
        >
          <section
            className="admin-delete-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-delete-title"
          >
            <div className="admin-delete-icon">!</div>
            <h2 id="admin-delete-title">Delete student account?</h2>
            <p>
              You are about to delete <strong>{deleteTarget.name}</strong> (
              {deleteTarget.email}). This action cannot be undone.
            </p>

            <div className="admin-delete-actions">
              <button
                type="button"
                className="admin-delete-cancel"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-delete-confirm"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                {isDeleting ? "Deleting..." : "Delete account"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Students;
