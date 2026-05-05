"use client";

import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

const DEPARTMENTS = ["Billing", "Technical Support", "Sales", "General", "Customer Success"];

const S = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "var(--font-body, 'Manrope', sans-serif)" } as React.CSSProperties,
  left: {
    flex: "0 0 42%", background: "linear-gradient(145deg, #0f0f1a 0%, #1a1040 55%, #0d1b2a 100%)",
    padding: "48px 52px", display: "flex", flexDirection: "column" as const, justifyContent: "space-between",
  } as React.CSSProperties,
  leftInner: { display: "flex", flexDirection: "column" as const, gap: "40px" } as React.CSSProperties,
  logoRow: { display: "flex", alignItems: "center", gap: "12px" } as React.CSSProperties,
  logoBox: {
    width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
  } as React.CSSProperties,
  brandName: {
    fontSize: 22, fontWeight: 700, color: "#fff",
    fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)", margin: 0,
  } as React.CSSProperties,
  headline: {
    color: "#fff", fontSize: 32, fontWeight: 700, lineHeight: 1.25,
    fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)", margin: 0,
  } as React.CSSProperties,
  subheadline: { color: "#94a3b8", fontSize: 15, lineHeight: 1.6, margin: "12px 0 0" } as React.CSSProperties,
  stepList: { display: "flex", flexDirection: "column" as const, gap: 18 } as React.CSSProperties,
  step: { display: "flex", gap: 14, alignItems: "flex-start" } as React.CSSProperties,
  stepNum: {
    width: 28, height: 28, borderRadius: "50%", background: "rgba(99,102,241,0.25)",
    border: "1.5px solid rgba(99,102,241,0.5)", color: "#a5b4fc", fontSize: 12, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  } as React.CSSProperties,
  stepText: { color: "#cbd5e1", fontSize: 14, paddingTop: 4 } as React.CSSProperties,
  leftFooter: { color: "#475569", fontSize: 12 } as React.CSSProperties,
  right: {
    flex: 1, background: "#f8fafc", display: "flex", alignItems: "flex-start",
    justifyContent: "center", padding: "40px 24px", overflowY: "auto", minHeight: "100vh",
  } as React.CSSProperties,
  card: {
    width: "100%", maxWidth: 440, background: "#fff", borderRadius: 16,
    padding: "40px 36px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", margin: "auto 0",
  } as React.CSSProperties,
  cardTitle: {
    fontSize: 26, fontWeight: 700, color: "#0f172a",
    fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)", margin: "0 0 6px",
  } as React.CSSProperties,
  cardSub: { fontSize: 14, color: "#64748b", margin: "0 0 28px" } as React.CSSProperties,
  msBtn: {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    padding: "11px 16px", border: "1.5px solid #e2e8f0", borderRadius: 9, background: "#fff",
    color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 22,
  } as React.CSSProperties,
  dividerRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 22 } as React.CSSProperties,
  dividerLine: { flex: 1, height: 1, background: "#e2e8f0" } as React.CSSProperties,
  dividerLabel: { fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" as const } as React.CSSProperties,
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 } as React.CSSProperties,
  field: { marginBottom: 18 } as React.CSSProperties,
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 } as React.CSSProperties,
  input: {
    width: "100%", padding: "10px 13px", borderRadius: 8, border: "1.5px solid #e2e8f0",
    fontSize: 14, color: "#0f172a", background: "#fff", outline: "none", boxSizing: "border-box" as const,
  } as React.CSSProperties,
  select: {
    width: "100%", padding: "10px 13px", borderRadius: 8, border: "1.5px solid #e2e8f0",
    fontSize: 14, color: "#0f172a", background: "#fff", outline: "none",
    boxSizing: "border-box" as const, appearance: "none" as const, cursor: "pointer",
  } as React.CSSProperties,
  hint: { fontSize: 11, color: "#94a3b8", marginTop: 5 } as React.CSSProperties,
  errorBox: {
    background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8,
    padding: "10px 13px", fontSize: 13, color: "#dc2626", marginBottom: 16,
  } as React.CSSProperties,
  successCard: { textAlign: "center" as const, padding: "20px 0 8px" } as React.CSSProperties,
  successIcon: {
    width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
  } as React.CSSProperties,
  successTitle: {
    fontSize: 22, fontWeight: 700, color: "#0f172a",
    fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)", margin: "0 0 10px",
  } as React.CSSProperties,
  successBody: { fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: "0 0 24px" } as React.CSSProperties,
  successEmail: { fontWeight: 700, color: "#0f172a" } as React.CSSProperties,
  submitBtn: {
    width: "100%", padding: "11px 16px", borderRadius: 9, border: "none",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
    fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4,
  } as React.CSSProperties,
  switchRow: { textAlign: "center" as const, marginTop: 22, fontSize: 13, color: "#64748b" } as React.CSSProperties,
  switchLink: { color: "#6366f1", fontWeight: 600, textDecoration: "none" } as React.CSSProperties,
  errorSignInBtn: {
    display: "inline-block", padding: "7px 14px", borderRadius: 7, background: "#dc2626",
    color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none",
  } as React.CSSProperties,
};

