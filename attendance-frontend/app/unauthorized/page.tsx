"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="rounded-full bg-rose-500/10 p-4 border border-rose-500/20">
        <svg
          className="h-10 w-10 text-rose-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          You do not have the required role permissions to view this resource. Please log in with an administrative account.
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/attendance"
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          Go to Attendance
        </Link>
        <Link
          href="/login"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}