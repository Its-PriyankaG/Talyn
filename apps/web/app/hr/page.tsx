"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

export default function HRDashboard() {
  const [refId, setRefId]     = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    if (!refId.trim()) return;
    router.push(`/hr/results/${refId.trim()}`);
  };

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
  const rise = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
  };

  return (
    <>
      <style>{`
        .hr-dash-root {
          height: 100vh; overflow: hidden;
          background: var(--bg);
          font-family: var(--font-body);
          position: relative;
          display: flex; align-items: center; justify-content: center;
          padding: 0 24px;
        }
        .hr-dash-wrap {
          position: relative; z-index: 2;
          width: 100%; max-width: 560px;
          display: flex; flex-direction: column;
          align-items: center; gap: 28px;
          text-align: center;
        }

        /* Icon badge */
        .hr-dash-icon {
          width: 56px; height: 56px; border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(34,211,238,0.75);
          box-shadow: 0 0 32px rgba(34,211,238,0.08);
        }

        /* Title */
        .hr-dash-title {
          font-family: var(--font-display);
          font-weight: 700; font-size: clamp(36px, 7vw, 58px);
          letter-spacing: -0.03em; line-height: 1;
          background: linear-gradient(180deg, #ffffff 0%, #ffffff 45%, rgba(255,255,255,0.48) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hr-dash-sub {
          font-size: 14px; font-weight: 300;
          color: rgba(200,215,235,0.52);
          letter-spacing: 0.01em;
        }

        /* Console */
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
        .hr-dash-console-inner {
          display: flex; flex-direction: column; gap: 16px;
        }

        /* Label */
        .hr-dash-field-label {
          font-family: var(--font-mono);
          font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(140,160,200,0.40);
          text-align: left; margin-bottom: 8px;
        }

        /* Input row */
        .hr-dash-input-row {
          display: flex; gap: 10px;
        }
        .hr-dash-input-wrap {
          flex: 1; position: relative;
        }
        .hr-dash-input-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: rgba(34,211,238,0.40);
          pointer-events: none;
          transition: color 0.25s ease;
        }
        .hr-dash-input-wrap.focused .hr-dash-input-icon { color: rgba(34,211,238,0.75); }
        .hr-dash-input {
          width: 100%; padding: 13px 14px 13px 42px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          font-family: var(--font-mono);
          font-size: 14px; letter-spacing: 0.08em;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
        }
        .hr-dash-input::placeholder {
          color: rgba(140,160,200,0.30);
          font-family: var(--font-body);
          font-size: 13px; letter-spacing: 0;
        }
        .hr-dash-input:focus {
          border-color: rgba(34,211,238,0.32);
          background: rgba(34,211,238,0.04);
          box-shadow: 0 0 0 3px rgba(34,211,238,0.06);
        }
        .hr-dash-btn {
          padding: 13px 20px;
          border-radius: 14px; border: none; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-body); font-size: 14px; font-weight: 600;
          transition: all 0.25s ease;
          white-space: nowrap;
          background: linear-gradient(135deg, rgba(34,211,238,0.16) 0%, rgba(8,145,178,0.14) 100%);
          border: 1px solid rgba(34,211,238,0.28);
          color: rgba(34,211,238,0.90);
          box-shadow: 0 4px 20px rgba(34,211,238,0.08);
        }
        .hr-dash-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(34,211,238,0.24) 0%, rgba(8,145,178,0.20) 100%);
          border-color: rgba(34,211,238,0.50);
          box-shadow: 0 6px 28px rgba(34,211,238,0.18);
          transform: translateY(-1px);
        }
        .hr-dash-btn:disabled {
          opacity: 0.30; cursor: not-allowed;
        }

        /* Divider */
        .hr-dash-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
        }

        /* Hint row */
        .hr-dash-hint {
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px;
        }
        .hr-dash-hint-text {
          font-family: var(--font-mono);
          font-size: 10px; letter-spacing: 0.12em;
          color: rgba(140,160,200,0.35);
          text-align: left;
        }
        .hr-dash-hint-example {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 999px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          font-family: var(--font-mono);
          font-size: 10px; letter-spacing: 0.10em;
          color: rgba(34,211,238,0.55);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .hr-dash-hint-example:hover {
          background: rgba(34,211,238,0.06);
          border-color: rgba(34,211,238,0.18);
          color: rgba(34,211,238,0.80);
        }
      `}</style>

      <div className="hr-dash-root">
        <div className="talyn-glow-1" />
        <div className="talyn-glow-2" />

        <motion.div
          className="hr-dash-wrap"
          variants={stagger}
          initial="hidden"
          animate="show"
        >

          {/* Icon */}
          <motion.div variants={rise}>
            <div className="hr-dash-icon"><IcoGrid /></div>
          </motion.div>

          {/* Title */}
          <motion.div variants={rise} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h1 className="hr-dash-title">HR Dashboard</h1>
            <div style={{ width: 72, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)", margin: "0 auto" }} />
            <p className="hr-dash-sub">Enter a candidate reference ID to pull their evaluation report</p>
          </motion.div>

          {/* Console */}
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
                  <button
                    className="hr-dash-btn"
                    onClick={handleSearch}
                    disabled={!refId.trim()}
                  >
                    <IcoArrow />
                    Search
                  </button>
                </div>

                <div className="hr-dash-divider" />

                <div className="hr-dash-hint">
                  <span className="hr-dash-hint-text">
                    Reference IDs are generated at the end of each interview session
                  </span>
                  <span
                    className="hr-dash-hint-example"
                    onClick={() => setRefId("TALYN")}
                  >
                    Try TALYN
                  </span>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div variants={rise} className="talyn-footer" style={{ justifyContent: "center" }}>
            <div className="talyn-footer-line" />
            <span className="talyn-footer-text">Built by Priyanka for SWE1904</span>
            <div className="talyn-footer-line" />
          </motion.div>

        </motion.div>
      </div>
    </>
  );
}