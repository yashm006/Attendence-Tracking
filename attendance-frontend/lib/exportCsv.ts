import { AttendanceRecord } from "../types";

export function exportAttendanceToCSV(records: AttendanceRecord[], courseCode: string) {
  if (!records || records.length === 0) {
    alert("No records available to export.");
    return;
  }

  // Define CSV headers
  const headers = ["Roll Number", "Student Name", "Course Code", "Date", "Status", "Timestamp"];

  // Map rows
  const rows = records.map((record) => [
    `"${record.rollNumber}"`,
    `"${record.studentName}"`,
    `"${record.courseCode}"`,
    `"${record.date}"`,
    `"${record.status}"`,
    `"${record.timestamp}"`,
  ]);

  // Combine headers and rows
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  // Create a Blob and trigger browser download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Attendance_${courseCode}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}