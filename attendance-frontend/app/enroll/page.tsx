"use client";

import { useState, useRef, useEffect } from "react";
import { registerStudent } from "@/lib/api";

const POSE_INSTRUCTIONS = [
  "Look straight into the camera",
  "Turn your head slightly LEFT",
  "Turn your head slightly RIGHT",
  "Tilt your head slightly UP",
  "Look straight and smile",
];

export default function EnrollPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");

  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setMessage({ type: "error", text: "Unable to access webcam for enrollment." });
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

  const grabSingleFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg", 0.9);
    }
    return null;
  };

  const startMultiPoseScan = () => {
    setCapturedImages([]);
    setIsCapturing(true);
    setCurrentStep(0);
    setMessage(null);

    const frames: string[] = [];
    let step = 0;

    const firstFrame = grabSingleFrame();
    if (firstFrame) frames.push(firstFrame);

    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);

      if (step < 5) {
        const frame = grabSingleFrame();
        if (frame) frames.push(frame);
      } else {
        clearInterval(interval);
        setCapturedImages(frames);
        setIsCapturing(false);
      }
    }, 1000);
  };

  const handleResetScan = () => {
    setCapturedImages([]);
    setCurrentStep(0);
    setIsCapturing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !name || capturedImages.length === 0) {
      setMessage({ type: "error", text: "Please complete the 5-second pose scan before submitting." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await registerStudent(studentId, name, capturedImages);
      setMessage({
        type: "success",
        text: `Student ${res.name} (${res.student_id}) enrolled successfully!`,
      });
      setStudentId("");
      setName("");
      setCapturedImages([]);
      setCurrentStep(0);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to enroll student." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h1 className="text-2xl font-bold text-center text-blue-400">Multi-Pose Student Enrollment</h1>

        {message && (
          <div
            className={`p-4 rounded-lg text-sm font-medium text-center ${
              message.type === "success"
                ? "bg-green-950/80 text-green-300 border border-green-800"
                : "bg-red-950/80 text-red-300 border border-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Student ID / Roll No</label>
              <input
                type="text"
                placeholder="e.g. 2024CS101"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Yash Mathur"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 pt-2">
            <div className="relative w-full max-w-md aspect-video bg-black rounded-xl overflow-hidden border border-slate-800">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
              <canvas ref={canvasRef} className="hidden" />

              {isCapturing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-between p-4">
                  <div className="px-3 py-1 bg-blue-600/90 text-xs font-semibold rounded-full animate-pulse">
                    Capturing Poses: {currentStep + 1} / 5
                  </div>
                  <div className="text-lg font-bold text-yellow-300 text-center drop-shadow-md">
                    {POSE_INSTRUCTIONS[currentStep]}
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all duration-1000"
                      style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {!isCapturing && capturedImages.length === 0 && (
              <button
                type="button"
                onClick={startMultiPoseScan}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition shadow-lg"
              >
                🎥 Start 5-Second Multi-Pose Scan
              </button>
            )}

            {!isCapturing && capturedImages.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-green-400 font-semibold bg-green-950/80 border border-green-800 px-3 py-1.5 rounded-lg">
                  ✓ Recorded {capturedImages.length} Pose Embeddings
                </span>
                <button
                  type="button"
                  onClick={handleResetScan}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium rounded-lg transition"
                >
                  🔄 Rescan Poses
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || isCapturing || capturedImages.length === 0}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl transition"
          >
            {loading ? "Extracting & Averaging Vector Embeddings..." : "Enroll Student"}
          </button>
        </form>
      </div>
    </div>
  );
}