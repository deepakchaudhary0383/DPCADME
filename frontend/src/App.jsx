import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import StudentLayout from "./layouts/StudentLayout";
import Dashboard from "./pages/student/Dashboard";
import AlumniDirectory from "./pages/student/AlumniDirectory";
import AlumniProfile from "./pages/student/AlumniProfile";
import Connections from "./pages/student/Connections";
import Profile from "./pages/student/Profile";

import AlumniLayout from "./layouts/AlumniLayout";
import AlumniDashboard from "./pages/alumni/Dashboard";
import AlumniRequests from "./pages/alumni/Requests";
import AlumniConnections from "./pages/alumni/Connections";
import AlumniProfilePage from "./pages/alumni/Profile";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Students from "./pages/admin/Students";
import AdminAlumni from "./pages/admin/Alumni";
import AdminProfile from "./pages/admin/Profile";

function AlumniPlaceholder({ title }) {
  return (
    <div style={{ padding: "10px 0" }}>
      <p
        style={{
          margin: "0 0 10px",
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "0.15em",
          color: "#68736b",
        }}
      >
        ALUMNI
      </p>

      <h1
        style={{
          margin: 0,
          fontFamily: "Manrope, sans-serif",
          fontSize: "36px",
          fontWeight: "600",
          letterSpacing: "-0.04em",
          color: "#17211b",
        }}
      >
        {title}
      </h1>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            AUTHENTICATION
           ========================= */}

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* =========================
            STUDENT APPLICATION
           ========================= */}

        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />

          <Route path="alumni" element={<AlumniDirectory />} />

          <Route path="alumni/:id" element={<AlumniProfile />} />

          <Route path="connections" element={<Connections />} />

          <Route path="profile" element={<Profile />} />
        </Route>

        {/* =========================
            ALUMNI APPLICATION
           ========================= */}

        <Route path="/alumni" element={<AlumniLayout />}>
          <Route index element={<Navigate to="/alumni/dashboard" replace />} />

          <Route path="dashboard" element={<AlumniDashboard />} />

          {/* REAL REQUESTS PAGE */}
          <Route path="requests" element={<AlumniRequests />} />

          {/* Temporary pages */}
          <Route path="connections" element={<AlumniConnections />} />

          <Route path="profile" element={<AlumniProfilePage />} />
        </Route>

        {/* =========================
            ADMIN APPLICATION
           ========================= */}

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />

          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="alumni" element={<AdminAlumni />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* =========================
            UNKNOWN ROUTES
           ========================= */}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
