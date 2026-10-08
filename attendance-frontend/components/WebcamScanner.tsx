"use client";

import { useEffect, useRef, useState } from "react";

interface WebcamScannerProps {
  onFaceDetected?: (studentName: string) => void;
}

export default function WebcamScanner({ onFaceDetected }: WebcamScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Camera Offline");
  const [recognizedUser, setRecognizedUser] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setStatusMessage("Scanning for faces...");
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setStatusMessage("Unable to access camera permission");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      setStatusMessage("Camera Offline");
      setRecognizedUser(null);
    }
  };

  // Simulate periodic face detection scanning
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      // Draw frame to hidden/overlay canvas if needed
      if (videoRef.current && canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.drawImage(
            videoRef.current,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        }
      }

      // Simulate match trigger (random check for prototype display)
      const mockStudents = ["Alex Rivera", "Bianca Chen", "Emma Watson"];
      const match = mockStudents[Math.floor(Math.random() * mockStudents.length)];
      setRecognizedUser(match);
      setStatusMessage(`Face Verified: ${match}`);

      if (onFaceDetected) {
        onFaceDetected(match);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isStreaming, onFaceDetected]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="relative aspect-video w-full max-w-lg overflow-hidden rounded-xl bg-black/90 shadow-inner">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full object-cover ${!isStreaming ? "hidden" : ""}`}
        />
        <canvas ref={canvasRef} width={640} height={480} className="hidden" />

        {!isStreaming && (
          <div className="flex h-full w-full flex-col items-center justify-center space-y-2 text-muted-foreground">
            <svg
              className="h-12 w-12 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs font-medium">Webcam Stream Disconnected</span>
          </div>
        )}

        {/* Live Facial Targeting Overlay Reticle */}
        {isStreaming && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative h-48 w-48 rounded-2xl border-2 border-dashed border-emerald-500/70 bg-emerald-500/5 animate-pulse flex items-center justify-center">
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-black/60 px-2 py-0.5 rounded">
                Targeting Reticle
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons & Detection Banner */}
      <div className="flex w-full max-w-lg items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isStreaming ? "bg-emerald-500 animate-ping" : "bg-rose-500"
            }`}
          />
          <span className="text-xs font-medium text-muted-foreground">{statusMessage}</span>
        </div>

        <div>
          {!isStreaming ? (
            <button
              onClick={startCamera}
              className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-500 transition-colors"
            >
              Start Camera
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-rose-500 transition-colors"
            >
              Stop Camera
            </button>
          )}
        </div>
      </div>
    </div>
  );
}