import { User, Course, AttendanceRecord } from "./types";

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Dr. Sarah Jenkins",
    email: "sarah.jenkins@univ.edu",
    role: "teacher",
  },
  {
    id: "u2",
    name: "Alex Rivera",
    email: "alex.rivera@student.univ.edu",
    role: "student",
  },
];

export const mockCourses: Course[] = [
  {
    id: "c1",
    code: "CS101",
    name: "Data Structures & Algorithms",
    instructor: "Dr. Sarah Jenkins",
    totalStudents: 45,
  },
  {
    id: "c2",
    code: "CS102",
    name: "Database Management Systems",
    instructor: "Prof. Michael Vance",
    totalStudents: 38,
  },
  {
    id: "c3",
    code: "CS103",
    name: "Machine Learning Foundations",
    instructor: "Dr. Alan Turing",
    totalStudents: 50,
  },
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "rec-1",
    studentId: "s101",
    studentName: "Alex Rivera",
    rollNumber: "2024CS001",
    courseCode: "CS101",
    date: "2026-10-07",
    status: "Present",
    timestamp: "09:02 AM",
  },
  {
    id: "rec-2",
    studentId: "s102",
    studentName: "Bianca Chen",
    rollNumber: "2024CS002",
    courseCode: "CS101",
    date: "2026-10-07",
    status: "Present",
    timestamp: "09:05 AM",
  },
  {
    id: "rec-3",
    studentId: "s103",
    studentName: "Charlie Miller",
    rollNumber: "2024CS003",
    courseCode: "CS101",
    date: "2026-10-07",
    status: "Absent",
    timestamp: "--",
  },
  {
    id: "rec-4",
    studentId: "s104",
    studentName: "David Kim",
    rollNumber: "2024CS004",
    courseCode: "CS101",
    date: "2026-10-07",
    status: "Late",
    timestamp: "09:22 AM",
  },
  {
    id: "rec-5",
    studentId: "s105",
    studentName: "Emma Watson",
    rollNumber: "2024CS005",
    courseCode: "CS101",
    date: "2026-10-07",
    status: "Present",
    timestamp: "08:58 AM",
  },
];