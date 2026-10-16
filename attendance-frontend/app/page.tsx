import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">System Overview</h1>
        <p className="text-sm text-slate-400 mt-1">
          Real-time institutional attendance analytics and navigation portal.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium">Active Courses</span>
          <p className="text-3xl font-bold text-white mt-2">3</p>
          <span className="text-xs text-slate-500 mt-1 block">CS Department Roster</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium">Total Enrolled</span>
          <p className="text-3xl font-bold text-white mt-2">133</p>
          <span className="text-xs text-slate-500 mt-1 block">Students across courses</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium">Today's Attendance</span>
          <p className="text-3xl font-bold text-green-400 mt-2">80%</p>
          <span className="text-xs text-slate-500 mt-1 block">Average present rate</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium">Backend Hook Status</span>
          <p className="text-3xl font-bold text-green-400 mt-2">Ready</p>
          <span className="text-xs text-slate-500 mt-1 block">FastAPI + ArcFace layer active</span>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/scan">
          <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition group cursor-pointer h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-950 border border-blue-800 rounded-lg text-blue-400">
                  📷
                </div>
                <span className="text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                  Start Scanner →
                </span>
              </div>
              <h3 className="font-bold text-lg text-white mb-1">Live Scanner</h3>
              <p className="text-xs text-slate-400">
                Launch real-time webcam facial recognition and mark attendance automatically.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/attendance">
          <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition group cursor-pointer h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-slate-800 rounded-lg">📋</div>
                <span className="text-xs font-semibold text-slate-400 group-hover:translate-x-1 transition-transform">
                  View Logs →
                </span>
              </div>
              <h3 className="font-bold text-lg text-white mb-1">Attendance Logs</h3>
              <p className="text-xs text-slate-400">
                Filter class attendance, verify confidence scores, and view real-time entry timestamps.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/enroll">
          <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition group cursor-pointer h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-slate-800 rounded-lg">👤</div>
                <span className="text-xs font-semibold text-slate-400 group-hover:translate-x-1 transition-transform">
                  Enroll →
                </span>
              </div>
              <h3 className="font-bold text-lg text-white mb-1">Enroll Student</h3>
              <p className="text-xs text-slate-400">
                Capture multi-pose 5-second scan and store normalized ArcFace embeddings in PostgreSQL.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}