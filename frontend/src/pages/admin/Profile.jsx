import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin-profile.css";

function AdminProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role?.toUpperCase() !== "ADMIN") {
        navigate("/login");
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("Unable to load admin profile:", error);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const getInitial = () => user?.name?.trim()?.charAt(0)?.toUpperCase() || "A";

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return <div className="admin-profile-loading">Loading profile...</div>;
  }

  return (
    <div className="admin-profile-page">
      <header className="admin-profile-header">
        <div>
          <h1>My Profile</h1>
          <p>
            View your administrator account information and personal details.
          </p>
        </div>

        <button
          type="button"
          className="admin-profile-edit-button"
          onClick={() => navigate("/admin/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      {/* Profile identity card */}
      <section className="admin-profile-card">
        <div className="admin-profile-identity">
          <div className="admin-profile-avatar">{getInitial()}</div>

          <div>
            <h2>{user.name || "DPCADME Admin"}</h2>
            <p>{user.email || "No email available"}</p>
            <span>Administrator</span>
          </div>
        </div>
      </section>

      {/* Account information */}
      <section className="admin-profile-section">
        <div className="admin-profile-section-heading">
          <p>ACCOUNT DETAILS</p>
          <h2>Personal Information</h2>
        </div>

        <div className="admin-profile-details-grid">
          <div className="admin-profile-detail">
            <span>Full Name</span>
            <strong>{user.name || "Not available"}</strong>
          </div>

          <div className="admin-profile-detail">
            <span>Email Address</span>
            <strong>{user.email || "Not available"}</strong>
          </div>

          <div className="admin-profile-detail">
            <span>Account Role</span>
            <strong>{user.role || "ADMIN"}</strong>
          </div>

          <div className="admin-profile-detail">
            <span>Account Status</span>
            <strong>{user.status || "Unknown"}</strong>
          </div>

          <div className="admin-profile-detail">
            <span>Portal Access</span>
            <strong>DPCADME Administration</strong>
          </div>

          <div className="admin-profile-detail">
            <span>Profile Type</span>
            <strong>Administrator Account</strong>
          </div>
        </div>

        <div className="admin-profile-about">
          <span>ABOUT YOUR ACCOUNT</span>
          <p>
            This account is used to manage the DPCADME student and alumni
            community. From the admin dashboard, you can view account statistics
            and manage student and alumni accounts.
          </p>
        </div>

        <div className="admin-profile-actions">
          <button
            type="button"
            className="admin-profile-cancel-button"
            onClick={() => navigate("/admin/dashboard")}
          >
            Back to Dashboard
          </button>

          <button
            type="button"
            className="admin-profile-save-button"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </section>
    </div>
  );
}

export default AdminProfile;
