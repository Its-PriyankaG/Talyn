"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

type Evaluation = {
  reference_id: string;
  final_score: number;
  final_decision: string;
  evaluation_status: string;
  scores: Record<string, number>;
  comments: Record<string, string>;
};

/* ─── Score arc SVG ─── */
function ScoreArc({ score, max = 10 }: { score: number; max?: number }) {
  const pct    = score / max;
  const r      = 72;
  const cx     = 90;
  const cy     = 90;
  const startA = -210 * (Math.PI / 180);
  const sweep  = 240  * (Math.PI / 180);
  const endA   = startA + sweep * pct;
  const trackEnd = startA + sweep;

  const arc = (a: number) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  const pathD = (from: number, to: number, large: boolean) => {
    const s = arc(from), e = arc(to);
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large ? 1 : 0} 1 ${e.x} ${e.y}`;
  };

  const color = score >= 8 ? "#22d3ee" : score >= 6 ? "#a78bfa" : "#fb923c";
  const glow  = score >= 8 ? "rgba(34,211,238,0.35)" : score >= 6 ? "rgba(167,139,250,0.35)" : "rgba(251,146,60,0.35)";

  return (
    <svg width="180" height="160" viewBox="0 0 180 160">
      <defs>
        <filter id="arcGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6"/>
          <stop offset="100%" stopColor={color}/>
        </linearGradient>
      </defs>
      {/* Track */}
      <path d={pathD(startA, trackEnd, true)} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" strokeLinecap="round"/>
      {/* Fill */}
      {pct > 0 && (
        <path
          d={pathD(startA, endA, pct > 0.5)}
          fill="none"
          stroke="url(#arcGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          filter="url(#arcGlow)"
        />
      )}
      {/* Score text */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#ededed"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700 }}>
        {score}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(180,200,230,0.45)"
        style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase" }}>
        / 10
      </text>
      {/* Tick dot at end */}
      {pct > 0 && (
        <circle cx={arc(endA).x} cy={arc(endA).y} r="5" fill={color}
          style={{ filter: `drop-shadow(0 0 6px ${glow})` }}/>
      )}
    </svg>
  );
}

/* ─── Mini bar ─── */
function ScoreBar({ value, max = 10, color }: { value: number; max?: number; color: string }) {
  return (
    <div style={{ width: "100%", height: 5, borderRadius: 99, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        style={{ height: "100%", borderRadius: 99, background: color,
          boxShadow: `0 0 8px ${color}60` }}
      />
    </div>
  );
}

/* ─── Radar Chart (SVG) ─── */
function RadarChart({ scores }: { scores: Record<string, number> }) {
  const keys = Object.keys(scores);
  const n    = keys.length;
  const cx = 110, cy = 110, r = 80;

  const angleOf = (i: number) => (i / n) * 2 * Math.PI - Math.PI / 2;
  const pt = (i: number, val: number) => ({
    x: cx + r * (val / 10) * Math.cos(angleOf(i)),
    y: cy + r * (val / 10) * Math.sin(angleOf(i)),
  });

  const rings = [2, 4, 6, 8, 10];
  const polygonPts = (frac: number) =>
    keys.map((_, i) => `${cx + r * frac * Math.cos(angleOf(i))},${cy + r * frac * Math.sin(angleOf(i))}`).join(" ");

  const valuePts = keys.map((k, i) => pt(i, scores[k]));
  const polyVal  = valuePts.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <svg width="220" height="220" viewBox="0 0 220 220" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="radarFill" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#22d3ee" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.05"/>
        </radialGradient>
      </defs>
      {/* Rings */}
      {rings.map(v => (
        <polygon key={v} points={polygonPts(v / 10)} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      ))}
      {/* Spokes */}
      {keys.map((_, i) => (
        <line key={i} x1={cx} y1={cy}
          x2={cx + r * Math.cos(angleOf(i))} y2={cy + r * Math.sin(angleOf(i))}
          stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      ))}
      {/* Value area */}
      <polygon points={polyVal} fill="url(#radarFill)"
        stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.7"/>
      {/* Dots */}
      {valuePts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#22d3ee"
          style={{ filter: "drop-shadow(0 0 5px rgba(34,211,238,0.6))" }}/>
      ))}
      {/* Labels */}
      {keys.map((k, i) => {
        const angle = angleOf(i);
        const lx = cx + (r + 22) * Math.cos(angle);
        const ly = cy + (r + 22) * Math.sin(angle);
        const anchor = lx < cx - 4 ? "end" : lx > cx + 4 ? "start" : "middle";
        const label = k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        return (
          <text key={k} x={lx} y={ly + 4} textAnchor={anchor} fill="rgba(180,200,230,0.55)"
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.08em" }}>
            {label}
          </text>
        );
      })}
    </svg>
  );
}

/* ─── Helpers ─── */
const SCORE_COLORS: Record<string, string> = {
  technical_accuracy: "#22d3ee",
  concept_depth:      "#a78bfa",
  problem_solving:    "#34d399",
  communication:      "#fb923c",
  confidence:         "#f472b6",
  time_efficiency:    "#facc15",
};
const getColor = (key: string) => SCORE_COLORS[key] ?? "#22d3ee";

const decisionStyle = (d: string) => {
  const m: Record<string, { bg: string; color: string; glow: string }> = {
    PROMISING:  { bg: "rgba(34,211,238,0.10)",  color: "#22d3ee",  glow: "0 0 20px rgba(34,211,238,0.15)" },
    HIRE:       { bg: "rgba(52,211,153,0.10)",  color: "#34d399",  glow: "0 0 20px rgba(52,211,153,0.15)" },
    REJECT:     { bg: "rgba(251,113,133,0.10)", color: "#fb7185",  glow: "0 0 20px rgba(251,113,133,0.15)" },
    REVIEW:     { bg: "rgba(251,191,36,0.10)",  color: "#fbbf24",  glow: "0 0 20px rgba(251,191,36,0.15)"  },
  };
  return m[d?.toUpperCase()] ?? m.REVIEW;
};

const labelOf = (k: string) => k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

/* ════════════════════════════════
   PAGE
════════════════════════════════ */
export default function HRResultPage() {
  const { reference_id } = useParams();
  const [data, setData]       = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`http://localhost:8006/evaluation/${reference_id}`);
        const json = await res.json();
        setData(json);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [reference_id]);

  /* ── Loading ── */
  if (loading) return (
    <>
      <style>{loadingStyle}</style>
      <div className="hr-root">
        <div className="talyn-glow-1" /><div className="talyn-glow-2" />
        <div className="hr-loader">
          <div className="hr-spinner" />
          <p className="t-label" style={{ marginTop: 16 }}>Fetching evaluation…</p>
        </div>
      </div>
    </>
  );

  if (!data) return (
    <>
      <style>{loadingStyle}</style>
      <div className="hr-root">
        <div className="talyn-glow-1" /><div className="talyn-glow-2" />
        <div className="hr-loader">
          <p style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text-primary)" }}>No data found.</p>
        </div>
      </div>
    </>
  );

  const ds = decisionStyle(data.final_decision);
  const scores   = data.scores   ?? {};
  const comments = data.comments ?? {};
  const scoreEntries = Object.entries(scores);
  const avgScore = scoreEntries.length
    ? (Object.values(scores).reduce((a, b) => a + b, 0) / scoreEntries.length).toFixed(1)
    : "—";
  const topSkill: [string, number] = scoreEntries.length ? scoreEntries.reduce((a, b) => (b[1] > a[1] ? b : a)) : ["—", 0];
  const lowSkill: [string, number] = scoreEntries.length ? scoreEntries.reduce((a, b) => (b[1] < a[1] ? b : a)) : ["—", 0];

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const rise    = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
  };

  return (
    <>
      <style>{pageStyle}</style>

      <div className="hr-root">
        <div className="talyn-glow-1" />
        <div className="talyn-glow-2" />

        <motion.div className="hr-wrap" variants={stagger} initial="hidden" animate="show">

          {/* ── HEADER ── */}
          <motion.div variants={rise} className="hr-header">
            <div>
              <p className="t-label" style={{ marginBottom: 6 }}>Candidate Evaluation Report</p>
              <h1 className="hr-page-title">
                {data.reference_id}
              </h1>
            </div>
            <div className="hr-decision-badge" style={{ background: ds.bg, color: ds.color, boxShadow: ds.glow }}>
              {data.final_decision}
            </div>
          </motion.div>

          {/* ── KPI ROW ── */}
          <motion.div variants={rise} className="hr-kpi-row">
            {[
              { label: "Final Score",  value: data.final_score?.toString() ?? "—", unit: "/ 10" },
              { label: "Avg Category", value: avgScore,                   unit: "/ 10" },
              { label: "Top Skill",    value: labelOf(String(topSkill[0])),       unit: `${topSkill[1]}/10` },
              { label: "Needs Work",   value: labelOf(String(lowSkill[0])),       unit: `${lowSkill[1]}/10` },
              { label: "Status",       value: data.evaluation_status,     unit: "" },
            ].map(k => (
              <div key={k.label} className="hr-kpi">
                <p className="t-label" style={{ marginBottom: 6 }}>{k.label}</p>
                <p className="hr-kpi-val">{k.value}</p>
                {k.unit && <p className="hr-kpi-unit">{k.unit}</p>}
              </div>
            ))}
          </motion.div>

          {/* ── MAIN GRID ── */}
          <div className="hr-main-grid">

            {/* Left col */}
            <div className="hr-left-col">

              {/* Score arc card */}
              <motion.div variants={rise} className="talyn-console hr-arc-card">
                <div className="hr-arc-inner">
                  <div>
                    <p className="t-label" style={{ marginBottom: 4 }}>Overall Score</p>
                    <ScoreArc score={data.final_score ?? 0} />
                  </div>
                  <div className="hr-arc-meta">
                    <div className="hr-arc-badge" style={{ background: ds.bg, color: ds.color }}>
                      {data.final_decision}
                    </div>
                    <p className="t-body" style={{ fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>
                      Candidate scored <strong style={{ color: "#ededed" }}>{data.final_score ?? "—"}/10</strong> overall across {scoreEntries.length} evaluation dimensions.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Radar chart card */}
              <motion.div variants={rise} className="talyn-console hr-radar-card">
                <p className="t-label" style={{ padding: "20px 24px 0" }}>Skill Radar</p>
                <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 16px" }}>
                  <RadarChart scores={scores} />
                </div>
              </motion.div>

            </div>

            {/* Right col */}
            <div className="hr-right-col">

              {/* Score breakdown */}
              <motion.div variants={rise} className="talyn-console hr-breakdown-card">
                <p className="t-label" style={{ padding: "20px 24px 16px" }}>Score Breakdown</p>
                <div className="hr-breakdown-list">
                  {scoreEntries.map(([key, val]) => (
                    <div key={key} className="hr-breakdown-row">
                      <div className="hr-breakdown-top">
                        <span className="hr-breakdown-key">{labelOf(key)}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span className="hr-breakdown-val" style={{ color: getColor(key) }}>{val}</span>
                          <span className="hr-breakdown-max">/10</span>
                        </div>
                      </div>
                      <ScoreBar value={val} color={getColor(key)} />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Score grid */}
              <motion.div variants={rise} className="hr-score-grid">
                {scoreEntries.map(([key, val]) => {
                  const c = getColor(key);
                  return (
                    <div key={key} className="hr-score-tile" style={{ borderColor: `${c}22` }}>
                      <div className="hr-score-tile-top">
                        <div className="hr-score-dot" style={{ background: c, boxShadow: `0 0 8px ${c}60` }} />
                        <span className="hr-score-tile-label">{labelOf(key)}</span>
                      </div>
                      <span className="hr-score-tile-val" style={{ color: c }}>{val}</span>
                    </div>
                  );
                })}
              </motion.div>

            </div>
          </div>

          {/* ── AI FEEDBACK ── */}
          <motion.div variants={rise}>
            <p className="t-label" style={{ marginBottom: 14 }}>AI Feedback · {Object.keys(comments).length} Categories</p>
            <div className="hr-feedback-grid">
              {Object.entries(comments).map(([key, text]) => {
                const c = getColor(key);
                const score = scores[key] ?? 0;
                return (
                  <div key={key} className="talyn-card hr-feedback-card" style={{ "--accent": c } as React.CSSProperties}>
                    <div className="hr-feedback-head">
                      <div className="hr-feedback-icon" style={{ background: `${c}14`, border: `1px solid ${c}28` }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, boxShadow: `0 0 8px ${c}80` }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p className="hr-feedback-label">{labelOf(key)}</p>
                      </div>
                      <span className="hr-feedback-score" style={{ color: c, borderColor: `${c}28`, background: `${c}10` }}>
                        {score}/10
                      </span>
                    </div>
                    <p className="hr-feedback-text">{text}</p>
                    <div style={{ marginTop: 12 }}>
                      <ScoreBar value={score} color={c} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── FOOTER ── */}
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

/* ════════════════════════════════
   STYLES
════════════════════════════════ */
const base = `
  .hr-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--font-body);
    position: relative;
    padding: 48px 24px 64px;
    overflow-x: hidden;
  }
  .hr-wrap {
    position: relative; z-index: 2;
    max-width: 1100px; margin: 0 auto;
    display: flex; flex-direction: column; gap: 28px;
  }

  /* Header */
  .hr-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 20px;
    flex-wrap: wrap;
  }
  .hr-page-title {
    font-family: var(--font-display);
    font-weight: 700; font-size: clamp(28px, 5vw, 44px);
    letter-spacing: -0.03em; line-height: 1;
    color: var(--text-primary);
  }
  .hr-decision-badge {
    font-family: var(--font-mono);
    font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
    padding: 8px 20px; border-radius: 999px;
    border: 1px solid currentColor;
    opacity: 0.9;
  }

  /* KPI Row */
  .hr-kpi-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 14px;
  }
  @media(max-width: 800px) { .hr-kpi-row { grid-template-columns: repeat(3, 1fr); } }
  @media(max-width: 520px) { .hr-kpi-row { grid-template-columns: repeat(2, 1fr); } }
  .hr-kpi {
    padding: 16px 18px; border-radius: 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
  }
  .hr-kpi-val {
    font-family: var(--font-display);
    font-weight: 700; font-size: 20px;
    color: var(--text-primary); line-height: 1;
    letter-spacing: -0.02em;
    text-transform: capitalize;
  }
  .hr-kpi-unit {
    font-family: var(--font-mono);
    font-size: 9px; letter-spacing: 0.12em;
    color: var(--text-muted); margin-top: 3px;
  }

  /* Main grid */
  .hr-main-grid {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 20px;
  }
  @media(max-width: 900px) { .hr-main-grid { grid-template-columns: 1fr; } }

  .hr-left-col  { display: flex; flex-direction: column; gap: 20px; }
  .hr-right-col { display: flex; flex-direction: column; gap: 20px; }

  /* Arc card */
  .hr-arc-card { padding: 24px; }
  .hr-arc-inner { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
  .hr-arc-meta { flex: 1; min-width: 120px; }
  .hr-arc-badge {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
    padding: 5px 14px; border-radius: 999px;
    border: 1px solid currentColor;
  }

  /* Radar card */
  .hr-radar-card { overflow: hidden; }

  /* Breakdown */
  .hr-breakdown-card { }
  .hr-breakdown-list { padding: 0 24px 20px; display: flex; flex-direction: column; gap: 16px; }
  .hr-breakdown-row  { display: flex; flex-direction: column; gap: 7px; }
  .hr-breakdown-top  { display: flex; justify-content: space-between; align-items: center; }
  .hr-breakdown-key  {
    font-family: var(--font-body); font-size: 13px; font-weight: 500;
    color: rgba(200,215,235,0.70);
  }
  .hr-breakdown-val  { font-family: var(--font-display); font-weight: 700; font-size: 18px; line-height: 1; }
  .hr-breakdown-max  { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); }

  /* Score grid */
  .hr-score-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
  }
  @media(max-width: 600px) { .hr-score-grid { grid-template-columns: repeat(2, 1fr); } }
  .hr-score-tile {
    padding: 14px 16px; border-radius: 14px;
    background: rgba(255,255,255,0.025);
    border: 1px solid transparent;
    transition: all 0.25s ease;
  }
  .hr-score-tile:hover { background: rgba(255,255,255,0.05); }
  .hr-score-tile-top  { display: flex; align-items: center; gap: 7px; margin-bottom: 10px; }
  .hr-score-dot       { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .hr-score-tile-label {
    font-family: var(--font-mono); font-size: 9px;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-muted); line-height: 1.3;
  }
  .hr-score-tile-val {
    font-family: var(--font-display); font-weight: 700;
    font-size: 26px; line-height: 1; letter-spacing: -0.02em;
  }

  /* Feedback */
  .hr-feedback-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  @media(max-width: 680px) { .hr-feedback-grid { grid-template-columns: 1fr; } }
  .hr-feedback-card { padding: 20px 22px; }
  .hr-feedback-head { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .hr-feedback-icon {
    width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .hr-feedback-label {
    font-family: var(--font-body); font-size: 13px; font-weight: 600;
    color: var(--text-primary); line-height: 1;
  }
  .hr-feedback-score {
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em;
    padding: 3px 10px; border-radius: 999px; border: 1px solid;
    white-space: nowrap; margin-left: auto;
  }
  .hr-feedback-text {
    font-family: var(--font-body); font-size: 13px; font-weight: 300;
    color: rgba(180,200,230,0.62); line-height: 1.7;
  }
`;

const loadingStyle = `
  ${base}
  .hr-loader {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 8px; z-index: 2;
  }
  .hr-spinner {
    width: 36px; height: 36px; border-radius: 50%;
    border: 2px solid rgba(34,211,238,0.15);
    border-top-color: #22d3ee;
    animation: talynSpin 0.8s linear infinite;
  }
`;

const pageStyle = base;