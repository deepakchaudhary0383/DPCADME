import { NavLink, Outlet, useNavigate } from "react-router-dom";

import "../styles/alumni-layout.css";

function AlumniLayout() {
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/alumni/dashboard",
      icon: "⌂",
    },
    {
      label: "Requests",
      path: "/alumni/requests",
      icon: "＋",
    },
    {
      label: "Connections",
      path: "/alumni/connections",
      icon: "↗",
    },
    {
      label: "My Profile",
      path: "/alumni/profile",
      icon: "○",
    },
  ];

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const userName = user?.name || "Alumni";

  const userRole =
    user?.role === "ALUMNI"
      ? "Alumni"
      : user?.role === "STUDENT"
        ? "Student"
        : user?.role === "ADMIN"
          ? "Administrator"
          : "Alumni";

  const userInitial = userName.charAt(0).toUpperCase();

  const handleProfileClick = () => {
    navigate("/alumni/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="alumni-layout">
      <aside className="alumni-sidebar">
        <div className="alumni-sidebar-brand">
          <div className="alumni-sidebar-brand-mark">D</div>
          <div className="alumni-sidebar-brand-name">DPCADME</div>
        </div>

        <nav className="alumni-navigation">
          <p className="alumni-navigation-label">WORKSPACE</p>

          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `alumni-nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="alumni-nav-icon">{item.icon}</span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="alumni-sidebar-bottom">
          <div className="alumni-sidebar-divider"></div>

          <button
            className="alumni-sidebar-user"
            type="button"
            onClick={handleProfileClick}
            aria-label="Open my profile"
          >
            <div className="alumni-sidebar-user-avatar">{userInitial}</div>

            <div className="alumni-sidebar-user-info">
              <span className="alumni-sidebar-user-name">{userName}</span>

              <span className="alumni-sidebar-user-role">{userRole}</span>
            </div>
          </button>

          <button
            className="alumni-sidebar-logout"
            type="button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Sign out
          </button>
        </div>
      </aside>

      <div className="alumni-main">
        <header className="alumni-topbar">
          <div className="alumni-mobile-brand">
            <div className="alumni-mobile-brand-mark">D</div>

            <span>DPCADME</span>
          </div>

          <div className="alumni-topbar-right">
            <button
              className="alumni-topbar-user"
              type="button"
              onClick={handleProfileClick}
              aria-label="Open my profile"
            >
              <div className="alumni-topbar-avatar">{userInitial}</div>

              <div className="alumni-topbar-user-text">
                <span>{userName}</span>

                <small>{userRole}</small>
              </div>
            </button>
          </div>
        </header>

        <main className="alumni-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AlumniLayout;
