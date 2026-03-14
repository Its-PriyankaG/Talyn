"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import VoiceRecorder from "@/app/components/VoiceRecorder";

type Question = {
  question: string;
  rationale: string;
};

export default function InterviewPage() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [transcript, setTranscript] = useState("");
  const [saved, setSaved] = useState(false);

  const THINK_TIME = 30;
  const ANSWER_TIME = 60;
  const TOTAL_TIME = THINK_TIME + ANSWER_TIME;

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [phase, setPhase] = useState<"thinking" | "answering">("thinking");

  useEffect(() => {

    if (!sessionId) {
      router.push("/");
      return;
    }

    const fetchQuestions = async () => {

      try {

        const res = await fetch(
          `http://localhost:8004/questions/${sessionId}`
        );

        const data = await res.json();

        if (!res.ok) throw new Error("Failed to fetch questions");

        setQuestions(data.questions);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    };

    fetchQuestions();

  }, [sessionId, router]);

  useEffect(() => {

    if (!questions.length) return;

    setTimeLeft(TOTAL_TIME);
    setPhase("thinking");

    const interval = setInterval(() => {

      setTimeLeft(prev => {

        const next = prev - 1;

        if (next === TOTAL_TIME - THINK_TIME) {
          setPhase("answering");
        }

        if (next <= 0) {
          clearInterval(interval);
          handleNext();
          return 0;
        }

        return next;

      });

    }, 1000);

    return () => clearInterval(interval);

  }, [currentIndex, questions]);

  if (!sessionId) return null;

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading interview...
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white">
        No questions found.
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleNext = async () => {

    const timeTaken = TOTAL_TIME - timeLeft;

    try {

      await fetch("http://localhost:8005/interview/response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          session_id: sessionId,
          question_index: currentIndex,
          question: currentQuestion.question,
          transcript: transcript,
          time_taken: timeTaken
        })
      });

      setSaved(true);

    } catch (err) {
      console.error("Failed to save response", err);
    }

    if (currentIndex < questions.length - 1) {

      setCurrentIndex(currentIndex + 1);
      setTranscript("");
      setSaved(false);

    } else {

      router.push(`/results?session_id=${sessionId}`);

    }

  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (

    <main className="relative min-h-screen bg-black text-slate-200 font-sans">

      <div className="fixed inset-0 z-0 pointer-events-none">

        <div className="absolute top-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-cyan-600 opacity-20 blur-[120px]" />

        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-violet-600 opacity-20 blur-[140px]" />

        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[20%] left-[35%] h-[500px] w-[500px] rounded-full bg-indigo-600 opacity-20 blur-[120px]"
        />

      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 space-y-10">

        <header className="text-center space-y-5">

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-cyan-400"/>
            AI Interview
          </div>

          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50">
            Talyn
          </h1>

        </header>

        <div className="flex justify-between items-center text-sm text-slate-400">

          <button
            onClick={() => router.push(`/resume?session_id=${sessionId}`)}
            className="flex items-center gap-2 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4"/>
            Back
          </button>

          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>

          <div className="flex items-center gap-3">

            <span
              className={`px-3 py-1 rounded-full text-xs ${
                phase === "thinking"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-cyan-500/20 text-cyan-300"
              }`}
            >
              {phase === "thinking" ? "Thinking" : "Answering"}
            </span>

            <span className="font-mono text-lg text-white">
              {timeLeft}s
            </span>

          </div>

        </div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
        >

          <AnimatePresence mode="wait">

            <motion.h2
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-2xl font-semibold mb-6"
            >
              {currentQuestion.question}
            </motion.h2>

          </AnimatePresence>

          <p className="text-slate-400 text-sm">
            {currentQuestion.rationale}
          </p>

        </motion.div>

        <VoiceRecorder
          key={`recorder-${currentIndex}`}
          onTranscript={(text) => setTranscript(text)}
        />

        {saved && (
          <div className="text-green-400 text-sm text-center">
            ✓ Answer saved
          </div>
        )}

        <div className="flex justify-between">

          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="px-6 py-3 rounded-xl bg-white/10 disabled:opacity-30"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20"
          >
            {currentIndex === questions.length - 1 ? "Finish" : "Next"}
            <ArrowRight className="h-4 w-4"/>
          </button>

        </div>

      </div>

    </main>

  );

}