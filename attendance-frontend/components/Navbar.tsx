"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/" },
    { name: "Live Scanner", href: "/scan" },
    { name: "Attendance Logs", href: "/attendance" },
    { name: "Enrollment", href: "/enroll" },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-blue-600 rounded-lg text-xs font-bold text-white">AI</span>
          <span className="text-lg font-bold text-white">Attendance Portal</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <button className="px-3.5 py-1.5 bg-slate-100 text-slate-900 hover:bg-white text-xs font-semibold rounded-lg transition">
          Sign In
        </button>
      </div>
    </header>
  );
}