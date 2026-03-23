"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React from "react";

/* ─────────────────────────────────────────────
   STEP DOT
───────────────────────────────────────────── */
function StepDot({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <div style={{
      width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-mono)", fontSize: 11,
      background: done ? "rgba(34,211,238,0.12)" : active ? "rgba(34,211,238,0.07)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${done || active ? "rgba(34,211,238,0.38)" : "rgba(255,255,255,0.09)"}`,
      color: done || active ? "#22d3ee" : "rgba(150,170,200,0.35)",
      boxShadow: active ? "0 0 14px rgba(34,211,238,0.18)" : "none",
      transition: "all 0.4s ease",
    }}>
      {done
        ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round"><path d="M2 6l3 3 5-5"/></svg>
        : n}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const IcoUpload = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const IcoCamera = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);
const IcoShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M3 8l4 4 6-6"/>
  </svg>
);
const IcoID = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <circle cx="8" cy="12" r="2.5"/>
    <path d="M13 10h5M13 14h3"/>
  </svg>
);
const IcoSparkles = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
    <path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75z" opacity="0.4"/>
  </svg>
);

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function IdentityPage() {
  const router = useRouter();

  const [idImage,     setIdImage]     = useState<File | null>(null);
  const [liveImage,   setLiveImage]   = useState<File | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [captured,    setCaptured]    = useState(false);

  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) { videoRef.current.srcObject = stream; setCameraReady(true); }
      } catch { setError("Camera access denied. Please allow camera permissions."); }
    })();
    return () => (videoRef.current?.srcObject as MediaStream)?.getTracks().forEach(t => t.stop());
  }, []);

  const captureLivePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current, c = canvasRef.current;
    c.width = v.videoWidth; c.height = v.videoHeight;
    const ctx = c.getContext("2d"); if (!ctx) return;
    ctx.drawImage(v, 0, 0);
    c.toBlob(blob => {
      if (blob) { setLiveImage(new File([blob], "live_photo.jpg", { type: "image/jpeg" })); setCaptured(true); }
    }, "image/jpeg");
  };

  const handleVerify = async () => {
    if (!idImage || !liveImage) return;
    setLoading(true); setError(null);
    try {
      const fd = new FormData();
      fd.append("id_image", idImage); fd.append("live_image", liveImage);
      const res  = await fetch("http://localhost:8002/identity/verify", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok)        throw new Error(data.detail || "Verification failed");
      if (!data.verified) throw new Error("Face verification failed. Please retry.");
      (videoRef.current?.srcObject as MediaStream)?.getTracks().forEach(t => t.stop());
      router.push(`/contact?verification_id=${data.verification_id}`);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const step1Done = !!idImage;
  const step2Done = !!liveImage;
  const canVerify = step1Done && step2Done && !loading;

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
  const rise = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
  };

  return (
    <>
      <style>{`
        .id-page {
          min-height: 100vh;
          background: var(--bg);
          font-family: var(--font-body);
          position: relative;
          padding: 48px 24px 72px;
          overflow-x: hidden;
        }
        .id-wrap {
          position: relative; z-index: 2;
          max-width: 580px; margin: 0 auto;
          display: flex; flex-direction: column;
          align-items: center; gap: 24px;
          text-align: center;
        }

        /* ── Logo ── */
        .id-logo {
          font-family: var(--font-display);
          font-weight: 700; font-style: normal;
          font-size: clamp(48px, 9vw, 76px);
          line-height: 1; letter-spacing: -0.03em;
          background: linear-gradient(180deg, #ffffff 0%, #ffffff 45%, rgba(255,255,255,0.48) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          filter: drop-shadow(0 0 28px rgba(255,255,255,0.07));
          user-select: none;
        }
        .id-logo-rule {
          width: 72px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent);
        }
        .id-subtitle {
          font-size: 13px; font-weight: 300;
          color: rgba(200,215,235,0.50); letter-spacing: 0.01em;
        }

        /* ── Step tracker ── */
        .id-steps {
          display: flex; align-items: center; width: 100%;
          padding: 14px 20px; border-radius: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(16px);
        }
        .id-step-item { display: flex; align-items: center; gap: 9px; flex: 1; }
        .id-step-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .id-step-line-done { background: linear-gradient(90deg, rgba(34,211,238,0.45), rgba(34,211,238,0.15)); }
        .id-step-label {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.14em; text-transform: uppercase;
        }
        .id-step-active { color: rgba(34,211,238,0.75); }
        .id-step-done   { color: rgba(34,211,238,0.45); }
        .id-step-idle   { color: rgba(150,160,180,0.30); }

        /* ── Console ── */
        .id-console {
          width: 100%;
          border-radius: 32px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.40);
          backdrop-filter: blur(50px);
          -webkit-backdrop-filter: blur(50px);
          box-shadow: 0 25px 60px rgba(0,0,0,0.50), 0 1px 0 rgba(255,255,255,0.06) inset;
          position: relative; overflow: hidden;
        }
        .id-console::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 30%, rgba(34,211,238,0.14) 50%, rgba(255,255,255,0.12) 70%, transparent 100%);
          pointer-events: none;
        }
        .id-console-inner {
          padding: 28px 30px;
          display: flex; flex-direction: column; gap: 24px;
          position: relative;
        }

        /* ── Section head ── */
        .id-section-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .id-section-icon {
          width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(34,211,238,0.07);
          border: 1px solid rgba(34,211,238,0.18);
          color: rgba(34,211,238,0.80);
        }
        .id-section-title {
          font-family: var(--font-display); font-weight: 700; font-size: 20px;
          letter-spacing: -0.01em; color: var(--text-primary); line-height: 1;
        }
        .id-section-sub {
          font-size: 12px; font-weight: 300;
          color: rgba(180,195,230,0.48); margin-top: 3px;
        }

        /* ── Divider ── */
        .id-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
        }

        /* ── Upload zone ── */
        .id-upload-zone {
          position: relative; border-radius: 14px;
          border: 1px dashed rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.03);
          padding: 24px 20px; text-align: center;
          cursor: pointer; transition: all 0.28s ease; overflow: hidden;
        }
        .id-upload-zone:hover {
          border-color: rgba(34,211,238,0.30);
          background: rgba(34,211,238,0.04);
        }
        .id-upload-zone.has-file {
          border-color: rgba(34,211,238,0.32); border-style: solid;
          background: rgba(34,211,238,0.05);
        }
        .id-upload-zone input[type="file"] {
          position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
        }
        .id-upload-icon { color: rgba(34,211,238,0.50); margin: 0 auto 10px; }
        .id-upload-text { font-size: 13px; font-weight: 500; color: rgba(200,215,235,0.65); }
        .id-upload-hint {
          font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.10em;
          color: rgba(140,160,200,0.32); margin-top: 4px;
        }
        .id-upload-success {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 13px; font-weight: 500; color: #22d3ee;
        }

        /* ── Camera ── */
        .id-camera-wrap {
          border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(0,0,0,0.4);
          position: relative; aspect-ratio: 16/9;
        }
        .id-camera-wrap video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .id-cam-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.20) 100%);
          pointer-events: none;
        }
        .id-bracket { position: absolute; width: 18px; height: 18px; border-color: rgba(34,211,238,0.45); border-style: solid; }
        .id-bracket-tl { top: 10px; left: 10px;   border-width: 1.5px 0 0 1.5px; border-radius: 3px 0 0 0; }
        .id-bracket-tr { top: 10px; right: 10px;  border-width: 1.5px 1.5px 0 0; border-radius: 0 3px 0 0; }
        .id-bracket-bl { bottom: 10px; left: 10px;  border-width: 0 0 1.5px 1.5px; border-radius: 0 0 0 3px; }
        .id-bracket-br { bottom: 10px; right: 10px; border-width: 0 1.5px 1.5px 0; border-radius: 0 0 3px 0; }
        .id-captured-badge {
          position: absolute; top: 10px; right: 10px;
          display: flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 999px;
          background: rgba(34,211,238,0.12);
          border: 1px solid rgba(34,211,238,0.30);
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #22d3ee; backdrop-filter: blur(8px);
        }

        /* ── Capture btn ── */
        .id-capture-btn {
          width: 100%; padding: 12px; border-radius: 12px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: var(--font-body); font-size: 13px; font-weight: 500;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(200,215,235,0.65);
          transition: all 0.24s ease;
        }
        .id-capture-btn:hover:not(:disabled) {
          background: rgba(34,211,238,0.07);
          border-color: rgba(34,211,238,0.24);
          color: #22d3ee;
        }
        .id-capture-btn:disabled { opacity: 0.30; cursor: not-allowed; }

        /* ── Progress dots ── */
        .id-progress { display: flex; gap: 6px; justify-content: center; }
        .id-progress-dot { width: 6px; height: 6px; border-radius: 50%; transition: all 0.35s ease; }

        /* ── Verify btn ── */
        .id-verify-btn {
          width: 100%; padding: 15px; border-radius: 16px; border: none; cursor: pointer;
          font-family: var(--font-body); font-size: 14px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          transition: all 0.28s ease;
        }
        .id-verify-btn:not(:disabled) {
          background: linear-gradient(135deg, rgba(34,211,238,0.18) 0%, rgba(8,145,178,0.15) 100%);
          border: 1px solid rgba(34,211,238,0.35);
          color: rgba(34,211,238,0.95);
          box-shadow: 0 4px 24px rgba(34,211,238,0.12), 0 0 0 1px rgba(34,211,238,0.08) inset;
        }
        .id-verify-btn:not(:disabled):hover {
          background: linear-gradient(135deg, rgba(34,211,238,0.26) 0%, rgba(8,145,178,0.22) 100%);
          border-color: rgba(34,211,238,0.52);
          box-shadow: 0 6px 32px rgba(34,211,238,0.22), 0 0 0 1px rgba(34,211,238,0.12) inset;
          transform: translateY(-2px);
        }
        .id-verify-btn:disabled {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(160,175,200,0.28); cursor: not-allowed;
        }

        /* ── Error ── */
        .id-error {
          border-radius: 12px; padding: 12px 16px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.18);
          font-size: 13px; color: rgba(252,165,165,0.85); text-align: center;
        }

        @keyframes idSpin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="id-page">
        {/* Shared ambient glows */}
        <div className="talyn-glow-1" />
        <div className="talyn-glow-2" />

        <motion.div
          className="id-wrap"
          variants={stagger}
          initial="hidden"
          animate="show"
        >

          {/* ── Logo ── */}
          <motion.div variants={rise} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <h1 className="id-logo">Talyn</h1>
            <div className="id-logo-rule" />
            <p className="id-subtitle">Identity Verification — Step 1 of 3</p>
          </motion.div>

          {/* ── Badge ── */}
          <motion.div variants={rise}>
            <span className="talyn-badge">
              <span className="talyn-badge-dot" />
              <IcoSparkles />
              Secure · Encrypted · Private
            </span>
          </motion.div>

          {/* ── Step tracker ── */}
          <motion.div variants={rise} style={{ width: "100%" }}>
            <div className="id-steps">
              <div className="id-step-item">
                <StepDot n={1} active={!step1Done} done={step1Done} />
                <span className={`id-step-label ${step1Done ? "id-step-done" : "id-step-active"}`}>ID Upload</span>
              </div>
              <div className={`id-step-line ${step1Done ? "id-step-line-done" : ""}`} />
              <div className="id-step-item">
                <StepDot n={2} active={step1Done && !step2Done} done={step2Done} />
                <span className={`id-step-label ${step2Done ? "id-step-done" : step1Done ? "id-step-active" : "id-step-idle"}`}>Face Scan</span>
              </div>
              <div className={`id-step-line ${step2Done ? "id-step-line-done" : ""}`} />
              <div className="id-step-item">
                <StepDot n={3} active={step1Done && step2Done} done={false} />
                <span className={`id-step-label ${step1Done && step2Done ? "id-step-active" : "id-step-idle"}`}>Verify</span>
              </div>
            </div>
          </motion.div>

          {/* ── Main console ── */}
          <motion.div variants={rise} style={{ width: "100%" }}>
            <div className="id-console">
              <div className="id-console-inner">

                {/* Step 1 — ID Upload */}
                <div>
                  <div className="id-section-head">
                    <div className="id-section-icon"><IcoID /></div>
                    <div>
                      <p className="id-section-title">Government ID</p>
                      <p className="id-section-sub">Passport, driver's licence, or national ID</p>
                    </div>
                  </div>
                  <div className={`id-upload-zone ${idImage ? "has-file" : ""}`}>
                    <input type="file" accept="image/*" onChange={e => setIdImage(e.target.files?.[0] || null)} />
                    {idImage
                      ? <div className="id-upload-success"><IcoCheck />{idImage.name}</div>
                      : <>
                          <div className="id-upload-icon"><IcoUpload /></div>
                          <p className="id-upload-text">Click or drag to upload your ID</p>
                          <p className="id-upload-hint">JPG · PNG · WEBP · Max 10MB</p>
                        </>
                    }
                  </div>
                </div>

                <div className="id-divider" />

                {/* Step 2 — Camera */}
                <div>
                  <div className="id-section-head">
                    <div className="id-section-icon"><IcoCamera /></div>
                    <div>
                      <p className="id-section-title">Live Face Capture</p>
                      <p className="id-section-sub">Look directly at the camera and hold still</p>
                    </div>
                  </div>
                  <div className="id-camera-wrap">
                    <video ref={videoRef} autoPlay playsInline />
                    <div className="id-cam-overlay" />
                    <div className="id-bracket id-bracket-tl" />
                    <div className="id-bracket id-bracket-tr" />
                    <div className="id-bracket id-bracket-bl" />
                    <div className="id-bracket id-bracket-br" />
                    {captured && (
                      <div className="id-captured-badge"><IcoCheck />Captured</div>
                    )}
                  </div>
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                  <div style={{ marginTop: 10 }}>
                    <button className="id-capture-btn" onClick={captureLivePhoto} disabled={!cameraReady}>
                      <IcoCamera />
                      {captured ? "Retake Photo" : "Capture Photo"}
                    </button>
                  </div>
                </div>

                <div className="id-divider" />

                {/* Step 3 — Verify */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div className="id-progress">
                    {[step1Done, step2Done].map((done, i) => (
                      <div key={i} className="id-progress-dot" style={{
                        background: done ? "#22d3ee" : "rgba(255,255,255,0.09)",
                        boxShadow: done ? "0 0 8px rgba(34,211,238,0.50)" : "none",
                      }} />
                    ))}
                  </div>
                  <button className="id-verify-btn" onClick={handleVerify} disabled={!canVerify}>
                    {loading
                      ? <><Loader2 size={16} style={{ animation: "idSpin 1s linear infinite" }} />Verifying identity…</>
                      : <><IcoShield />Verify &amp; Continue</>
                    }
                  </button>
                  {error && <div className="id-error">{error}</div>}
                </div>

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