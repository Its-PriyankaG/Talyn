"use client";

import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

/* ─── Tilt Card ─── */
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 20 });
  const sy = useSpring(my, { stiffness: 150, damping: 20 });
  const rotX = useTransform(sy, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotY = useTransform(sx, [-0.5, 0.5], ["-5deg", "5deg"]);
  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      onMouseMove={e => {
        const r = ref.current!.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Icons ─── */
const IcoUser = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IcoBriefcase = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);
const IcoArrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 8h10M9 4l4 4-4 4"/>
  </svg>
);
const IcoSparkles = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
    <path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75z" opacity="0.45"/>
  </svg>
);

export default function LandingPage() {
  const router = useRouter();

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const rise = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
  };

  return (
    <>
      {/* Page-scoped overrides only — all shared tokens live in globals.css */}
      <style>{`
        .lp-root {
          height: 100vh; overflow: hidden;
          background: var(--bg);
          font-family: var(--font-body);
          position: relative;
          display: flex; align-items: center; justify-content: center;
          padding: 0 24px;
        }
        .lp-wrap {
          position: relative; z-index: 10;
          max-width: 860px; width: 100%; margin: 0 auto;
          display: flex; flex-direction: column;
          align-items: center; gap: 20px;
          text-align: center;
        }
        .lp-logo {
          font-family: var(--font-display);
          font-weight: 700;
          font-style: normal;
          font-size: clamp(56px, 10vw, 96px);
          line-height: 1; letter-spacing: -0.03em;
        }
        .lp-tagline {
          font-size: 14px; font-weight: 300;
          color: var(--text-secondary);
          letter-spacing: 0.01em;
        }
        .lp-console-inner {
          position: relative;
          display: flex; flex-direction: column; gap: 20px;
          padding: 28px 32px;
        }
        .lp-cards {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
          perspective: 1200px;
        }
        @media(max-width: 560px) { .lp-cards { grid-template-columns: 1fr; } }

        .lp-card {
          border-radius: 20px; padding: 20px 22px;
          cursor: pointer;
          display: flex; align-items: center;
          justify-content: space-between; gap: 16px;
        }
        .lp-card-left {
          display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0;
        }
        .lp-card-type {
          font-family: var(--font-mono);
          font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--text-muted); margin-bottom: 3px;
        }
        .lp-card-title {
          font-family: var(--font-display);
          font-weight: 700; font-style: normal;
          font-size: 22px; line-height: 1.1; letter-spacing: -0.01em;
          color: var(--text-primary);
        }
        .lp-card-arrow {
          flex-shrink: 0;
          transition: transform 0.25s ease, color 0.25s ease;
        }
        .lp-card-arrow-cyan   { color: rgba(34,211,238,0.45); }
        .lp-card-arrow-violet { color: rgba(167,139,250,0.45); }
        .talyn-card-cyan:hover   .lp-card-arrow { transform: translateX(4px); color: var(--cyan); }
        .talyn-card-violet:hover .lp-card-arrow { transform: translateX(4px); color: var(--violet); }

        .lp-icon-cyan   { color: rgba(34,211,238,0.72); }
        .lp-icon-violet { color: rgba(167,139,250,0.72); }
      `}</style>

      <div className="lp-root">
        {/* Shared ambient glows from globals.css */}
        <div className="talyn-glow-1" />
        <div className="talyn-glow-2" />

        <motion.div
          className="lp-wrap"
          variants={stagger}
          initial="hidden"
          animate="show"
        >

          {/* Badge */}
          <motion.div variants={rise}>
            <span className="talyn-badge">
              <span className="talyn-badge-dot" />
              <IcoSparkles />
              AI Hiring Platform
            </span>
          </motion.div>

          {/* Logo */}
          <motion.div variants={rise} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <h1 className="lp-logo t-logo-gradient">Talyn</h1>
            <div style={{ width: 80, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)" }} />
          </motion.div>

          {/* Tagline */}
          <motion.div variants={rise}>
            <p className="lp-tagline">Rebuilding hiring, end to end.</p>
          </motion.div>

          {/* Console */}
          <motion.div variants={rise} style={{ width: "100%" }}>
            <div className="talyn-console">
              <div className="lp-console-inner">

                {/* Stats */}
                <div className="talyn-stats">
                  {[
                    { v: "10", u: "×",   l: "Faster Hiring" },
                    { v: "< 2", u: "min", l: "Results" },
                  ].map((s, i) => (
                    <div key={s.l} style={{ display: "contents" }}>
                      {i > 0 && <div className="talyn-stat-sep" />}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                          <span className="talyn-stat-val">{s.v}</span>
                          <span className="talyn-stat-sup">{s.u}</span>
                        </div>
                        <span className="talyn-stat-label">{s.l}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chips */}
                <div className="talyn-chips">
                  {["Real-time AI Analysis", "Bias-Free Evaluation", "Structured Scoring"].map(c => (
                    <span key={c} className="talyn-chip">
                      <span className="talyn-chip-icon"><IcoSparkles /></span>{c}
                    </span>
                  ))}
                </div>

                <div className="talyn-divider" />

                {/* Role Auth Cards */}
                <div className="lp-cards">
                  <TiltCard>
                    <div
                      className="lp-card talyn-card talyn-card-cyan"
                      onClick={() => router.push("/identity")}
                    >
                      <div className="lp-card-left">
                        <div className="talyn-icon-box lp-icon-cyan" style={{ width: 44, height: 44 }}><IcoUser /></div>
                        <div>
                          <p className="lp-card-type">Continue as</p>
                          <h2 className="lp-card-title">Candidate</h2>
                        </div>
                      </div>
                      <div className="lp-card-arrow lp-card-arrow-cyan"><IcoArrow /></div>
                    </div>
                  </TiltCard>

                  <TiltCard>
                    <div
                      className="lp-card talyn-card talyn-card-violet"
                      onClick={() => router.push("/hr")}
                    >
                      <div className="lp-card-left">
                        <div className="talyn-icon-box lp-icon-violet" style={{ width: 44, height: 44 }}><IcoBriefcase /></div>
                        <div>
                          <p className="lp-card-type">Continue as</p>
                          <h2 className="lp-card-title">HR Team</h2>
                        </div>
                      </div>
                      <div className="lp-card-arrow lp-card-arrow-violet"><IcoArrow /></div>
                    </div>
                  </TiltCard>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div variants={rise}>
            <div className="talyn-footer">
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