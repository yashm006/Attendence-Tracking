"use client";

import { useEffect, useState } from "react";
import { fetchAttendanceLogs, AttendanceRecord } from "@/lib/api";

export default function AttendancePage() {
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAttendanceLogs();
      setLogs(data);
    } catch (err: any) {
      setError(err.message || "Failed to load attendance logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">Live Attendance Logs</h1>
            <p className="text-sm text-slate-400">Real-time attendance records captured by the facial recognition engine.</p>
          </div>
          <button
            onClick={loadLogs}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium transition"
          >
            🔄 Refresh
          </button>
        </div>

        {error && <div className="p-4 bg-red-950/80 border border-red-800 text-red-300 rounded-xl text-sm">{error}</div>}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading records from server...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No attendance logs recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/60 text-slate-400 uppercase text-xs font-semibold">
                  <tr>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Confidence</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono text-blue-300">{log.student_id}</td>
                      <td className="py-3 px-4 font-medium text-white">{log.student_name}</td>
                      <td className="py-3 px-4 font-semibold text-amber-400">{log.course_code}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-950 text-green-300 border border-green-800 rounded text-xs font-mono">
                          {(log.confidence * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}