import { useEffect, useState } from "react";
import "../../styles/admin-alumni.css";

const API_BASE_URL = "http://localhost:8080/api";

function AdminAlumni() {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadAlumni = async (keyword = "") => {
    try {
      setIsLoading(true);
      setError("");

      const endpoint = keyword.trim()
        ? `${API_BASE_URL}/users/alumni/search?keyword=${encodeURIComponent(keyword.trim())}`
        : `${API_BASE_URL}/users/alumni`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error("Unable to load alumni accounts.");
      }

      const data = await response.json();
      setAlumni(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load alumni error:", err);
      setError(err.message || "Failed to load alumni accounts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadAlumni(search);
    }, 300);

    return () => clearTimeout(timeout);
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
        if (response.status === 404) {
          throw new Error("This alumni account was not found.");
        }

        throw new Error(
          "Unable to delete this account. It may have related profiles or connections.",
        );
      }

      setAlumni((current) =>
        current.filter((person) => person.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete alumni error:", err);
      setError(err.message || "Failed to delete alumni account.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitial = (name) => name?.trim()?.charAt(0)?.toUpperCase() || "A";

  return (
    <div className="admin-alumni-page">
      <section className="admin-alumni-header">
        <div>
          <p className="admin-alumni-eyebrow">ACCOUNT MANAGEMENT</p>
          <h1>Manage Alumni</h1>
          <p>Search, review, and manage registered alumni accounts.</p>
        </div>

        <div className="admin-alumni-total">
          <span>Total listed</span>
          <strong>{isLoading ? "—" : alumni.length}</strong>
        </div>
      </section>

      {error && (
        <div className="admin-alumni-alert" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => loadAlumni(search)}>
            Retry
          </button>
        </div>
      )}

      <section className="admin-alumni-panel">
        <div className="admin-alumni-toolbar">
          <div>
            <h2>Alumni directory</h2>
            <p>Find an account by name or email address.</p>
          </div>

          <div className="admin-alumni-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search alumni..."
              aria-label="Search alumni by name or email"
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
          </div>
        </div>

        <div className="admin-alumni-table-wrap">
          <table className="admin-alumni-table">
            <thead>
              <tr>
                <th>ALUMNI</th>
                <th>EMAIL ADDRESS</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th className="admin-alumni-action-heading">ACTION</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="admin-alumni-state">
                    Loading alumni accounts...
                  </td>
                </tr>
              ) : alumni.length === 0 ? (
                <tr>
                  <td colSpan="5" className="admin-alumni-state">
                    {search
                      ? "No alumni match your search."
                      : "No alumni accounts found."}
                  </td>
                </tr>
              ) : (
                alumni.map((person) => (
                  <tr key={person.id}>
                    <td>
                      <div className="admin-alumni-person">
                        <div className="admin-alumni-avatar">
                          {getInitial(person.name)}
                        </div>
                        <strong>{person.name || "Unnamed alumni"}</strong>
                      </div>
                    </td>

                    <td className="admin-alumni-email">
                      {person.email || "—"}
                    </td>

                    <td>
                      <span className="admin-alumni-role">
                        {person.role || "ALUMNI"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-alumni-status ${
                          person.status?.toUpperCase() === "ACTIVE"
                            ? "is-active"
                            : "is-other"
                        }`}
                      >
                        {person.status || "Unknown"}
                      </span>
                    </td>

                    <td className="admin-alumni-action-cell">
                      <button
                        type="button"
                        className="admin-alumni-delete-button"
                        onClick={() => setDeleteTarget(person)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-alumni-footer">
          Showing {isLoading ? "—" : alumni.length} alumni account
          {alumni.length === 1 ? "" : "s"}
        </div>
      </section>

      {deleteTarget && (
        <div
          className="admin-alumni-modal-backdrop"
          onClick={() => !isDeleting && setDeleteTarget(null)}
        >
          <section
            className="admin-alumni-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-alumni-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-alumni-modal-icon">!</div>
            <h2 id="admin-alumni-modal-title">Delete alumni account?</h2>
            <p>
              You are about to delete{" "}
              <strong>{deleteTarget.name || deleteTarget.email}</strong>. This
              action cannot be undone.
            </p>

            <div className="admin-alumni-modal-actions">
              <button
                type="button"
                className="admin-alumni-cancel-button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-alumni-confirm-delete"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                {isDeleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default AdminAlumni;
