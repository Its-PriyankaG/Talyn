"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Loader2 } from "lucide-react";

export default function ContactPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const verificationId = searchParams.get("verification_id");

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!verificationId) {
    router.push("/");
    return null;
  }

  const handleContinue = async () => {
    if (!displayName || !email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8001/session/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          verification_id: verificationId,
          display_name: displayName,
          email: email,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create session");

      router.push(`/resume?session_id=${data.session_id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#000000] font-sans text-slate-200">

      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-[#0891b2] opacity-20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[#7c3aed] opacity-20 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20">

        {/* Branding */}
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
            Candidate Contact Details
          </motion.p>
        </header>

        {/* Glass Console */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-[2.5rem] border border-white/10 bg-black/40 p-10 shadow-2xl backdrop-blur-[50px]"
        >
          <div className="space-y-8">

            {/* Back Button */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Identity
            </button>

            {/* Name */}
            <div className="space-y-3">
              <label className="text-sm text-slate-400">
                Full Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="block w-full rounded-xl border border-white/10 bg-black/40 p-3 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Email */}
            <div className="space-y-3">
              <label className="text-sm text-slate-400">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-white/10 bg-black/40 p-3 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!displayName || !email || loading}
              className="w-full rounded-2xl bg-white/10 py-5 text-base font-semibold transition-all duration-300 hover:bg-white/20 disabled:opacity-40"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Session...
                </div>
              ) : (
                "Continue to Resume Upload"
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