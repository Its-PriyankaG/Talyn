"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, Square } from "lucide-react";

type VoiceRecorderProps = {
  onTranscript: (text: string) => void;
};

export default function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {

  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef<any>(null);

  const startRecording = () => {

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;

    recognition.onresult = (event: any) => {

      let text = "";

      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }

      setTranscript(text);
      onTranscript(text);

    };

    recognition.start();
    recognitionRef.current = recognition;

    setRecording(true);

  };

  const stopRecording = () => {

    recognitionRef.current?.stop();
    setRecording(false);

  };

  return (

    <div className="space-y-6">

      {/* Waveform */}

      <div className="flex items-center justify-center gap-1 h-16">

        {Array.from({ length: 20 }).map((_, i) => (

          <motion.div
            key={i}
            animate={recording ? { scaleY: [1, 3, 1] } : { scaleY: 1 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.05
            }}
            className="w-1 bg-cyan-400 rounded-full"
          />

        ))}

      </div>

      {/* Controls */}

      {!recording ? (

        <button
          onClick={startRecording}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
        >
          <Mic className="h-4 w-4"/>
          Start Answer
        </button>

      ) : (

        <button
          onClick={stopRecording}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition"
        >
          <Square className="h-4 w-4"/>
          Stop Answer
        </button>

      )}

      {/* Transcript */}

      {transcript && (

        <div className="bg-white/5 p-4 rounded-xl text-sm text-slate-400">
          {transcript}
        </div>

      )}

    </div>

  );

}