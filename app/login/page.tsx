"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const S = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "var(--font-body, 'Manrope', sans-serif)",
  } as React.CSSProperties,

  left: {
    flex: "0 0 42%",
    background: "linear-gradient(145deg, #0f0f1a 0%, #1a1040 55%, #0d1b2a 100%)",
    padding: "48px 52px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
  } as React.CSSProperties,

  leftInner: { display: "flex", flexDirection: "column" as const, gap: "40px" } as React.CSSProperties,
  logoRow: { display: "flex", alignItems: "center", gap: "12px" } as React.CSSProperties,
  logoBox: {
    width: 44, height: 44, borderRadius: 10,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
  } as React.CSSProperties,
  brandName: {
    fontSize: 22, fontWeight: 700, color: "#fff",
    fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)", margin: 0,
  } as React.CSSProperties,
  headline: {
    color: "#fff", fontSize: 34, fontWeight: 700, lineHeight: 1.25,
    fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)", margin: 0,
  } as React.CSSProperties,
  subheadline: { color: "#94a3b8", fontSize: 15, lineHeight: 1.6, margin: "12px 0 0" } as React.CSSProperties,
  featureList: { display: "flex", flexDirection: "column" as const, gap: 14 } as React.CSSProperties,
  featureItem: { display: "flex", alignItems: "flex-start", gap: 12 } as React.CSSProperties,
  featureDot: {
    width: 7, height: 7, borderRadius: "50%", background: "#6366f1",
    marginTop: 7, flexShrink: 0,
  } as React.CSSProperties,
  featureText: { color: "#cbd5e1", fontSize: 14 } as React.CSSProperties,
  leftFooter: { color: "#475569", fontSize: 12 } as React.CSSProperties,

  right: {
    flex: 1, background: "#f8fafc",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px",
  } as React.CSSProperties,

  card: {
    width: "100%", maxWidth: 420, background: "#fff", borderRadius: 16,
    padding: "40px 36px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0",
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

  field: { marginBottom: 18 } as React.CSSProperties,
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 } as React.CSSProperties,
  input: {
    width: "100%", padding: "10px 13px", borderRadius: 8, border: "1.5px solid #e2e8f0",
    fontSize: 14, color: "#0f172a", background: "#fff", outline: "none",
    boxSizing: "border-box" as const, transition: "border-color 0.15s",
  } as React.CSSProperties,

  errorBox: {
    background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8,
    padding: "10px 13px", fontSize: 13, color: "#dc2626", marginBottom: 16,
  } as React.CSSProperties,
  infoBox: {
    background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8,
    padding: "10px 13px", fontSize: 13, color: "#1d4ed8", marginBottom: 16,
  } as React.CSSProperties,

  submitBtn: {
    width: "100%", padding: "11px 16px", borderRadius: 9, border: "none",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
    fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4, transition: "opacity 0.15s",
  } as React.CSSProperties,

  switchRow: { textAlign: "center" as const, marginTop: 22, fontSize: 13, color: "#64748b" } as React.CSSProperties,
  switchLink: { color: "#6366f1", fontWeight: 600, textDecoration: "none" } as React.CSSProperties,
  resendBtn: {
    background: "none", border: "none", color: "#6366f1", fontWeight: 600,
    cursor: "pointer", fontSize: 13, padding: 0,
  } as React.CSSProperties,
};

const FEATURES = [
  "Real-time call transcription",
  "AI-powered reply suggestions",
  "Sentiment & intent analysis",
  "Knowledge base search",
  "Live call analytics",
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msLoading, setMsLoading] = useState(false);

  async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null); setInfo(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      if (authError.message.toLowerCase().includes("email not confirmed") ||
          authError.message.toLowerCase().includes("not confirmed")) {
        setError("Your email is not verified yet. Please check your inbox and click the verification link.");
      } else if (authError.message.toLowerCase().includes("invalid login credentials")) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(authError.message);
      }
      setLoading(false); return;
    }

    if (!data.user?.email_confirmed_at) {
      setError("Your account is not verified. Please check your email for the verification link.");
      await supabase.auth.signOut();
      setLoading(false); return;
    }

    router.push("/"); router.refresh();
  }

  async function handleMicrosoftLogin() {
    setMsLoading(true); setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: { scopes: "email openid profile", redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) { setError(oauthError.message); setMsLoading(false); }
  }

  async function resendVerification() {
    if (!email) { setError("Enter your email address above, then click resend."); return; }
    setInfo(null);
    const { error: resendError } = await supabase.auth.resend({ type: "signup", email });
    if (resendError) { setError(resendError.message); }
    else { setInfo("Verification email resent. Please check your inbox."); }
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
            <p style={S.headline}>Your intelligent call center platform</p>
            <p style={S.subheadline}>Empower your agents with real-time AI assistance, live transcription, and smart knowledge retrieval.</p>
          </div>
          <div style={S.featureList}>
            {FEATURES.map((f) => (
              <div key={f} style={S.featureItem}>
                <div style={S.featureDot} />
                <span style={S.featureText}>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={S.leftFooter}>© 2025 BrightSuite · Agent Intelligence Platform</p>
      </div>

      <div style={S.right}>
        <div style={S.card}>
          <h2 style={S.cardTitle}>Welcome back</h2>
          <p style={S.cardSub}>Sign in to your agent dashboard</p>

          <button onClick={handleMicrosoftLogin} disabled={msLoading} style={{ ...S.msBtn, opacity: msLoading ? 0.6 : 1 }}>
            <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
              <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#00a4ef"/>
              <rect x="1" y="11" width="9" height="9" fill="#00b04f"/>
              <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
            </svg>
            {msLoading ? "Redirecting…" : "Continue with Microsoft"}
          </button>

          <div style={S.dividerRow}>
            <div style={S.dividerLine} />
            <span style={S.dividerLabel}>or sign in with email</span>
            <div style={S.dividerLine} />
          </div>

          <form onSubmit={handleEmailLogin}>
            <div style={S.field}>
              <label style={S.label}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@company.com" required style={S.input}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")} />
            </div>
            <div style={S.field}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ ...S.label, marginBottom: 0 }}>Password</label>
                <a href="/forgot-password" style={{ fontSize: 12, color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>Forgot password?</a>
              </div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required style={S.input}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")} />
            </div>

            {error && (
              <div style={S.errorBox}>
                {error}
                {error.toLowerCase().includes("verif") && (
                  <> <button type="button" onClick={resendVerification} style={S.resendBtn}>Resend email</button></>
                )}
              </div>
            )}
            {info && <div style={S.infoBox}>{info}</div>}

            <button type="submit" disabled={loading} style={{ ...S.submitBtn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p style={S.switchRow}>
            Don&apos;t have an account?{" "}
            <a href="/register" style={S.switchLink}>Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}
