"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

        if (!res.ok) {
          throw new Error("Failed to fetch questions");
        }

        setQuestions(data.questions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [sessionId, router]);

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

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
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
    <main className="min-h-screen bg-black text-slate-200 px-6 py-16">

      <div className="max-w-3xl mx-auto space-y-8">

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push(`/resume?session_id=${sessionId}`)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <span className="text-sm text-slate-500">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
        >
          <h2 className="text-2xl font-semibold mb-6">
            {currentQuestion.question}
          </h2>

          <p className="text-slate-400 text-sm">
            {currentQuestion.rationale}
          </p>
        </motion.div>

        {/* Controls */}
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
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            {currentIndex === questions.length - 1
              ? "Finish"
              : "Next"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </main>
  );
}