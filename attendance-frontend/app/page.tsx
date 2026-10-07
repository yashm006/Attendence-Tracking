import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground">
          Real-time institutional attendance analytics and navigation portal.
        </p>
      </section>

      {/* Primary Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground">Active Courses</span>
          <p className="mt-2 text-3xl font-bold">3</p>
          <p className="mt-1 text-xs text-muted-foreground">CS Department Roster</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground">Total Enrolled</span>
          <p className="mt-2 text-3xl font-bold">133</p>
          <p className="mt-1 text-xs text-muted-foreground">Students across courses</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground">Today's Attendance</span>
          <p className="mt-2 text-3xl font-bold text-emerald-500">80%</p>
          <p className="mt-1 text-xs text-muted-foreground">Average present rate</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground">Backend Hook Status</span>
          <p className="mt-2 text-3xl font-bold text-emerald-500">Ready</p>
          <p className="mt-1 text-xs text-muted-foreground">Mock API layer active</p>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/attendance"
            className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </span>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                View Logs &rarr;
              </span>
            </div>
            <h3 className="mt-4 font-semibold text-foreground">Attendance Logs</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Filter class attendance, edit student status, and track real-time logs.
            </p>
          </Link>

          <Link
            href="/enroll"
            className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </span>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                Enroll &rarr;
              </span>
            </div>
            <h3 className="mt-4 font-semibold text-foreground">Enroll Student</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Register new student profiles and map them to primary course rosters.
            </p>
          </Link>

          <Link
            href="/login"
            className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </span>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                Sign In &rarr;
              </span>
            </div>
            <h3 className="mt-4 font-semibold text-foreground">Authentication Portal</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Switch roles between Admin, Instructor, and Student accounts.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}