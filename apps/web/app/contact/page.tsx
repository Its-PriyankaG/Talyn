"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

/* ─── Icons ─── */
const IcoBack = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M13 8H3M7 4l-4 4 4 4"/>
  </svg>
);
const IcoUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IcoMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);
const IcoArrow = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 8h10M9 4l4 4-4 4"/>
  </svg>
);
const IcoSparkles = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
    <path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75z" opacity="0.4"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round">
    <path d="M2 6l3 3 5-5"/>
  </svg>
);

export default function ContactPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const verificationId = searchParams.get("verification_id");

  const [displayName, setDisplayName] = useState("");
  const [email,       setEmail]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [focusedName, setFocusedName] = useState(false);
  const [focusedMail, setFocusedMail] = useState(false);

  if (!verificationId) { router.push("/"); return null; }

  const canContinue = !!displayName.trim() && !!email.trim() && !loading;

  const handleContinue = async () => {
    if (!canContinue) return;
    setLoading(true); setError(null);
    try {
      const res  = await fetch("http://localhost:8001/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verification_id: verificationId, display_name: displayName, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create session");
      router.push(`/resume?session_id=${data.session_id}`);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
  const rise = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
  };

  return (
    <>
      <style>{`
        .cp-page {
          min-height: 100vh;
          background: var(--bg);
          font-family: var(--font-body);
          position: relative;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 24px;
          overflow: hidden;
        }
        .cp-wrap {
          position: relative; z-index: 2;
          max-width: 520px; width: 100%;
          display: flex; flex-direction: column;
          align-items: center; gap: 24px;
          text-align: center;
        }

        /* ── Logo ── */
        .cp-logo {
          font-family: var(--font-display);
          font-weight: 700; font-style: normal;
          font-size: clamp(44px, 8vw, 68px);
          line-height: 1; letter-spacing: -0.03em;
          background: linear-gradient(180deg, #ffffff 0%, #ffffff 45%, rgba(255,255,255,0.48) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          filter: drop-shadow(0 0 24px rgba(255,255,255,0.07));
          user-select: none;
        }
        .cp-logo-rule {
          width: 64px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
        }
        .cp-subtitle {
          font-size: 13px; font-weight: 300;
          color: rgba(200,215,235,0.50); letter-spacing: 0.01em;
        }

        /* ── Step indicator ── */
        .cp-step-row {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.16em; text-transform: uppercase;
        }
        .cp-step-dot {
          width: 20px; height: 20px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px;
        }
        .cp-step-done   { background: rgba(34,211,238,0.12); border: 1px solid rgba(34,211,238,0.35); color: #22d3ee; }
        .cp-step-active { background: rgba(34,211,238,0.07); border: 1px solid rgba(34,211,238,0.28); color: rgba(34,211,238,0.80); box-shadow: 0 0 10px rgba(34,211,238,0.15); }
        .cp-step-idle   { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(150,170,200,0.30); }
        .cp-step-line   { flex: 1; height: 1px; background: rgba(255,255,255,0.07); max-width: 28px; }
        .cp-step-line-done { background: linear-gradient(90deg, rgba(34,211,238,0.40), rgba(34,211,238,0.15)); }
        .cp-step-text-active { color: rgba(34,211,238,0.70); }
        .cp-step-text-done   { color: rgba(34,211,238,0.45); }
        .cp-step-text-idle   { color: rgba(140,160,190,0.30); }

        /* ── Console ── */
        .cp-console {
          width: 100%;
          border-radius: 32px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.40);
          backdrop-filter: blur(50px);
          -webkit-backdrop-filter: blur(50px);
          box-shadow: 0 25px 60px rgba(0,0,0,0.50), 0 1px 0 rgba(255,255,255,0.06) inset;
          position: relative; overflow: hidden;
        }
        .cp-console::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 30%, rgba(34,211,238,0.14) 50%, rgba(255,255,255,0.12) 70%, transparent 100%);
          pointer-events: none;
        }
        .cp-console-inner {
          padding: 28px 28px 28px;
          display: flex; flex-direction: column; gap: 20px;
          position: relative;
        }

        /* ── Back button ── */
        .cp-back {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(140,160,200,0.40);
          cursor: pointer; border: none; background: none; padding: 0;
          transition: color 0.2s ease;
          align-self: flex-start;
        }
        .cp-back:hover { color: rgba(200,215,235,0.75); }

        /* ── Field label ── */
        .cp-field-label {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(140,160,200,0.38); margin-bottom: 8px;
          display: flex; align-items: center; gap: 7px;
        }
        .cp-field-label-icon { color: rgba(34,211,238,0.45); }

        /* ── Input ── */
        .cp-input-wrap { position: relative; }
        .cp-input {
          width: 100%; padding: 13px 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          font-family: var(--font-body); font-size: 14px; font-weight: 400;
          color: var(--text-primary); outline: none;
          transition: border-color 0.24s ease, background 0.24s ease, box-shadow 0.24s ease;
        }
        .cp-input::placeholder { color: rgba(140,160,200,0.28); font-size: 13px; }
        .cp-input:focus {
          border-color: rgba(34,211,238,0.30);
          background: rgba(34,211,238,0.03);
          box-shadow: 0 0 0 3px rgba(34,211,238,0.05);
        }
        .cp-input.filled { border-color: rgba(34,211,238,0.22); }

        /* ── Divider ── */
        .cp-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
        }

        /* ── Verification info strip ── */
        .cp-verify-strip {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 12px;
          background: rgba(34,211,238,0.05);
          border: 1px solid rgba(34,211,238,0.14);
        }
        .cp-verify-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
          background: #22d3ee; box-shadow: 0 0 7px rgba(34,211,238,0.70);
          animation: cpPulse 2.4s ease-in-out infinite;
        }
        @keyframes cpPulse {
          0%,100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.4); }
        }
        .cp-verify-text {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(34,211,238,0.60);
        }
        .cp-verify-id {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: 0.10em; color: rgba(34,211,238,0.85);
          margin-left: auto;
        }

        /* ── Continue button ── */
        .cp-btn {
          width: 100%; padding: 15px; border-radius: 16px;
          border: none; cursor: pointer;
          font-family: var(--font-body); font-size: 14px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          transition: all 0.28s ease;
        }
        .cp-btn:not(:disabled) {
          background: linear-gradient(135deg, rgba(34,211,238,0.18) 0%, rgba(8,145,178,0.15) 100%);
          border: 1px solid rgba(34,211,238,0.35);
          color: rgba(34,211,238,0.95);
          box-shadow: 0 4px 24px rgba(34,211,238,0.12), 0 0 0 1px rgba(34,211,238,0.08) inset;
        }
        .cp-btn:not(:disabled):hover {
          background: linear-gradient(135deg, rgba(34,211,238,0.26) 0%, rgba(8,145,178,0.22) 100%);
          border-color: rgba(34,211,238,0.52);
          box-shadow: 0 6px 32px rgba(34,211,238,0.22), 0 0 0 1px rgba(34,211,238,0.12) inset;
          transform: translateY(-2px);
        }
        .cp-btn:disabled {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(160,175,200,0.28); cursor: not-allowed;
        }

        /* ── Error ── */
        .cp-error {
          border-radius: 12px; padding: 12px 16px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.18);
          font-size: 13px; color: rgba(252,165,165,0.85); text-align: center;
        }

        @keyframes cpSpin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="cp-page">
        <div className="talyn-glow-1" />
        <div className="talyn-glow-2" />

        <motion.div
          className="cp-wrap"
          variants={stagger}
          initial="hidden"
          animate="show"
        >

          {/* ── Logo ── */}
          <motion.div variants={rise} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <h1 className="cp-logo">Talyn</h1>
            <div className="cp-logo-rule" />
            <p className="cp-subtitle">Candidate Details — Step 2 of 3</p>
          </motion.div>

          {/* ── Badge ── */}
          <motion.div variants={rise}>
            <span className="talyn-badge">
              <span className="talyn-badge-dot" />
              <IcoSparkles />
              AI Hiring Platform
            </span>
          </motion.div>

          {/* ── Step indicator ── */}
          <motion.div variants={rise}>
            <div className="cp-step-row">
              <div className="cp-step-dot cp-step-done"><IcoCheck /></div>
              <span className="cp-step-text-done">Identity</span>
              <div className="cp-step-line cp-step-line-done" />
              <div className="cp-step-dot cp-step-active">2</div>
              <span className="cp-step-text-active">Details</span>
              <div className="cp-step-line" />
              <div className="cp-step-dot cp-step-idle">3</div>
              <span className="cp-step-text-idle">Resume</span>
            </div>
          </motion.div>

          {/* ── Console ── */}
          <motion.div variants={rise} style={{ width: "100%" }}>
            <div className="cp-console">
              <div className="cp-console-inner">

                {/* Back */}
                <button className="cp-back" onClick={() => router.back()}>
                  <IcoBack /> Back
                </button>

                {/* Verification strip */}
                <div className="cp-verify-strip">
                  <div className="cp-verify-dot" />
                  <span className="cp-verify-text">Identity Verified</span>
                  <span className="cp-verify-id">{verificationId}</span>
                </div>

                <div className="cp-divider" />

                {/* Name field */}
                <div>
                  <p className="cp-field-label">
                    <span className="cp-field-label-icon"><IcoUser /></span>
                    Full Name
                  </p>
                  <div className="cp-input-wrap">
                    <input
                      type="text"
                      className={`cp-input ${displayName ? "filled" : ""}`}
                      placeholder="Enter your full name"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      onFocus={() => setFocusedName(true)}
                      onBlur={() => setFocusedName(false)}
                    />
                  </div>
                </div>

                {/* Email field */}
                <div>
                  <p className="cp-field-label">
                    <span className="cp-field-label-icon"><IcoMail /></span>
                    Email Address
                  </p>
                  <div className="cp-input-wrap">
                    <input
                      type="email"
                      className={`cp-input ${email ? "filled" : ""}`}
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocusedMail(true)}
                      onBlur={() => setFocusedMail(false)}
                      onKeyDown={e => e.key === "Enter" && handleContinue()}
                    />
                  </div>
                </div>

                <div className="cp-divider" />

                {/* Continue */}
                <button className="cp-btn" onClick={handleContinue} disabled={!canContinue}>
                  {loading
                    ? <><Loader2 size={15} style={{ animation: "cpSpin 1s linear infinite" }} />Creating session…</>
                    : <>Continue to Resume Upload <IcoArrow /></>
                  }
                </button>

                {error && <div className="cp-error">{error}</div>}

              </div>
            </div>
          </motion.div>

          {/* ── Footer ── */}
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