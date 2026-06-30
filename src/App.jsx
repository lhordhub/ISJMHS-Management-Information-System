import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./login_form.jsx";
import StudentDashboard from "./student_dashboard.jsx";

// Placeholder pages until faculty_dashboard.jsx and admin_dashboard.jsx are built
function ComingSoon({ label }) {
  return (
    <div style={{ padding: 48, fontFamily: "Inter, sans-serif", textAlign: "center" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#6b0012" }}>
        {label} Dashboard
      </h2>
      <p style={{ color: "#888", marginTop: 8 }}>This section hasn't been built yet.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/login" element={<LoginForm />} />

      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/faculty/dashboard" element={<ComingSoon label="Faculty" />} />
      <Route path="/admin/dashboard" element={<ComingSoon label="Admin" />} />

      {/* Fallback: unknown routes go back to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}