"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    FaceDetection: any;
    Camera: any;
  }
}

export default function Proctor({ sessionId }: { sessionId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    const loadScript = (src: string) =>
      new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });

    const init = async () => {
      // ✅ Load BOTH scripts from CDN
      await loadScript(
        "https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/face_detection.js"
      );
      await loadScript(
        "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
      );

      if (!videoRef.current || !window.FaceDetection || !window.Camera) {
        console.error("Mediapipe not loaded");
        return;
      }

      const faceDetection = new window.FaceDetection({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
      });

      faceDetection.setOptions({
        model: "short",
        minDetectionConfidence: 0.5,
      });

      let lastLogged = 0;

      faceDetection.onResults(async (results: any) => {
        const faceCount = results.detections?.length || 0;

        if (faceCount > 1) {
          setWarning("⚠ Multiple Faces Detected");

          // ✅ Throttle logging (important)
          if (Date.now() - lastLogged > 5000) {
            lastLogged = Date.now();

            await fetch("http://localhost:8005/interview/proctor-log", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                session_id: sessionId,
                violation: "MULTIPLE_FACES",
                face_count: faceCount,
                timestamp: new Date(),
              }),
            });
          }
        } else {
          setWarning("");
        }
      });

      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          await faceDetection.send({ image: videoRef.current });
        },
        width: 240,
        height: 180,
      });

      camera.start();
    };

    init();
  }, [sessionId]);

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.2)",
        background: "#000",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: 240,
          height: 180,
          objectFit: "cover",
        }}
      />

      {warning && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            background: "rgba(255,0,0,0.7)",
            color: "#fff",
            fontSize: 12,
            textAlign: "center",
            padding: "4px",
          }}
        >
          {warning}
        </div>
      )}
    </div>
  );
}