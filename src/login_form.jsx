import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import "./login_form.css";

const ROLES = ["Student", "Faculty", "Admin"];

const ICONS = {
  Student: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3.33 1.67 8.67 1.67 12 0v-5" />
    </svg>
  ),
  Faculty: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M7 8h.01M12 8h.01M17 8h.01M7 12h10" />
    </svg>
  ),
  Admin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
};

const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

export default function LoginForm() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const idLabel = role === "Student" ? "Student ID" : role === "Faculty" ? "Employee ID" : "Admin Username";
  const idPlaceholder = role === "Student" ? "e.g. 2024-00001" : role === "Faculty" ? "e.g. FAC-00001" : "e.g. admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: look up the email + role tied to this ID/username
      const { data: lookup, error: lookupError } = await supabase
        .from("login_lookup")
        .select("email, role")
        .eq("school_id_number", identifier)
        .maybeSingle();

      if (lookupError || !lookup) {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      // Step 2: confirm the account's role matches the tab the user selected
      if (lookup.role !== role.toLowerCase()) {
        setError(`This ID is not registered as ${role}. Please select the correct account type.`);
        setLoading(false);
        return;
      }

      // Step 3: sign in with the resolved email + entered password
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: lookup.email,
        password,
      });

      if (signInError) {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      // Success — redirect to the correct dashboard based on the verified role
      setLoading(false);
      navigate(`/${lookup.role}/dashboard`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="smis-root">
      {/* Top banner on mobile, left panel on desktop — always visible, never hidden */}
      <div className="smis-panel">
        <div className="smis-panel-glow" />
        <div className="smis-panel-content">
          <div className="smis-seal">
            <img src="/src/assets/school-logo.png" alt="Isabel S.J. Gujol Memorial High School logo" className="smis-seal-img" />
          </div>
          <div className="smis-system-label">Portal</div>
          <div className="smis-school-name">Isabel S.J. Gujol Memorial High School</div>
          <div className="smis-school-meta">
            Alegria, Carmen, Bohol<br />
            School ID: 312301
          </div>
          <div className="smis-divider" />
          <div className="smis-system-sub">School Management Information System — secure access for students, faculty, and administrators.</div>
        </div>
      </div>

      {/* Form section */}
      <div className="smis-form-wrapper">
        <div className="smis-form-inner">
        <div className="smis-form-head">
          <h2>Welcome back</h2>
          <p>Sign in to your {role.toLowerCase()} account</p>
        </div>

        {/* Role Selector */}
        <div className="smis-role-group" role="group" aria-label="Select account type">
          {ROLES.map((r) => (
            <button
              key={r}
              className={`smis-role-btn${role === r ? " active" : ""}`}
              onClick={() => { setRole(r); setError(""); setIdentifier(""); }}
              type="button"
              aria-pressed={role === r}
            >
              {ICONS[r]}
              {r}
            </button>
          ))}
        </div>

        <form style={{ width: "100%" }} onSubmit={handleSubmit} noValidate>
          {/* Identifier Field */}
          <div className="smis-field">
            <label htmlFor="smis-id">{idLabel}</label>
            <div className="smis-input-wrap">
              <input
                id="smis-id"
                className="smis-input"
                type="text"
                placeholder={idPlaceholder}
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setError(""); }}
                autoComplete="username"
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>

          {/* Password Field */}
          <div className="smis-field">
            <label htmlFor="smis-pass">Password</label>
            <div className="smis-input-wrap">
              <input
                id="smis-pass"
                className="smis-input has-eye"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                autoComplete="current-password"
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <button
                type="button"
                className="smis-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="smis-error" role="alert">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <button className="smis-submit" type="submit" disabled={loading}>
            {loading ? (
              <><div className="smis-spinner" /> Signing in…</>
            ) : (
              <>Sign in as {role}</>
            )}
          </button>
        </form>

        <p className="smis-footer-text">
          Forgot your credentials? <span>Contact your administrator</span>
        </p>
        <p className="smis-footer-copyright">
          © {new Date().getFullYear()} Lord Vincent Y. Bonajos. All rights reserved.
        </p>
        </div>
      </div>
    </div>
  );
}