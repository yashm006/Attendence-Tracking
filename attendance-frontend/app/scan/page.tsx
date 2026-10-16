"use client";

import { useState } from "react";
import WebcamScanner from "@/components/WebcamScanner";

export default function LiveScanPage() {
  const [courseCode, setCourseCode] = useState("CS301");

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center gap-6">
      <div className="w-full max-w-xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
        <div>
          <h1 className="text-xl font-bold text-blue-400">Live Attendance Scanner</h1>
          <p className="text-xs text-slate-400">Position student face in front of the webcam</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-300">Course Code:</label>
          <input
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="w-24 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-sm text-center font-mono text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <WebcamScanner courseCode={courseCode} />
    </div>
  );
}