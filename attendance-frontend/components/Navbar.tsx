"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", path: "/" },
    { name: "Attendance", path: "/attendance" },
    { name: "Enrollment", path: "/enroll" },
    { name: "Login", path: "/login" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-base font-bold tracking-tight">
            <span className="rounded-lg bg-primary px-2.5 py-1 text-xs text-primary-foreground font-mono">
              AI
            </span>
            <span>Attendance Portal</span>
          </Link>

          <nav className="hidden md:flex gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-muted text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}