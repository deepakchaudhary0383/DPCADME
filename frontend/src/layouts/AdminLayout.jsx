import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "../styles/admin-layout.css";

function AdminLayout() {
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
      console.error("Failed to read logged-in admin:", error);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getInitial = () => {
    if (!user?.name) return "A";

    return user.name.charAt(0).toUpperCase();
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="admin-logo-mark">D</div>

          <div className="admin-logo-text">
            <strong>DPCADME</strong>
            <span>Admin Portal</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <p className="admin-nav-label">MAIN MENU</p>

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="admin-nav-icon">⌂</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/students"
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="admin-nav-icon">♙</span>
            <span>Manage Students</span>
          </NavLink>

          <NavLink
            to="/admin/alumni"
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="admin-nav-icon">♧</span>
            <span>Manage Alumni</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-avatar">{getInitial()}</div>

            <div className="admin-sidebar-user-info">
              <strong>{user?.name || "Admin"}</strong>

              <span>Administrator</span>
            </div>
          </div>

          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              `admin-nav-item admin-profile-nav ${isActive ? "active" : ""}`
            }
          >
            <span className="admin-nav-icon">◯</span>
            <span>My Profile</span>
          </NavLink>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <span>Administration</span>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-topbar-user">
              <div className="admin-topbar-avatar">{getInitial()}</div>

              <div>
                <strong>{user?.name || "Admin"}</strong>

                <span>{user?.email || ""}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
