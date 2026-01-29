"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  FileText, 
  Sparkles, 
  X,
  Loader2,
  Briefcase,
  Cpu,
  ArrowRight
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Question = {
  question: string;
  rationale: string;
};

export default function Home() {
  const [role, setRole] = useState("Backend Intern");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setQuestions([]);

    try {
      const formData = new FormData();
      formData.append("role", role);
      formData.append("resume", file);

      // Replace with your actual endpoint
      const res = await fetch("/api/orchestrate", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to generate questions");
      setQuestions(data.questions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#000000] font-sans text-slate-200 selection:bg-indigo-500/30">
      
      {/* --- 1. Ambient Background (Vibrant for Glass Effect) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Top Right - Cyan/Teal */}
        <div className="absolute top-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-[#0891b2] opacity-20 blur-[120px]" />
        
        {/* Bottom Left - Violet/Fuchsia */}
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[#7c3aed] opacity-20 blur-[140px]" />
        
        {/* Center - Deep Indigo Pulse */}
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[20%] left-[30%] h-[500px] w-[500px] rounded-full bg-[#4f46e5] opacity-20 blur-[120px]" 
        />
        
        {/* Cinematic Grain Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20">
        
        {/* --- 2. Header --- */}
        <header className="mb-14 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-slate-300 backdrop-blur-md"
          >
            <Sparkles className="h-3 w-3 text-cyan-400" />
            <span>AI Orchestrator</span>
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
            Liquid intelligence for interview preparation.
          </motion.p>
        </header>

        {/* --- 3. The "Liquid Glass" Console --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="group relative overflow-hidden rounded-[2.5rem] p-1"
        >
          {/* Glass Border Container - Simulates the light catching the edge */}
          <div className="absolute inset-0 rounded-[2.5rem] border border-white/20 bg-gradient-to-b from-white/10 to-white/0 pointer-events-none" />
          
          {/* The Actual Glass Card */}
          <div className="relative h-full w-full overflow-hidden rounded-[2.3rem] bg-black/40 p-8 shadow-2xl backdrop-blur-[50px] backdrop-saturate-150 md:p-12">
            
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />

            <div className="relative z-10 space-y-10">
              
              <div className="grid gap-8 md:grid-cols-2">
                {/* Role Selection */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-300/80 flex items-center gap-2 ml-1">
                    <Briefcase className="w-4 h-4 text-cyan-400" />
                    Target Role
                  </label>
                  <div className="relative group">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-200 transition-all hover:bg-white/10 focus:border-cyan-500/50 focus:bg-black/40 focus:ring-4 focus:ring-cyan-500/10 outline-none backdrop-blur-md"
                    >
                      <option className="bg-[#0a0a0a] text-slate-200">Backend Intern</option>
                      <option className="bg-[#0a0a0a] text-slate-200">ML Intern</option>
                      <option className="bg-[#0a0a0a] text-slate-200">DevOps Intern</option>
                      <option className="bg-[#0a0a0a] text-slate-200">Product Designer</option>
                      <option className="bg-[#0a0a0a] text-slate-200">Frontend Engineer</option>
                    </select>
                    <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-cyan-400 transition-colors">
                      <Cpu className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* File Upload - Liquid Style */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-300/80 flex items-center gap-2 ml-1">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Resume PDF
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFile(e.target.files[0]);
                        setError(null);
                      }
                    }}
                    className="hidden"
                  />
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "relative flex h-[60px] cursor-pointer items-center justify-between rounded-2xl border px-5 transition-all duration-300",
                      file 
                        ? "border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                        : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                    )}
                  >
                    {file ? (
                      <>
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 shadow-sm">
                            <FileText className="h-4 w-4" />
                          </div>
                          <span className="truncate text-sm font-medium text-emerald-100">{file.name}</span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                          className="rounded-full p-1 text-emerald-400/70 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex w-full items-center justify-center gap-2 text-slate-400/80 transition-colors group-hover:text-white">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm font-medium">Click to upload</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Action Button */}
              <button
                onClick={handleGenerate}
                disabled={!file || loading}
                className={cn(
                  "relative w-full overflow-hidden rounded-2xl py-5 text-base font-semibold text-white shadow-xl transition-all duration-300",
                  !file || loading 
                    ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5" 
                    : "bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md hover:scale-[1.01] hover:shadow-cyan-500/20"
                )}
              >
                {/* Active Gradient Overlay for Button */}
                {!loading && file && (
                   <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-600/50 via-indigo-600/50 to-cyan-600/50 opacity-80 blur-xl transition-opacity" />
                )}

                <div className="flex items-center justify-center gap-3 relative z-10">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 text-cyan-300" />
                      <span>Generate Protocol</span>
                      <ArrowRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </button>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-xl bg-red-500/10 px-4 py-3 text-center text-sm text-red-200 ring-1 ring-inset ring-red-500/20"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </motion.div>

        {/* --- 4. Results Section --- */}
        <AnimatePresence>
          {questions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-16 space-y-10 pb-20"
            >
              <div className="flex items-center gap-4 px-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                  Analysis Complete
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              <div className="grid gap-6">
                {questions.map((q, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] hover:border-white/10"
                  >
                    <div className="flex gap-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 font-mono text-lg font-bold text-cyan-400 shadow-inner ring-1 ring-white/10">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-medium text-slate-100">
                          {q.question}
                        </h3>
                        <p className="text-base leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                          {q.rationale}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}