const STEPS = [
  "Fill in your details and create a password",
  "Check your email for a verification link",
  "Click the link to activate your account",
  "Sign in and start using the dashboard",
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msLoading, setMsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false); return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { name, department },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
      setError("This email is already registered. Please sign in with your credentials.");
      setLoading(false); return;
    }

    setRegistered(true); setLoading(false);
  }

  async function handleMicrosoftRegister() {
    setMsLoading(true); setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: { scopes: "email openid profile", redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) { setError(oauthError.message); setMsLoading(false); }
  }

  return (
    <div style={S.page}>
      <div style={S.left}>
        <div style={S.leftInner}>
          <div style={S.logoRow}>
            <div style={S.logoBox}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12 C3 7 7.5 3 12 3 C16.5 3 21 7 21 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M12 3 L12 21" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="3" fill="#fff"/>
              </svg>
            </div>
            <h1 style={S.brandName}>BrightSuite</h1>
          </div>
          <div>
            <p style={S.headline}>Join your team on BrightSuite</p>
            <p style={S.subheadline}>Create your agent account to access the intelligent call center dashboard.</p>
          </div>
          <div style={S.stepList}>
            {STEPS.map((s, i) => (
              <div key={i} style={S.step}>
                <div style={S.stepNum}>{i + 1}</div>
                <span style={S.stepText}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={S.leftFooter}>© 2025 BrightSuite · Agent Intelligence Platform</p>
      </div>

      <div style={S.right}>
        <div style={S.card}>
          {registered ? (
            <div style={S.successCard}>
              <div style={S.successIcon}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6 L9 17 L4 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={S.successTitle}>Check your email</h2>
              <p style={S.successBody}>
                We sent a verification link to <span style={S.successEmail}>{email}</span>.<br/>
                Click the link to activate your account, then sign in.
              </p>
              <a href="/login" style={{ ...S.submitBtn, display: "block", textAlign: "center", textDecoration: "none" }}>
                Go to Sign In
              </a>
            </div>
          ) : (
            <>
              <h2 style={S.cardTitle}>Create your account</h2>
              <p style={S.cardSub}>Register as a BrightSuite agent</p>

              <button onClick={handleMicrosoftRegister} disabled={msLoading} style={{ ...S.msBtn, opacity: msLoading ? 0.6 : 1 }}>
                <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#00a4ef"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00b04f"/>
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                </svg>
                {msLoading ? "Redirecting…" : "Sign up with Microsoft"}
              </button>

              <div style={S.dividerRow}>
                <div style={S.dividerLine} />
                <span style={S.dividerLabel}>or register with email</span>
                <div style={S.dividerLine} />
              </div>

              <form onSubmit={handleRegister}>
                <div style={S.row2}>
                  <div>
                    <label style={S.label}>Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith" required minLength={2} style={S.input}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")} />
                  </div>
                  <div>
                    <label style={S.label}>Department</label>
                    <select value={department} onChange={(e) => setDepartment(e.target.value)}
                      required style={S.select}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}>
                      <option value="" disabled>Select…</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div style={S.field}>
                  <label style={S.label}>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="agent@company.com" required style={S.input}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")} />
                </div>

                <div style={S.field}>
                  <label style={S.label}>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" required minLength={8} style={S.input}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")} />
                  <p style={S.hint}>Minimum 8 characters</p>
                </div>

                {error && (
                  <div style={S.errorBox}>
                    {error}
                    {error.toLowerCase().includes("already registered") && (
                      <div style={{ marginTop: 10 }}>
                        <a href="/login" style={S.errorSignInBtn}>Sign in instead →</a>
                      </div>
                    )}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  style={{ ...S.submitBtn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                  {loading ? "Creating account…" : "Create account"}
                </button>
              </form>

              <p style={S.switchRow}>
                Already have an account?{" "}
                <a href="/login" style={S.switchLink}>Sign in</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
