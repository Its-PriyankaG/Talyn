"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

/* ─── Icons ─── */
const IcoCopy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M3 8l4 4 6-6"/>
  </svg>
);
const IcoHome = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IcoSparkles = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
    <path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75z" opacity="0.4"/>
  </svg>
);

export default function ResultsPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const referenceId  = searchParams.get("ref");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!referenceId) return;
    await navigator.clipboard.writeText(referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.10 } } };
  const rise = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
  };

  return (
    <>
      <style>{`
        .res-page {
          min-height: 100vh;
          background: var(--bg);
          font-family: var(--font-body);
          position: relative;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 24px;
          overflow: hidden;
        }
        .res-wrap {
          position: relative; z-index: 2;
          max-width: 520px; width: 100%;
          display: flex; flex-direction: column;
          align-items: center; gap: 28px;
          text-align: center;
        }

        /* ── Success ring ── */
        .res-ring {
          width: 80px; height: 80px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(34,211,238,0.08);
          border: 1px solid rgba(34,211,238,0.25);
          box-shadow: 0 0 40px rgba(34,211,238,0.12), 0 0 80px rgba(34,211,238,0.06);
          position: relative;
        }
        .res-ring::before {
          content: '';
          position: absolute; inset: -6px; border-radius: 50%;
          border: 1px solid rgba(34,211,238,0.10);
        }
        .res-ring-icon {
          color: #22d3ee;
        }

        /* ── Logo ── */
        .res-logo {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(42px, 8vw, 64px);
          line-height: 1; letter-spacing: -0.03em;
          background: linear-gradient(180deg, #ffffff 0%, #ffffff 45%, rgba(255,255,255,0.48) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          filter: drop-shadow(0 0 24px rgba(255,255,255,0.07));
          user-select: none;
        }
        .res-logo-rule {
          width: 64px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
        }

        /* ── Headline ── */
        .res-title {
          font-family: var(--font-display);
          font-weight: 700; font-size: clamp(22px, 4vw, 30px);
          letter-spacing: -0.02em; color: var(--text-primary); line-height: 1.15;
        }
        .res-subtitle {
          font-size: 14px; font-weight: 300;
          color: rgba(200,215,235,0.52);
          line-height: 1.7; max-width: 380px;
        }

        /* ── Console ── */
        .res-console {
          width: 100%;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.40);
          backdrop-filter: blur(50px);
          -webkit-backdrop-filter: blur(50px);
          box-shadow: 0 25px 60px rgba(0,0,0,0.50), 0 1px 0 rgba(255,255,255,0.06) inset;
          position: relative; overflow: hidden;
        }
        .res-console::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 30%, rgba(34,211,238,0.14) 50%, rgba(255,255,255,0.12) 70%, transparent 100%);
          pointer-events: none;
        }
        .res-console-inner {
          padding: 28px;
          display: flex; flex-direction: column; gap: 16px;
          position: relative;
        }

        /* ── Ref ID block ── */
        .res-ref-label {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(140,160,200,0.38); margin-bottom: 4px;
        }
        .res-ref-row {
          display: flex; align-items: center; gap: 10px;
        }
        .res-ref-box {
          flex: 1; padding: 14px 18px; border-radius: 14px;
          background: rgba(34,211,238,0.05);
          border: 1px solid rgba(34,211,238,0.18);
          font-family: var(--font-mono);
          font-size: clamp(18px, 4vw, 26px);
          font-weight: 400; letter-spacing: 0.12em;
          color: #22d3ee;
          text-align: center;
          box-shadow: 0 0 28px rgba(34,211,238,0.06) inset;
        }
        .res-copy-btn {
          width: 50px; height: 50px; border-radius: 14px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; border: none;
          transition: all 0.25s ease;
        }
        .res-copy-btn-idle {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(140,160,200,0.50);
        }
        .res-copy-btn-idle:hover {
          background: rgba(34,211,238,0.08);
          border-color: rgba(34,211,238,0.25);
          color: #22d3ee;
        }
        .res-copy-btn-done {
          background: rgba(52,211,153,0.10);
          border: 1px solid rgba(52,211,153,0.28);
          color: #34d399;
        }
        .res-hint {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(140,160,200,0.28); text-align: center;
        }

        /* ── Divider ── */
        .res-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
        }

        /* ── Congrats strip ── */
        .res-congrats {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px; border-radius: 12px;
          background: rgba(52,211,153,0.05);
          border: 1px solid rgba(52,211,153,0.14);
        }
        .res-congrats-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
          background: #34d399; box-shadow: 0 0 8px rgba(52,211,153,0.65);
          animation: resPulse 2.4s ease-in-out infinite;
        }
        @keyframes resPulse {
          0%,100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.4); }
        }
        .res-congrats-text {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(52,211,153,0.65);
        }

        /* ── Home button ── */
        .res-home-btn {
          width: 100%; padding: 14px; border-radius: 14px;
          cursor: pointer; border: none;
          font-family: var(--font-body); font-size: 14px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(200,215,235,0.65);
          transition: all 0.25s ease;
        }
        .res-home-btn:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.14);
          color: rgba(220,230,250,0.85);
          transform: translateY(-1px);
        }
      `}</style>

      <div className="res-page">
        <div className="talyn-glow-1" />
        <div className="talyn-glow-2" />

        <motion.div
          className="res-wrap"
          variants={stagger}
          initial="hidden"
          animate="show"
        >

          {/* ── Success ring ── */}
          <motion.div variants={rise}>
            <div className="res-ring">
              <div className="res-ring-icon">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
            </div>
          </motion.div>

          {/* ── Logo ── */}
          <motion.div variants={rise} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <h1 className="res-logo">Talyn</h1>
            <div className="res-logo-rule" />
          </motion.div>

          {/* ── Badge ── */}
          <motion.div variants={rise}>
            <span className="talyn-badge">
              <span className="talyn-badge-dot" />
              <IcoSparkles />
              AI Hiring Platform
            </span>
          </motion.div>

          {/* ── Title ── */}
          <motion.div variants={rise} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <h2 className="res-title">Interview Complete</h2>
            <p className="res-subtitle">
              Thank you for completing your Talyn AI Interview. Your responses have been recorded and sent for evaluation.
            </p>
          </motion.div>

          {/* ── Console ── */}
          {referenceId && (
            <motion.div variants={rise} style={{ width: "100%" }}>
              <div className="res-console">
                <div className="res-console-inner">

                  {/* Congrats strip */}
                  <div className="res-congrats">
                    <div className="res-congrats-dot" />
                    <span className="res-congrats-text">Responses saved · Evaluation in progress</span>
                  </div>

                  <div className="res-divider" />

                  {/* Reference ID */}
                  <p className="res-ref-label">Your Reference ID</p>
                  <div className="res-ref-row">
                    <div className="res-ref-box">{referenceId}</div>
                    <button
                      className={`res-copy-btn ${copied ? "res-copy-btn-done" : "res-copy-btn-idle"}`}
                      onClick={copyToClipboard}
                      title={copied ? "Copied!" : "Copy to clipboard"}
                    >
                      {copied ? <IcoCheck /> : <IcoCopy />}
                    </button>
                  </div>
                  <p className="res-hint">Save this ID — share it with HR to track your result</p>

                  <div className="res-divider" />

                  {/* Home */}
                  <button className="res-home-btn" onClick={() => router.push("/")}>
                    <IcoHome /> Return Home
                  </button>

                </div>
              </div>
            </motion.div>
          )}

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