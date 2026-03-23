"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type VoiceRecorderProps = {
  onTranscript: (text: string) => void;
};

const IcoMic = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="13" rx="3"/>
    <path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/>
  </svg>
);
const IcoStop = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="2" width="12" height="12" rx="2"/>
  </svg>
);

export default function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const [recording,  setRecording]  = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) { alert("Speech recognition not supported in this browser."); return; }
    const r = new SR();
    r.lang = "en-US";
    r.continuous = true;
    r.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      setTranscript(text);
      onTranscript(text);
    };
    r.start();
    recognitionRef.current = r;
    setRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  return (
    <>
      <style>{`
        .vr-wrap {
          width: 100%;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.38), 0 1px 0 rgba(255,255,255,0.05) inset;
          position: relative; overflow: hidden;
        }
        .vr-wrap::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.09), rgba(34,211,238,0.10), rgba(255,255,255,0.09), transparent);
          pointer-events: none;
        }
        .vr-inner {
          padding: 22px 24px;
          display: flex; flex-direction: column; gap: 18px;
          position: relative;
        }

        /* ── Header row ── */
        .vr-header {
          display: flex; align-items: center; justify-content: space-between;
        }
        .vr-label {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(140,160,200,0.38);
          display: flex; align-items: center; gap: 7px;
        }
        .vr-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #fb7185;
          box-shadow: 0 0 8px rgba(251,113,133,0.75);
          animation: vrPulse 1.2s ease-in-out infinite;
        }
        @keyframes vrPulse {
          0%,100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.5); }
        }
        .vr-status-text {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(34,211,238,0.55);
        }

        /* ── Waveform ── */
        .vr-wave {
          display: flex; align-items: center;
          justify-content: center; gap: 3px;
          height: 52px; padding: 0 4px;
        }
        .vr-bar {
          width: 3px; border-radius: 99px;
          background: rgba(34,211,238,0.22);
          min-height: 4px;
          transform-origin: center;
        }
        .vr-bar-active { background: #22d3ee; }

        /* ── Buttons ── */
        .vr-btn-start {
          width: 100%; padding: 13px; border-radius: 14px;
          cursor: pointer; border: none;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          font-family: var(--font-body); font-size: 14px; font-weight: 600;
          background: linear-gradient(135deg, rgba(34,211,238,0.16) 0%, rgba(8,145,178,0.13) 100%);
          border: 1px solid rgba(34,211,238,0.32);
          color: rgba(34,211,238,0.90);
          box-shadow: 0 4px 20px rgba(34,211,238,0.10);
          transition: all 0.28s ease;
        }
        .vr-btn-start:hover {
          background: linear-gradient(135deg, rgba(34,211,238,0.24) 0%, rgba(8,145,178,0.20) 100%);
          border-color: rgba(34,211,238,0.50);
          box-shadow: 0 6px 28px rgba(34,211,238,0.18);
          transform: translateY(-1px);
        }
        .vr-btn-stop {
          width: 100%; padding: 13px; border-radius: 14px;
          cursor: pointer; border: none;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          font-family: var(--font-body); font-size: 14px; font-weight: 600;
          background: rgba(251,113,133,0.10);
          border: 1px solid rgba(251,113,133,0.30);
          color: rgba(251,113,133,0.85);
          box-shadow: 0 4px 16px rgba(251,113,133,0.08);
          transition: all 0.28s ease;
        }
        .vr-btn-stop:hover {
          background: rgba(251,113,133,0.16);
          border-color: rgba(251,113,133,0.48);
          box-shadow: 0 6px 24px rgba(251,113,133,0.16);
          transform: translateY(-1px);
        }

        /* ── Transcript box ── */
        .vr-transcript {
          padding: 14px 16px; border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .vr-transcript-label {
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(140,160,200,0.30); margin-bottom: 8px;
        }
        .vr-transcript-text {
          font-size: 13px; font-weight: 300;
          color: rgba(200,215,240,0.70); line-height: 1.65;
        }
      `}</style>

      <div className="vr-wrap">
        <div className="vr-inner">

          {/* Header */}
          <div className="vr-header">
            <span className="vr-label">
              {recording && <span className="vr-live-dot" />}
              Voice Response
            </span>
            {recording && <span className="vr-status-text">Listening…</span>}
          </div>

          {/* Waveform */}
          <div className="vr-wave">
            {Array.from({ length: 28 }).map((_, i) => (
              <motion.div
                key={i}
                className={`vr-bar ${recording ? "vr-bar-active" : ""}`}
                animate={recording
                  ? { scaleY: [1, 2.5 + Math.random() * 2, 1], opacity: [0.5, 1, 0.5] }
                  : { scaleY: 1, opacity: 0.3 }
                }
                transition={recording
                  ? { duration: 0.6 + Math.random() * 0.6, repeat: Infinity, delay: i * 0.04, ease: "easeInOut" }
                  : { duration: 0.3 }
                }
                style={{ height: recording ? undefined : `${8 + Math.sin(i * 0.7) * 6}px` }}
              />
            ))}
          </div>

          {/* Button */}
          <AnimatePresence mode="wait">
            {!recording ? (
              <motion.button
                key="start"
                className="vr-btn-start"
                onClick={startRecording}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <IcoMic />
                Start Answer
              </motion.button>
            ) : (
              <motion.button
                key="stop"
                className="vr-btn-stop"
                onClick={stopRecording}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <IcoStop />
                Stop Recording
              </motion.button>
            )}
          </AnimatePresence>

          {/* Transcript */}
          <AnimatePresence>
            {transcript && (
              <motion.div
                className="vr-transcript"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="vr-transcript-label">Your response</p>
                <p className="vr-transcript-text">{transcript}</p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
}