"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

/* ─── Icons ─── */
const IcoSparkles = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
    <path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75z" opacity="0.4"/>
  </svg>
);
const IcoBack = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M13 8H3M7 4l-4 4 4 4"/>
  </svg>
);
const IcoBriefcase = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
);
const IcoFile = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="13" x2="15" y2="13"/>
    <line x1="9" y1="17" x2="13" y2="17"/>
  </svg>
);
const IcoUpload = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const IcoX = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M2 2l10 10M12 2L2 12"/>
  </svg>
);
const IcoArrow = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 8h10M9 4l4 4-4 4"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round">
    <path d="M2 6l3 3 5-5"/>
  </svg>
);
const IcoChevron = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 6l4 4 4-4"/>
  </svg>
);

const ROLES = [
  "Backend Intern",
  "ML Intern",
  "DevOps Intern",
  "Product Designer",
  "Frontend Engineer",
  "Full Stack Engineer",
  "Data Analyst",
];

export default function ResumePage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const sessionId    = searchParams.get("session_id");

  const [role,    setRole]    = useState("Backend Intern");
  const [file,    setFile]    = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!sessionId) { router.push("/"); return null; }

  const canSubmit = !!file && !loading;

  const handleGenerate = async () => {
    if (!canSubmit) return;
    setLoading(true); setError(null);
    try {
      const fd = new FormData();
      fd.append("role", role);
      fd.append("resume", file!);
      fd.append("session_id", sessionId);
      const res  = await fetch("/api/orchestrate", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyse resume");
      router.push(`/interview?session_id=${sessionId}`);
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
        /* ── Page shell ── */
        .rp-page {
          min-height: 100vh;
          background: var(--bg);
          font-family: var(--font-body);
          position: relative;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 24px;
          overflow: hidden;
        }
        .rp-wrap {
          position: relative; z-index: 2;
          max-width: 560px; width: 100%;
          display: flex; flex-direction: column;
          align-items: center; gap: 24px;
          text-align: center;
        }

        /* ── Logo ── */
        .rp-logo {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(44px, 8vw, 68px);
          line-height: 1; letter-spacing: -0.03em;
          background: linear-gradient(180deg, #ffffff 0%, #ffffff 45%, rgba(255,255,255,0.48) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          filter: drop-shadow(0 0 24px rgba(255,255,255,0.07));
          user-select: none;
        }
        .rp-logo-rule {
          width: 64px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
        }
        .rp-subtitle {
          font-size: 13px; font-weight: 300;
          color: rgba(200,215,235,0.50); letter-spacing: 0.01em;
        }

        /* ── Step indicator ── */
        .rp-steps {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.16em; text-transform: uppercase;
        }
        .rp-step-dot {
          width: 20px; height: 20px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 9px;
        }
        .rp-step-done   { background: rgba(34,211,238,0.12); border: 1px solid rgba(34,211,238,0.35); color: #22d3ee; }
        .rp-step-active { background: rgba(34,211,238,0.07); border: 1px solid rgba(34,211,238,0.28); color: rgba(34,211,238,0.80); box-shadow: 0 0 10px rgba(34,211,238,0.15); }
        .rp-step-line   { flex: 1; height: 1px; background: rgba(255,255,255,0.07); max-width: 28px; }
        .rp-step-line-done { background: linear-gradient(90deg, rgba(34,211,238,0.40), rgba(34,211,238,0.15)); }
        .rp-step-text-done   { color: rgba(34,211,238,0.45); }
        .rp-step-text-active { color: rgba(34,211,238,0.70); }

        /* ── Console ── */
        .rp-console {
          width: 100%;
          border-radius: 32px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.40);
          backdrop-filter: blur(50px);
          -webkit-backdrop-filter: blur(50px);
          box-shadow: 0 25px 60px rgba(0,0,0,0.50), 0 1px 0 rgba(255,255,255,0.06) inset;
          position: relative; overflow: hidden;
        }
        .rp-console::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 30%, rgba(34,211,238,0.14) 50%, rgba(255,255,255,0.12) 70%, transparent 100%);
          pointer-events: none;
        }
        .rp-inner {
          padding: 28px;
          display: flex; flex-direction: column; gap: 20px;
          position: relative;
        }

        /* ── Back ── */
        .rp-back {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(140,160,200,0.40); cursor: pointer;
          border: none; background: none; padding: 0;
          transition: color 0.2s ease; align-self: flex-start;
        }
        .rp-back:hover { color: rgba(200,215,235,0.75); }

        /* ── Field label ── */
        .rp-field-label {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(140,160,200,0.38); margin-bottom: 8px;
          display: flex; align-items: center; gap: 7px;
        }
        .rp-label-icon { color: rgba(34,211,238,0.50); }

        /* ── Select ── */
        .rp-select-wrap { position: relative; }
        .rp-select {
          width: 100%; padding: 13px 40px 13px 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          font-family: var(--font-body); font-size: 14px;
          color: var(--text-primary); outline: none;
          appearance: none; cursor: pointer;
          transition: border-color 0.24s ease, background 0.24s ease, box-shadow 0.24s ease;
        }
        .rp-select:focus {
          border-color: rgba(34,211,238,0.30);
          background: rgba(34,211,238,0.03);
          box-shadow: 0 0 0 3px rgba(34,211,238,0.05);
        }
        .rp-select option { background: #0a0a0a; color: #ededed; }
        .rp-chevron {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          color: rgba(140,160,200,0.40); pointer-events: none;
        }

        /* ── Upload zone ── */
        .rp-upload-zone {
          position: relative; border-radius: 14px;
          border: 1px dashed rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.03);
          padding: 28px 20px; text-align: center;
          cursor: pointer; transition: all 0.28s ease; overflow: hidden;
        }
        .rp-upload-zone:hover {
          border-color: rgba(34,211,238,0.30);
          background: rgba(34,211,238,0.04);
        }
        .rp-upload-zone.has-file {
          border-color: rgba(34,211,238,0.32); border-style: solid;
          background: rgba(34,211,238,0.05);
        }
        .rp-upload-zone input[type="file"] {
          position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
        }
        .rp-upload-icon { color: rgba(34,211,238,0.45); margin: 0 auto 10px; }
        .rp-upload-text { font-size: 13px; font-weight: 500; color: rgba(200,215,235,0.65); }
        .rp-upload-hint {
          font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.10em;
          color: rgba(140,160,200,0.32); margin-top: 4px;
        }
        .rp-file-row {
          display: flex; align-items: center; gap: 12px; padding: 2px 0;
        }
        .rp-file-icon {
          width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(34,211,238,0.10);
          border: 1px solid rgba(34,211,238,0.22);
          color: #22d3ee;
        }
        .rp-file-name {
          flex: 1; font-size: 13px; font-weight: 500;
          color: rgba(200,220,255,0.80);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          text-align: left;
        }
        .rp-file-clear {
          width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          color: rgba(140,160,200,0.40); cursor: pointer;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.2s ease;
          z-index: 2; position: relative;
        }
        .rp-file-clear:hover { background: rgba(251,113,133,0.10); border-color: rgba(251,113,133,0.22); color: #fb7185; }

        /* ── Divider ── */
        .rp-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
        }

        /* ── Submit button ── */
        .rp-btn {
          width: 100%; padding: 15px; border-radius: 16px;
          border: none; cursor: pointer;
          font-family: var(--font-body); font-size: 14px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          transition: all 0.28s ease;
        }
        .rp-btn:not(:disabled) {
          background: linear-gradient(135deg, rgba(34,211,238,0.18) 0%, rgba(8,145,178,0.15) 100%);
          border: 1px solid rgba(34,211,238,0.35);
          color: rgba(34,211,238,0.95);
          box-shadow: 0 4px 24px rgba(34,211,238,0.12), 0 0 0 1px rgba(34,211,238,0.08) inset;
        }
        .rp-btn:not(:disabled):hover {
          background: linear-gradient(135deg, rgba(34,211,238,0.26) 0%, rgba(8,145,178,0.22) 100%);
          border-color: rgba(34,211,238,0.52);
          box-shadow: 0 6px 32px rgba(34,211,238,0.22), 0 0 0 1px rgba(34,211,238,0.12) inset;
          transform: translateY(-2px);
        }
        .rp-btn:disabled {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(160,175,200,0.28); cursor: not-allowed;
        }

        /* ── Error ── */
        .rp-error {
          border-radius: 12px; padding: 12px 16px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.18);
          font-size: 13px; color: rgba(252,165,165,0.85); text-align: center;
        }

        @keyframes rpSpin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="rp-page">
        <div className="talyn-glow-1" />
        <div className="talyn-glow-2" />

        <motion.div
          className="rp-wrap"
          variants={stagger}
          initial="hidden"
          animate="show"
        >

          {/* ── Logo ── */}
          <motion.div variants={rise} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <h1 className="rp-logo">Talyn</h1>
            <div className="rp-logo-rule" />
            <p className="rp-subtitle">Resume Upload — Step 3 of 3</p>
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
            <div className="rp-steps">
              <div className="rp-step-dot rp-step-done"><IcoCheck /></div>
              <span className="rp-step-text-done">Identity</span>
              <div className="rp-step-line rp-step-line-done" />
              <div className="rp-step-dot rp-step-done"><IcoCheck /></div>
              <span className="rp-step-text-done">Details</span>
              <div className="rp-step-line rp-step-line-done" />
              <div className="rp-step-dot rp-step-active">3</div>
              <span className="rp-step-text-active">Resume</span>
            </div>
          </motion.div>

          {/* ── Console ── */}
          <motion.div variants={rise} style={{ width: "100%" }}>
            <div className="rp-console">
              <div className="rp-inner">

                {/* Back */}
                <button className="rp-back" onClick={() => router.back()}>
                  <IcoBack /> Back
                </button>

                {/* Role select */}
                <div>
                  <p className="rp-field-label">
                    <span className="rp-label-icon"><IcoBriefcase /></span>
                    Target Role
                  </p>
                  <div className="rp-select-wrap">
                    <select
                      className="rp-select"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                    >
                      {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                    <div className="rp-chevron"><IcoChevron /></div>
                  </div>
                </div>

                {/* Resume upload */}
                <div>
                  <p className="rp-field-label">
                    <span className="rp-label-icon"><IcoFile /></span>
                    Resume PDF
                  </p>
                  <div className={`rp-upload-zone ${file ? "has-file" : ""}`}>
                    {!file && (
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={e => { if (e.target.files?.[0]) { setFile(e.target.files[0]); setError(null); } }}
                      />
                    )}
                    {file ? (
                      <div className="rp-file-row">
                        <div className="rp-file-icon"><IcoFile /></div>
                        <span className="rp-file-name">{file.name}</span>
                        <div
                          className="rp-file-clear"
                          onClick={e => { e.stopPropagation(); setFile(null); }}
                        >
                          <IcoX />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="rp-upload-icon"><IcoUpload /></div>
                        <p className="rp-upload-text">Click to upload your resume</p>
                        <p className="rp-upload-hint">PDF only · Max 10MB</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="rp-divider" />

                {/* Submit */}
                <button className="rp-btn" onClick={handleGenerate} disabled={!canSubmit}>
                  {loading ? (
                    <><Loader2 size={15} style={{ animation: "rpSpin 1s linear infinite" }} />Analysing Resume…</>
                  ) : (
                    <>Analyse &amp; Begin Interview <IcoArrow /></>
                  )}
                </button>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="rp-error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

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