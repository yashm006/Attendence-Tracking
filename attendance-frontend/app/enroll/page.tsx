"use client";

import { useState } from "react";

export default function EnrollPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    courseCode: "CS101",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API registration
    setSubmitted(true);
    setFormData({
      fullName: "",
      email: "",
      rollNumber: "",
      courseCode: "CS101",
    });

    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Enrollment</h1>
        <p className="text-muted-foreground">
          Register new students and assign them to active courses.
        </p>
      </div>

      {submitted && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-500">
          Student registered successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="fullName" className="text-xs font-medium text-muted-foreground">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              required
              placeholder="e.g. Alex Rivera"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="student@univ.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="rollNumber" className="text-xs font-medium text-muted-foreground">
              Roll Number / Student ID
            </label>
            <input
              id="rollNumber"
              type="text"
              required
              placeholder="2026CS101"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="courseCode" className="text-xs font-medium text-muted-foreground">
              Assign Primary Course
            </label>
            <select
              id="courseCode"
              value={formData.courseCode}
              onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="CS101">CS101 - Data Structures & Algorithms</option>
              <option value="CS102">CS102 - Database Management Systems</option>
              <option value="CS103">CS103 - Machine Learning Foundations</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-opacity hover:opacity-90"
        >
          Register Student
        </button>
      </form>
    </div>
  );
}