"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const IcoSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);
const IcoArrow = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 8h10M9 4l4 4-4 4"/>
  </svg>
);
const IcoGrid = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1.5"/>
    <rect x="14" y="3" width="7" height="5" rx="1.5"/>
    <rect x="14" y="12" width="7" height="9" rx="1.5"/>
    <rect x="3" y="16" width="7" height="5" rx="1.5"/>
  </svg>
);
const IcoLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IcoShield = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IcoSparkles = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
    <path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75z" opacity="0.4"/>
  </svg>
);

const decisionColor = (d: string) => {
  const m: Record<string, string> = {
    HIRE: "#34d399", PROMISING: "#22d3ee", REVIEW: "#fbbf24", REJECT: "#fb7185",
  };
  return m[d?.toUpperCase()] ?? "#22d3ee";
};

export default function HRDashboard() {
  const [refId,          setRefId]          = useState("");
  const [focused,        setFocused]        = useState(false);
  const [authenticated,  setAuthenticated]  = useState(false);
  const [password,       setPassword]       = useState("");
  const [pwFocused,      setPwFocused]      = useState(false);
  const [error,          setError]          = useState("");
  const [recent, setRecent] = useState<any[]>([]);
  const router = useRouter();

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_HR_PASS) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  useEffect(() => {
    fetch("http://localhost:8006/evaluation/recent")
      .then(res => res.json())
      .then(setRecent)
      .catch(() => setRecent([]));
  }, []);

  const handleSearch = () => {
    if (!refId.trim()) return;
    router.push(`/hr/results/${refId.trim()}`);
  };

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
  const rise = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
  };

  /* ══════════════════════════════════
     AUTH SCREEN
  ══════════════════════════════════ */
  if (!authenticated) {
    return (
      <>
        <style>{`
          .auth-page {
            height: 100vh; overflow: hidden;
            background: var(--bg);
            font-family: var(--font-body);
            position: relative;
            display: flex; align-items: center; justify-content: center;
            padding: 0 24px;
          }
          .auth-wrap {
            position: relative; z-index: 2;
            width: 100%; max-width: 420px;
            display: flex; flex-direction: column;
            align-items: center; gap: 22px;
            text-align: center;
          }
          .auth-icon {
            width: 52px; height: 52px; border-radius: 16px;
            display: flex; align-items: center; justify-content: center;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            color: rgba(34,211,238,0.65);
            box-shadow: 0 0 28px rgba(34,211,238,0.07);
          }
          .auth-logo {
            font-family: var(--font-display);
            font-weight: 700; font-size: clamp(42px, 8vw, 64px);
            line-height: 1; letter-spacing: -0.03em;
            background: linear-gradient(180deg, #ffffff 0%, #ffffff 45%, rgba(255,255,255,0.48) 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
            user-select: none;
          }
          .auth-logo-rule {
            width: 56px; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          }
          .auth-subtitle {
            font-size: 13px; font-weight: 300;
            color: rgba(200,215,235,0.48); letter-spacing: 0.01em;
          }
          .auth-console {
            width: 100%;
            border-radius: 28px;
            border: 1px solid rgba(255,255,255,0.10);
            background: rgba(0,0,0,0.40);
            backdrop-filter: blur(50px);
            -webkit-backdrop-filter: blur(50px);
            box-shadow: 0 25px 60px rgba(0,0,0,0.50), 0 1px 0 rgba(255,255,255,0.06) inset;
            position: relative; overflow: hidden;
          }
          .auth-console::before {
            content: '';
            position: absolute; top: 0; left: 0; right: 0; height: 1px;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 30%, rgba(34,211,238,0.14) 50%, rgba(255,255,255,0.12) 70%, transparent 100%);
            pointer-events: none;
          }
          .auth-inner {
            padding: 28px;
            display: flex; flex-direction: column; gap: 16px;
            position: relative;
          }
          .auth-field-label {
            font-family: var(--font-mono); font-size: 9px;
            letter-spacing: 0.18em; text-transform: uppercase;
            color: rgba(200,215,235,0.45); margin-bottom: 8px;
            display: flex; align-items: center; gap: 7px;
          }
          .auth-label-icon { color: rgba(34,211,238,0.45); }
          .auth-input-wrap { position: relative; }
          .auth-input-icon {
            position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
            color: rgba(34,211,238,0.35); pointer-events: none;
            transition: color 0.22s ease;
          }
          .auth-input-wrap.focused .auth-input-icon { color: rgba(34,211,238,0.75); }
          .auth-input {
            width: 100%; padding: 13px 14px 13px 42px;
            border-radius: 14px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            font-family: var(--font-body); font-size: 14px;
            color: var(--text-primary); outline: none;
            transition: border-color 0.24s ease, background 0.24s ease, box-shadow 0.24s ease;
          }
          .auth-input::placeholder { color: rgba(200,215,235,0.30); font-size: 13px; }
          .auth-input:focus {
            border-color: rgba(34,211,238,0.30);
            background: rgba(34,211,238,0.03);
            box-shadow: 0 0 0 3px rgba(34,211,238,0.05);
          }
          .auth-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          }
          .auth-btn {
            width: 100%; padding: 14px; border-radius: 14px;
            border: none; cursor: pointer;
            font-family: var(--font-body); font-size: 14px; font-weight: 600;
            display: flex; align-items: center; justify-content: center; gap: 9px;
            background: linear-gradient(135deg, rgba(34,211,238,0.18) 0%, rgba(8,145,178,0.15) 100%);
            border: 1px solid rgba(34,211,238,0.35);
            color: rgba(34,211,238,0.95);
            box-shadow: 0 4px 24px rgba(34,211,238,0.12);
            transition: all 0.28s ease;
          }
          .auth-btn:hover {
            background: linear-gradient(135deg, rgba(34,211,238,0.26) 0%, rgba(8,145,178,0.22) 100%);
            border-color: rgba(34,211,238,0.52);
            box-shadow: 0 6px 32px rgba(34,211,238,0.22);
            transform: translateY(-2px);
          }
          .auth-error {
            border-radius: 12px; padding: 11px 14px;
            background: rgba(239,68,68,0.08);
            border: 1px solid rgba(239,68,68,0.18);
            font-family: var(--font-mono); font-size: 10px;
            letter-spacing: 0.10em; text-transform: uppercase;
            color: rgba(252,165,165,0.85); text-align: center;
          }
        `}</style>

        <div className="auth-page">
          <div className="talyn-glow-1" />
          <div className="talyn-glow-2" />

          <motion.div className="auth-wrap" variants={stagger} initial="hidden" animate="show">

            <motion.div variants={rise}>
              <div className="auth-icon"><IcoLock /></div>
            </motion.div>

            <motion.div variants={rise} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <h1 className="auth-logo">Talyn</h1>
              <div className="auth-logo-rule" />
              <p className="auth-subtitle">HR Access — Restricted</p>
            </motion.div>

            <motion.div variants={rise}>
              <span className="talyn-badge">
                <span className="talyn-badge-dot" />
                <IcoShield />
                Authorised Personnel Only
              </span>
            </motion.div>

            <motion.div variants={rise} style={{ width: "100%" }}>
              <div className="auth-console">
                <div className="auth-inner">
                  <div>
                    <p className="auth-field-label">
                      <span className="auth-label-icon"><IcoLock /></span>
                      Password
                    </p>
                    <div className={`auth-input-wrap ${pwFocused ? "focused" : ""}`}>
                      <div className="auth-input-icon"><IcoLock /></div>
                      <input
                        className="auth-input"
                        type="password"
                        placeholder="Enter HR password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onFocus={() => setPwFocused(true)}
                        onBlur={() => setPwFocused(false)}
                        onKeyDown={e => e.key === "Enter" && handleLogin()}
                      />
                    </div>
                  </div>
                  <div className="auth-divider" />
                  <button className="auth-btn" onClick={handleLogin}>
                    <IcoArrow /> Enter Dashboard
                  </button>
                  {error && <div className="auth-error">{error}</div>}
                </div>
              </div>
            </motion.div>

            <motion.div variants={rise} style={{ width: "100%" }}>
              <div className="talyn-footer" style={{ justifyContent: "center" }}>
                <div className="talyn-footer-line" />
                <span className="talyn-footer-text">Built by Priyanka for SWE1904</span>
                <div className="talyn-footer-line" />
              </div>
            </motion.div>

          </motion.div>
        </div>
      </>
    );
  }

  /* ══════════════════════════════════
     DASHBOARD SCREEN
  ══════════════════════════════════ */
  return (
    <>
      <style>{`
        .hr-dash-root {
          min-height: 100vh;
          background: var(--bg);
          font-family: var(--font-body);
          position: relative;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 24px 64px;
        }
        .hr-dash-wrap {
          position: relative; z-index: 2;
          width: 100%; max-width: 560px;
          display: flex; flex-direction: column;
          align-items: center; gap: 28px;
          text-align: center;
        }
        .hr-dash-icon {
          width: 56px; height: 56px; border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(34,211,238,0.75);
          box-shadow: 0 0 32px rgba(34,211,238,0.08);
        }
        .hr-dash-title {
          font-family: var(--font-display);
          font-weight: 700; font-size: clamp(36px, 7vw, 58px);
          letter-spacing: -0.03em; line-height: 1;
          background: linear-gradient(180deg, #ffffff 0%, #ffffff 45%, rgba(255,255,255,0.48) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hr-dash-sub {
          font-size: 14px; font-weight: 300;
          color: rgba(200,215,235,0.55); letter-spacing: 0.01em;
        }
        .hr-dash-console {
          width: 100%;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.40);
          backdrop-filter: blur(50px);
          -webkit-backdrop-filter: blur(50px);
          box-shadow: 0 25px 60px rgba(0,0,0,0.50), 0 1px 0 rgba(255,255,255,0.06) inset;
          position: relative; overflow: hidden;
          padding: 28px;
        }
        .hr-dash-console::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 30%, rgba(34,211,238,0.14) 50%, rgba(255,255,255,0.12) 70%, transparent 100%);
          pointer-events: none;
        }
        .hr-dash-console-inner { display: flex; flex-direction: column; gap: 16px; }
        .hr-dash-field-label {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(200,215,235,0.45); text-align: left; margin-bottom: 8px;
        }
        .hr-dash-input-row { display: flex; gap: 10px; }
        .hr-dash-input-wrap { flex: 1; position: relative; }
        .hr-dash-input-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: rgba(34,211,238,0.40); pointer-events: none; transition: color 0.25s ease;
        }
        .hr-dash-input-wrap.focused .hr-dash-input-icon { color: rgba(34,211,238,0.75); }
        .hr-dash-input {
          width: 100%; padding: 13px 14px 13px 42px; border-radius: 14px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
          font-family: var(--font-mono); font-size: 14px; letter-spacing: 0.08em;
          color: var(--text-primary); outline: none;
          transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
        }
        .hr-dash-input::placeholder { color: rgba(200,215,235,0.32); font-family: var(--font-body); font-size: 13px; letter-spacing: 0; }
        .hr-dash-input:focus { border-color: rgba(34,211,238,0.32); background: rgba(34,211,238,0.04); box-shadow: 0 0 0 3px rgba(34,211,238,0.06); }
        .hr-dash-btn {
          padding: 13px 20px; border-radius: 14px; border: none; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-body); font-size: 14px; font-weight: 600;
          transition: all 0.25s ease; white-space: nowrap;
          background: linear-gradient(135deg, rgba(34,211,238,0.16) 0%, rgba(8,145,178,0.14) 100%);
          border: 1px solid rgba(34,211,238,0.28);
          color: rgba(34,211,238,0.90); box-shadow: 0 4px 20px rgba(34,211,238,0.08);
        }
        .hr-dash-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(34,211,238,0.24) 0%, rgba(8,145,178,0.20) 100%);
          border-color: rgba(34,211,238,0.50); box-shadow: 0 6px 28px rgba(34,211,238,0.18);
          transform: translateY(-1px);
        }
        .hr-dash-btn:disabled { opacity: 0.30; cursor: not-allowed; }
        .hr-dash-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent); }
        .hr-dash-hint { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .hr-dash-hint-text {
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em;
          color: rgba(200,215,235,0.40); text-align: left;
        }
        .hr-dash-hint-example {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 999px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.10em;
          color: rgba(34,211,238,0.60); cursor: pointer; transition: all 0.2s ease;
        }
        .hr-dash-hint-example:hover { background: rgba(34,211,238,0.06); border-color: rgba(34,211,238,0.18); color: rgba(34,211,238,0.85); }

        /* ── Carousel ── */
        .hr-recent-section { width: 100%; text-align: left; }
        .hr-carousel-label {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(200,215,235,0.45); margin-bottom: 12px;
        }
        .hr-carousel {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: none;
        }
        .hr-carousel::-webkit-scrollbar { display: none; }

        .hr-card {
          min-width: 172px;
          padding: 14px 16px;
          border-radius: 16px;
          cursor: pointer;
          flex-shrink: 0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.22s ease;
          text-align: left;
        }
        .hr-card:hover {
          background: rgba(34,211,238,0.06);
          border-color: rgba(34,211,238,0.25);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }
        .hr-card-ref {
          font-family: var(--font-mono);
          font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          margin-bottom: 6px;
        }
        .hr-card-name {
          font-size: 14px; font-weight: 500;
          color: rgba(220,232,255,0.88);
          line-height: 1.3; margin-bottom: 10px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .hr-card-decision {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 8.5px; letter-spacing: 0.16em; text-transform: uppercase;
          padding: 3px 9px; border-radius: 999px;
          border: 1px solid currentColor;
          opacity: 0.85;
        }
        .hr-carousel-empty {
          font-family: var(--font-mono); font-size: 11px;
          color: rgba(200,215,235,0.35); letter-spacing: 0.08em;
          padding: 16px 0;
        }

        /* ── Footer ── */
        .hr-dash-footer {
          width: 100%;
          display: flex; align-items: center; gap: 16px;
          justify-content: center;
          padding-top: 8px;
        }
        .hr-dash-footer-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent);
        }
        .hr-dash-footer-text {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(200,215,235,0.38); white-space: nowrap;
        }
      `}</style>

      <div className="hr-dash-root">
        <div className="talyn-glow-1" />
        <div className="talyn-glow-2" />

        <motion.div className="hr-dash-wrap" variants={stagger} initial="hidden" animate="show">

          <motion.div variants={rise}>
            <div className="hr-dash-icon"><IcoGrid /></div>
          </motion.div>

          <motion.div variants={rise} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h1 className="hr-dash-title">HR Dashboard</h1>
            <div style={{ width: 72, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)", margin: "0 auto" }} />
            <p className="hr-dash-sub">Enter a candidate reference ID to pull their evaluation report</p>
          </motion.div>

          <motion.div variants={rise}>
            <span className="talyn-badge">
              <span className="talyn-badge-dot" />
              <IcoSparkles /> AI Hiring Platform
            </span>
          </motion.div>

          <motion.div variants={rise} style={{ width: "100%" }}>
            <div className="hr-dash-console">
              <div className="hr-dash-console-inner">
                <p className="hr-dash-field-label">Candidate Reference ID</p>
                <div className="hr-dash-input-row">
                  <div className={`hr-dash-input-wrap ${focused ? "focused" : ""}`}>
                    <div className="hr-dash-input-icon"><IcoSearch /></div>
                    <input
                      className="hr-dash-input"
                      value={refId}
                      onChange={e => setRefId(e.target.value.toUpperCase())}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      onKeyDown={e => e.key === "Enter" && handleSearch()}
                      placeholder="e.g. TALYN"
                    />
                  </div>
                  <button className="hr-dash-btn" onClick={handleSearch} disabled={!refId.trim()}>
                    <IcoArrow /> Search
                  </button>
                </div>
                <div className="hr-dash-divider" />
                <div className="hr-dash-hint">
                  <span className="hr-dash-hint-text">Reference IDs are generated at the end of each interview session</span>
                  <span className="hr-dash-hint-example" onClick={() => setRefId("TALYN")}>Try TALYN</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Recent Candidates ── */}
          <motion.div variants={rise} className="hr-recent-section">
            <p className="hr-carousel-label">Recent Candidates</p>
            <div className="hr-carousel">
              {recent.length === 0 ? (
                <p className="hr-carousel-empty">No recent interviews</p>
              ) : (
                recent.map((c, i) => {
                  const color = decisionColor(c.final_decision);
                  return (
                    <div key={i} className="hr-card" onClick={() => router.push(`/hr/results/${c.reference_id}`)}>
                      <p className="hr-card-ref" style={{ color: "rgba(200,215,235,0.45)" }}>{c.reference_id}</p>
                      <p className="hr-card-name">{c.name || c.candidate_name || "Unknown"}</p>
                      {c.final_decision && (
                        <span className="hr-card-decision" style={{ color, borderColor: `${color}40` }}>
                          {c.final_decision}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* ── Footer ── */}
          <motion.div variants={rise} className="hr-dash-footer">
            <div className="hr-dash-footer-line" />
            <span className="hr-dash-footer-text">Built by Priyanka for SWE1904</span>
            <div className="hr-dash-footer-line" />
          </motion.div>

        </motion.div>
      </div>
    </>
  );
}