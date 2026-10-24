import { NavLink, Outlet, useNavigate } from "react-router-dom";

import "../styles/student-layout.css";

function StudentLayout() {
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/student/dashboard",
      icon: "⌂",
    },
    {
      label: "Discover Alumni",
      path: "/student/alumni",
      icon: "⌕",
    },
    {
      label: "Connections",
      path: "/student/connections",
      icon: "↗",
    },
    {
      label: "My Profile",
      path: "/student/profile",
      icon: "○",
    },
  ];

  // Get the currently logged-in user
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const userName = user?.name || "Student";

  const userRole =
    user?.role === "STUDENT"
      ? "Student"
      : user?.role === "ALUMNI"
        ? "Alumni"
        : user?.role === "ADMIN"
          ? "Administrator"
          : "Student";

  const userInitial = userName.charAt(0).toUpperCase();

  const handleProfileClick = () => {
    navigate("/student/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="student-layout">
      {/* SIDEBAR */}
      <aside className="student-sidebar">
        {/* BRAND */}
        <div className="student-sidebar-brand">
          <div className="sidebar-brand-mark">D</div>

          <div className="sidebar-brand-name">DPCADME</div>
        </div>

        {/* NAVIGATION */}
        <nav className="student-navigation">
          <p className="navigation-label">WORKSPACE</p>

          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `student-nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-icon">{item.icon}</span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* SIDEBAR BOTTOM */}
        <div className="student-sidebar-bottom">
          <div className="sidebar-divider"></div>

          <button
            className="sidebar-user"
            type="button"
            onClick={handleProfileClick}
            aria-label="Open my profile"
          >
            <div className="sidebar-user-avatar">{userInitial}</div>

            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{userName}</span>

              <span className="sidebar-user-role">{userRole}</span>
            </div>
          </button>

          <button
            className="sidebar-logout"
            type="button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="student-main">
        {/* TOP BAR */}
        <header className="student-topbar">
          <div className="mobile-brand">
            <div className="mobile-brand-mark">D</div>

            <span>DPCADME</span>
          </div>

          <div className="topbar-right">
            <button
              className="topbar-user"
              type="button"
              onClick={handleProfileClick}
              aria-label="Open my profile"
            >
              <div className="topbar-avatar">{userInitial}</div>

              <div className="topbar-user-text">
                <span>{userName}</span>

                <small>{userRole}</small>
              </div>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="student-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
