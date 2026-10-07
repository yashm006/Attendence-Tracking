import { AttendanceRecord, Course, AttendanceStatus } from "../types";
import { mockAttendanceRecords, mockCourses } from "../mockData";

// Simulated network delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchCourses(): Promise<Course[]> {
  await delay(300);
  return [...mockCourses];
}

export async function fetchAttendanceRecords(courseCode?: string): Promise<AttendanceRecord[]> {
  await delay(400);
  if (courseCode) {
    return mockAttendanceRecords.filter((rec) => rec.courseCode === courseCode);
  }
  return [...mockAttendanceRecords];
}

export async function updateAttendanceStatus(
  recordId: string,
  newStatus: AttendanceStatus
): Promise<AttendanceRecord> {
  await delay(300);
  const record = mockAttendanceRecords.find((r) => r.id === recordId);
  if (!record) {
    throw new Error("Record not found");
  }
  record.status = newStatus;
  if (newStatus === "Absent") {
    record.timestamp = "--";
  } else if (record.timestamp === "--") {
    const now = new Date();
    record.timestamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return { ...record };
}