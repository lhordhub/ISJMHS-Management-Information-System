import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import "./student_dashboard.css";

const MENU_ITEMS = [
  {
    key: "enrolment",
    label: "Enrolment",
    desc: "View and manage your enrolment status",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <path d="M9 13l2 2 4-4" />
      </svg>
    ),
  },
  {
    key: "cor",
    label: "COR",
    desc: "Certificate of Registration & schedule",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M9 13h6M9 17h6" />
      </svg>
    ),
  },
  {
    key: "grades",
    label: "Grades",
    desc: "Check your subject grades per term",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3.33 1.67 8.67 1.67 12 0v-5" />
      </svg>
    ),
  },
  {
    key: "billing",
    label: "Billing",
    desc: "View tuition fees and payment history",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
        <path d="M6 15h4" />
      </svg>
    ),
  },
  {
    key: "fines",
    label: "Fines",
    desc: "Outstanding fines and clearance status",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5" />
        <path d="M12 16h.01" />
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Profile",
    desc: "Personal information and account settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

const DRAWER_ICONS = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  ),
};

export default function StudentDashboard({ onNavigate, onLogout }) {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoadingProfile(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && profile) {
        setStudentName(profile.full_name);
      }
      setLoadingProfile(false);
    };

    fetchProfile();
  }, []);

  const firstName = studentName ? studentName.split(" ")[0] : "";

  const handleMenuClick = (key) => {
    setActiveKey(key);
    setDrawerOpen(false);
    if (onNavigate) onNavigate(key);
    // Backend wiring per section will be implemented later.
    console.log(`Navigate to: ${key}`);
  };

  const handleLogout = async () => {
    setDrawerOpen(false);
    await supabase.auth.signOut();
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <div className="smis-dash-root">
      {/* App bar */}
      <header className="smis-appbar">
        <div className="smis-appbar-left">
          <div className="smis-appbar-logo">
            <img src="/src/assets/school-logo.png" alt="School logo" />
          </div>
          <div className="smis-appbar-titles">
            <span className="smis-appbar-portal">Student Portal</span>
            <span className="smis-appbar-school">Isabel S.J. Gujol Memorial High School</span>
          </div>
        </div>

        <button
          className={`smis-hamburger${drawerOpen ? " open" : ""}`}
          onClick={() => setDrawerOpen((v) => !v)}
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          aria-expanded={drawerOpen}
        >
          <span className="smis-hamburger-bar" />
          <span className="smis-hamburger-bar" />
          <span className="smis-hamburger-bar" />
        </button>
      </header>

      {/* Drawer overlay + panel */}
      <div
        className={`smis-drawer-overlay${drawerOpen ? " open" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <nav className={`smis-drawer${drawerOpen ? " open" : ""}`} aria-label="Main navigation">
        <div className="smis-drawer-header">
          <div className="smis-drawer-user">{loadingProfile ? "Loading..." : studentName}</div>
          <div className="smis-drawer-role">Student</div>
        </div>

        <div className="smis-drawer-nav">
          <button
            className={`smis-drawer-link${activeKey === null ? " active" : ""}`}
            onClick={() => handleMenuClick(null)}
          >
            {DRAWER_ICONS.home}
            Dashboard
          </button>
          {MENU_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`smis-drawer-link${activeKey === item.key ? " active" : ""}`}
              onClick={() => handleMenuClick(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="smis-drawer-footer">
          <button className="smis-drawer-logout" onClick={handleLogout}>
            {DRAWER_ICONS.logout}
            Log out
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="smis-dash-main">
        <div className="smis-welcome">
          <div className="smis-welcome-eyebrow">Dashboard</div>
          <h1>{loadingProfile ? "Welcome back" : `Welcome back, ${firstName}`}</h1>
          <p>Here's a quick overview of your student services.</p>
        </div>

        <div className="smis-menu-grid">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.key}
              className="smis-menu-card"
              onClick={() => handleMenuClick(item.key)}
            >
              <span className="smis-menu-badge">Soon</span>
              <div className="smis-menu-icon">{item.icon}</div>
              <div>
                <div className="smis-menu-label">{item.label}</div>
                <div className="smis-menu-desc">{item.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}