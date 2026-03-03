"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Loader2 } from "lucide-react";

export default function IdentityPage() {
  const router = useRouter();

  const [idImage, setIdImage] = useState<File | null>(null);
  const [liveImage, setLiveImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Start Camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      } catch (err) {
        setError("Camera access denied. Please allow camera permissions.");
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
  };

  // Capture Frame from Video
  const captureLivePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "live_photo.jpg", {
          type: "image/jpeg",
        });
        setLiveImage(file);
      }
    }, "image/jpeg");
  };

  // Verify Identity
  const handleVerify = async () => {
    if (!idImage || !liveImage) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("id_image", idImage);
      formData.append("live_image", liveImage);

      const res = await fetch("http://localhost:8002/identity/verify", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Verification failed");
      if (!data.verified)
        throw new Error("Face verification failed. Please retry.");

      stopCamera();

      router.push(`/contact?verification_id=${data.verification_id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#000000] font-sans text-slate-200 selection:bg-indigo-500/30">

      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-[#0891b2] opacity-20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[#7c3aed] opacity-20 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20">

        {/* Branding Header */}
        <header className="mb-14 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-slate-300 backdrop-blur-md"
          >
            <Sparkles className="h-3 w-3 text-cyan-400" />
            <span>AI Hiring Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 sm:text-7xl"
          >
            Talyn
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-xl text-lg text-slate-400/80 font-light"
          >
            Rebuilding Hiring, End to End.
          </motion.p>
        </header>

        {/* Glass Console */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-[2.5rem] border border-white/10 bg-black/40 p-10 shadow-2xl backdrop-blur-[50px]"
        >
          <div className="space-y-10">

            <h2 className="text-xl font-semibold text-center text-slate-300">
              Please verify your Identity with a Valid ID to Continue
            </h2>

            {/* ID Upload */}
            <div className="space-y-3">
              <label className="text-sm text-slate-400">
                Upload Government ID
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setIdImage(e.target.files?.[0] || null)}
                className="block w-full rounded-xl border border-white/10 bg-black/40 p-3"
              />
            </div>

            {/* Live Camera Full Width */}
            <div className="space-y-4">
              <label className="text-sm text-slate-400">
                Live Camera Capture
              </label>

              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full"
                />
              </div>

              <button
                onClick={captureLivePhoto}
                disabled={!cameraReady}
                className="w-full rounded-xl bg-white/10 py-3 hover:bg-white/20 transition disabled:opacity-40"
              >
                Capture Photo
              </button>

              {liveImage && (
                <p className="text-sm text-emerald-400 text-center">
                  Live photo captured successfully
                </p>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={!idImage || !liveImage || loading}
              className="w-full rounded-2xl bg-white/10 py-5 text-base font-semibold transition-all duration-300 hover:bg-white/20 disabled:opacity-40"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-cyan-300" />
                  Verify & Continue
                </div>
              )}
            </button>

            {error && (
              <div className="rounded-xl bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
                {error}
              </div>
            )}

          </div>
        </motion.div>

      </div>
    </main>
  );
}