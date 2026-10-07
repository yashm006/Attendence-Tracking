export type Role = "admin" | "teacher" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export type AttendanceStatus = "Present" | "Absent" | "Late";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  courseCode: string;
  date: string; // Format: YYYY-MM-DD
  status: AttendanceStatus;
  timestamp: string; // Format: HH:MM AM/PM
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  totalStudents: number;
}