"use client";

import { useEffect, useRef, useState } from "react";
import { verifyFaceFrame, VerificationResponse } from "@/lib/api";

interface WebcamScannerProps {
  courseCode: string;
}

export default function WebcamScanner({ courseCode }: WebcamScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [scanResult, setScanResult] = useState<VerificationResponse | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Webcam access error:", err);
      }
    }
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const base64Image = canvas.toDataURL("image/jpeg", 0.8);

        try {
          const res = await verifyFaceFrame(base64Image, courseCode);
          setScanResult(res);
        } catch (error) {
          console.error("Frame verification error:", error);
        }
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isScanning, courseCode]);

  return (
    <div className="relative w-full max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col items-center gap-4">
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-800">
        {/* -scale-x-100 added here for mirror effect */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover -scale-x-100"
        />
        <canvas ref={canvasRef} className="hidden" />

        {scanResult?.matched && (
          <div className="absolute top-3 left-3 bg-green-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-md">
            ✓ Recognized: {scanResult.student_name} ({scanResult.student_id})
          </div>
        )}
      </div>

      <div className="w-full flex items-center justify-between px-2 text-sm text-slate-400">
        <span>Status: {isScanning ? "Active Scanner" : "Paused"}</span>
        <button
          onClick={() => setIsScanning(!isScanning)}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold rounded-lg transition"
        >
          {isScanning ? "Pause Scanner" : "Resume Scanner"}
        </button>
      </div>
    </div>
  );
}