  "use client";

  import { useEffect, useState } from "react";
  import { useRouter, useSearchParams } from "next/navigation";
  import { motion, AnimatePresence } from "framer-motion";
  import { Loader2 } from "lucide-react";
  import VoiceRecorder from "@/app/components/VoiceRecorder";

  type Question = { question: string; rationale: string };

  /* ─── Icons ─── */
  const IcoBack = () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M13 8H3M7 4l-4 4 4 4"/>
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
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M2 6l3 3 5-5"/>
    </svg>
  );
  const IcoClock = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  );

  const THINK_TIME  = 30;
  const ANSWER_TIME = 60;
  const TOTAL_TIME  = THINK_TIME + ANSWER_TIME;

  export default function InterviewPage() {
    const router       = useRouter();
    const searchParams = useSearchParams();
    const sessionId    = searchParams.get("session_id");

    const [questions,     setQuestions]     = useState<Question[]>([]);
    const [currentIndex,  setCurrentIndex]  = useState(0);
    const [loading,       setLoading]       = useState(true);
    const [transcript,    setTranscript]    = useState("");
    const [saved,         setSaved]         = useState(false);
    const [timeLeft,      setTimeLeft]      = useState(TOTAL_TIME);
    const [phase,         setPhase]         = useState<"thinking"|"answering">("thinking");
    const [submitting,    setSubmitting]    = useState(false);

    useEffect(() => {
      if (!sessionId) { router.push("/"); return; }
      (async () => {
        try {
          const res  = await fetch(`http://localhost:8004/questions/${sessionId}`);
          const data = await res.json();
          if (!res.ok) throw new Error("Failed to fetch questions");
          setQuestions(data.questions);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
      })();
    }, [sessionId, router]);

    useEffect(() => {
      if (!questions.length) return;
      setTimeLeft(TOTAL_TIME); setPhase("thinking");
      const iv = setInterval(() => {
        setTimeLeft(prev => {
          const next = prev - 1;
          if (next === ANSWER_TIME) setPhase("answering");
          if (next <= 0) { clearInterval(iv); handleNext(); return 0; }
          return next;
        });
      }, 1000);
      return () => clearInterval(iv);
    }, [currentIndex, questions]);

    if (!sessionId) return null;

    const currentQuestion = questions[currentIndex];

    const handleNext = async () => {
      setSubmitting(true);
      const timeTaken = TOTAL_TIME - timeLeft;
      try {
        await fetch("http://localhost:8005/interview/response", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId, question_index: currentIndex,
            question: currentQuestion?.question, transcript, time_taken: timeTaken,
          }),
        });
        setSaved(true);
      } catch (e) { console.error("Failed to save response", e); }

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1); setTranscript(""); setSaved(false);
      } else {
        try {
          const res  = await fetch("http://localhost:8005/interview/complete", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId }),
          });
          const data = await res.json();
          if (!res.ok) {
            console.error("Interview completion failed");
            return;
          }
          console.log("Interview completed. Ref:", data.reference_id);
          try {
            const evalRes = await fetch("http://localhost:8006/evaluation/run", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                session_id: sessionId,
                reference_id: data.reference_id,
              }),
            });
            const evalData = await evalRes.json();
            console.log("Evaluation triggered:", evalData);
          } catch (err) {
            console.error("Evaluation trigger failed:", err);
          }
          router.push(`/results?session_id=${sessionId}&ref=${data.reference_id}`);
        } catch (e) { console.error("Completion failed", e); }
      }
      setSubmitting(false);
    };

    /* ── Arc progress for timer ── */
    const r        = 28;
    const circ     = 2 * Math.PI * r;
    const progress = timeLeft / TOTAL_TIME;
    const timerColor = phase === "thinking"
      ? `rgba(251,191,36,${0.6 + 0.4 * (1 - timeLeft / TOTAL_TIME)})`
      : `rgba(34,211,238,${0.6 + 0.4 * (1 - timeLeft / ANSWER_TIME)})`;

    const isLast    = questions.length > 0 && currentIndex === questions.length - 1;
    const pctDone   = questions.length ? ((currentIndex) / questions.length) * 100 : 0;

    const rise = {
      hidden: { opacity: 0, y: 20 },
      show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22,1,0.36,1] as [number,number,number,number] } },
    };

    return (
      <>
        <style>{`
          .iv-page {
            min-height: 100vh;
            background: var(--bg);
            font-family: var(--font-body);
            position: relative;
            padding: 40px 24px 72px;
            overflow-x: hidden;
          }
          .iv-wrap {
            position: relative; z-index: 2;
            max-width: 760px; margin: 0 auto;
            display: flex; flex-direction: column; gap: 20px;
          }

          /* ── Top bar ── */
          .iv-topbar {
            display: flex; align-items: center; justify-content: space-between; gap: 16px;
            flex-wrap: wrap;
          }
          .iv-logo {
            font-family: var(--font-display);
            font-weight: 700; font-size: 28px; letter-spacing: -0.03em;
            background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.55) 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
            user-select: none;
          }
          .iv-back {
            display: inline-flex; align-items: center; gap: 7px;
            font-family: var(--font-mono); font-size: 10px;
            letter-spacing: 0.12em; text-transform: uppercase;
            color: rgba(140,160,200,0.40); cursor: pointer;
            border: none; background: none; padding: 0;
            transition: color 0.2s ease;
          }
          .iv-back:hover { color: rgba(200,215,235,0.75); }

          /* ── Overall progress bar ── */
          .iv-prog-wrap {
            width: 100%; height: 3px; border-radius: 99px;
            background: rgba(255,255,255,0.06); overflow: hidden;
          }
          .iv-prog-fill {
            height: 100%; border-radius: 99px;
            background: linear-gradient(90deg, rgba(34,211,238,0.6), rgba(34,211,238,0.9));
            box-shadow: 0 0 10px rgba(34,211,238,0.30);
            transition: width 0.5s ease;
          }

          /* ── Status row ── */
          .iv-status-row {
            display: flex; align-items: center; justify-content: space-between; gap: 12px;
            flex-wrap: wrap;
          }
          .iv-q-count {
            font-family: var(--font-mono); font-size: 10px;
            letter-spacing: 0.14em; text-transform: uppercase;
            color: rgba(140,160,200,0.40);
          }
          .iv-phase-pill {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 5px 14px; border-radius: 999px;
            font-family: var(--font-mono); font-size: 9px;
            letter-spacing: 0.14em; text-transform: uppercase;
            border: 1px solid; transition: all 0.4s ease;
          }
          .iv-phase-thinking {
            background: rgba(251,191,36,0.08);
            border-color: rgba(251,191,36,0.28);
            color: rgba(251,191,36,0.80);
          }
          .iv-phase-answering {
            background: rgba(34,211,238,0.08);
            border-color: rgba(34,211,238,0.28);
            color: rgba(34,211,238,0.80);
          }
          .iv-phase-dot {
            width: 5px; height: 5px; border-radius: 50%;
            animation: ivPulse 1.8s ease-in-out infinite;
          }
          .iv-phase-thinking .iv-phase-dot { background: #fbbf24; }
          .iv-phase-answering .iv-phase-dot { background: #22d3ee; }
          @keyframes ivPulse {
            0%,100% { opacity: 0.5; transform: scale(1); }
            50%      { opacity: 1;   transform: scale(1.4); }
          }

          /* ── Question card ── */
          .iv-q-card {
            width: 100%;
            border-radius: 28px;
            border: 1px solid rgba(255,255,255,0.10);
            background: rgba(0,0,0,0.40);
            backdrop-filter: blur(50px);
            -webkit-backdrop-filter: blur(50px);
            box-shadow: 0 25px 60px rgba(0,0,0,0.50), 0 1px 0 rgba(255,255,255,0.06) inset;
            position: relative; overflow: hidden;
          }
          .iv-q-card::before {
            content: '';
            position: absolute; top: 0; left: 0; right: 0; height: 1px;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 30%, rgba(34,211,238,0.14) 50%, rgba(255,255,255,0.12) 70%, transparent 100%);
            pointer-events: none;
          }
          .iv-q-inner { padding: 28px 30px; display: flex; flex-direction: column; gap: 20px; position: relative; }

          /* Card header */
          .iv-q-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
          .iv-q-num {
            display: flex; align-items: center; gap: 8px;
          }
          .iv-q-num-badge {
            font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.16em;
            text-transform: uppercase; padding: 4px 12px; border-radius: 999px;
            background: rgba(34,211,238,0.07); border: 1px solid rgba(34,211,238,0.20);
            color: rgba(34,211,238,0.65);
          }

          /* Timer ring */
          .iv-timer-wrap {
            display: flex; align-items: center; gap: 10px; flex-shrink: 0;
          }
          .iv-timer-num {
            font-family: var(--font-display); font-weight: 700;
            font-size: 22px; line-height: 1; letter-spacing: -0.02em;
            min-width: 38px; text-align: right;
            transition: color 0.3s ease;
          }

          /* Question text */
          .iv-q-text {
            font-family: var(--font-display); font-weight: 600;
            font-size: clamp(18px, 3vw, 24px);
            line-height: 1.35; letter-spacing: -0.01em;
            color: var(--text-primary);
          }

          /* Rationale */
          .iv-rationale {
            padding: 14px 16px; border-radius: 12px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
          }
          .iv-rationale-label {
            font-family: var(--font-mono); font-size: 8px;
            letter-spacing: 0.16em; text-transform: uppercase;
            color: rgba(140,160,200,0.32); margin-bottom: 6px;
          }
          .iv-rationale-text {
            font-size: 12px; font-weight: 300;
            color: rgba(180,200,230,0.48); line-height: 1.6;
          }

          /* ── Dot progress ── */
          .iv-dots { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
          .iv-dot {
            width: 7px; height: 7px; border-radius: 50%;
            transition: all 0.3s ease;
          }
          .iv-dot-done    { background: #22d3ee; box-shadow: 0 0 6px rgba(34,211,238,0.50); }
          .iv-dot-current { background: rgba(34,211,238,0.40); box-shadow: 0 0 8px rgba(34,211,238,0.25); transform: scale(1.3); }
          .iv-dot-idle    { background: rgba(255,255,255,0.10); }

          /* ── Saved badge ── */
          .iv-saved {
            display: inline-flex; align-items: center; gap: 6px; justify-content: center;
            font-family: var(--font-mono); font-size: 9px;
            letter-spacing: 0.14em; text-transform: uppercase;
            color: rgba(34,211,238,0.65);
          }

          /* ── Nav buttons ── */
          .iv-nav { display: flex; gap: 12px; }
          .iv-btn-prev {
            padding: 13px 20px; border-radius: 14px; cursor: pointer;
            font-family: var(--font-body); font-size: 13px; font-weight: 500;
            display: flex; align-items: center; gap: 8px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            color: rgba(180,200,230,0.55);
            transition: all 0.24s ease;
          }
          .iv-btn-prev:hover:not(:disabled) { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.14); color: rgba(200,215,235,0.80); }
          .iv-btn-prev:disabled { opacity: 0.28; cursor: not-allowed; }
          .iv-btn-next {
            flex: 1; padding: 13px 20px; border-radius: 14px; cursor: pointer;
            font-family: var(--font-body); font-size: 14px; font-weight: 600;
            display: flex; align-items: center; justify-content: center; gap: 9px;
            background: linear-gradient(135deg, rgba(34,211,238,0.18) 0%, rgba(8,145,178,0.15) 100%);
            border: 1px solid rgba(34,211,238,0.35);
            color: rgba(34,211,238,0.95);
            box-shadow: 0 4px 20px rgba(34,211,238,0.10);
            transition: all 0.28s ease;
          }
          .iv-btn-next:hover:not(:disabled) {
            background: linear-gradient(135deg, rgba(34,211,238,0.26) 0%, rgba(8,145,178,0.22) 100%);
            border-color: rgba(34,211,238,0.52);
            box-shadow: 0 6px 28px rgba(34,211,238,0.20);
            transform: translateY(-2px);
          }
          .iv-btn-next:disabled { opacity: 0.35; cursor: not-allowed; }

          /* ── Loading / empty ── */
          .iv-center {
            position: fixed; inset: 0; z-index: 10;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 16px;
          }
          .iv-spinner {
            width: 36px; height: 36px; border-radius: 50%;
            border: 2px solid rgba(34,211,238,0.15);
            border-top-color: #22d3ee;
            animation: ivSpin 0.8s linear infinite;
          }
          @keyframes ivSpin { to { transform: rotate(360deg); } }
        `}</style>

        <div className="iv-page">
          <div className="talyn-glow-1" />
          <div className="talyn-glow-2" />

          {/* Loading */}
          {loading && (
            <div className="iv-center">
              <div className="iv-spinner" />
              <p className="t-label">Loading interview…</p>
            </div>
          )}

          {/* Empty */}
          {!loading && questions.length === 0 && (
            <div className="iv-center">
              <p style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text-primary)" }}>No questions found.</p>
            </div>
          )}

          {/* Interview */}
          {!loading && questions.length > 0 && (
            <motion.div
              className="iv-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >

              {/* ── Top bar ── */}
              <div className="iv-topbar">
                <button className="iv-back" onClick={() => router.push(`/resume?session_id=${sessionId}`)}>
                  <IcoBack /> Exit
                </button>
                <h1 className="iv-logo">Talyn</h1>
                <span className="talyn-badge" style={{ fontSize: 10 }}>
                  <span className="talyn-badge-dot" />
                  <IcoSparkles /> AI Interview
                </span>
              </div>

              {/* ── Overall progress bar ── */}
              <div className="iv-prog-wrap">
                <div className="iv-prog-fill" style={{ width: `${pctDone}%` }} />
              </div>

              {/* ── Status row ── */}
              <div className="iv-status-row">
                <span className="iv-q-count">
                  Question {currentIndex + 1} of {questions.length}
                </span>

                {/* Dot progress */}
                <div className="iv-dots">
                  {questions.map((_, i) => (
                    <div key={i} className={`iv-dot ${i < currentIndex ? "iv-dot-done" : i === currentIndex ? "iv-dot-current" : "iv-dot-idle"}`} />
                  ))}
                </div>

                {/* Phase + timer */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className={`iv-phase-pill ${phase === "thinking" ? "iv-phase-thinking" : "iv-phase-answering"}`}>
                    <span className="iv-phase-dot" />
                    {phase === "thinking" ? "Think" : "Answer"}
                  </span>
                  <div className="iv-timer-wrap">
                    {/* SVG ring timer */}
                    <svg width="48" height="48" viewBox="0 0 72 72" style={{ flexShrink: 0 }}>
                      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"/>
                      <circle
                        cx="36" cy="36" r={r}
                        fill="none"
                        stroke={timerColor}
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={circ * (1 - progress)}
                        transform="rotate(-90 36 36)"
                        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.4s ease", filter: `drop-shadow(0 0 4px ${timerColor})` }}
                      />
                      <text x="36" y="40" textAnchor="middle"
                        style={{ fontFamily:"var(--font-mono)", fontSize:13, fill: timerColor, fontWeight:400 }}>
                        {timeLeft}
                      </text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* ── Question card ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  className="iv-q-card"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="iv-q-inner">
                    {/* Card head */}
                    <div className="iv-q-head">
                      <div className="iv-q-num">
                        <span className="iv-q-num-badge">Q{currentIndex + 1}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <IcoClock />
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(140,160,200,0.35)" }}>
                          {THINK_TIME}s think · {ANSWER_TIME}s answer
                        </span>
                      </div>
                    </div>

                    {/* Question */}
                    <p className="iv-q-text">{currentQuestion.question}</p>

                    {/* Rationale */}
                    <div className="iv-rationale">
                      <p className="iv-rationale-label">Why this question</p>
                      <p className="iv-rationale-text">{currentQuestion.rationale}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* ── Voice recorder ── */}
              <VoiceRecorder
                key={`recorder-${currentIndex}`}
                onTranscript={(text) => setTranscript(text)}
              />

              {/* ── Saved indicator ── */}
              <AnimatePresence>
                {saved && (
                  <motion.div
                    className="iv-saved"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <IcoCheck /> Answer saved
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Navigation ── */}
              <div className="iv-nav">
                <button
                  className="iv-btn-prev"
                  onClick={() => setCurrentIndex(i => i - 1)}
                  disabled={currentIndex === 0}
                >
                  <IcoBack /> Prev
                </button>
                <button
                  className="iv-btn-next"
                  onClick={handleNext}
                  disabled={submitting}
                >
                  {submitting
                    ? <><Loader2 size={14} style={{ animation: "ivSpin 1s linear infinite" }} />Saving…</>
                    : isLast
                    ? <>Finish Interview <IcoCheck /></>
                    : <>Next Question <IcoArrow /></>
                  }
                </button>
              </div>

              {/* ── Footer ── */}
              <div className="talyn-footer" style={{ justifyContent: "center" }}>
                <div className="talyn-footer-line" />
                <span className="talyn-footer-text">Built by Priyanka for SWE1904</span>
                <div className="talyn-footer-line" />
              </div>

            </motion.div>
          )}
        </div>
      </>
    );
  }