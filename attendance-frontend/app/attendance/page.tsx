"use client";

import { useState, useEffect } from "react";
import { exportAttendanceToCSV } from "../../lib/exportCsv";
import { AttendanceRecord, Course, AttendanceStatus } from "../../types";
import { fetchCourses, fetchAttendanceRecords, updateAttendanceStatus } from "../../lib/api";
import AttendanceTable from "../../components/AttendanceTable";
import WebcamScanner from "../../components/WebcamScanner";

export default function AttendancePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [scannerNotification, setScannerNotification] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const courseList = await fetchCourses();
        setCourses(courseList);
        const initialCourse = courseList[0]?.code || "";
        setSelectedCourse(initialCourse);

        const attendanceList = await fetchAttendanceRecords(initialCourse);
        setRecords(attendanceList);
      } catch (error) {
        console.error("Failed to load attendance data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCourseChange = async (courseCode: string) => {
    setSelectedCourse(courseCode);
    setLoading(true);
    try {
      const updatedRecords = await fetchAttendanceRecords(courseCode);
      setRecords(updatedRecords);
    } catch (error) {
      console.error("Failed to filter records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: AttendanceStatus) => {
    try {
      const updated = await updateAttendanceStatus(id, newStatus);
      setRecords((prev) =>
        prev.map((rec) => (rec.id === id ? updated : rec))
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleFaceDetected = async (studentName: string) => {
    const matchingRecord = records.find(
      (r) => r.studentName.toLowerCase() === studentName.toLowerCase()
    );

    if (matchingRecord && matchingRecord.status !== "Present") {
      await handleStatusChange(matchingRecord.id, "Present");
      setScannerNotification(`Auto-logged: Marked ${studentName} as Present!`);
      setTimeout(() => setScannerNotification(null), 4000);
    }
  };

  const presentCount = records.filter((r) => r.status === "Present").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;
  const lateCount = records.filter((r) => r.status === "Late").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Tracking</h1>
          <p className="text-muted-foreground">
            View and manage real-time class attendance logs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Export CSV Button */}
          <button
            onClick={() => exportAttendanceToCSV(records, selectedCourse)}
            className="rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
          >
            Export CSV
          </button>

          {/* Camera Toggle Button */}
          <button
            onClick={() => setShowScanner(!showScanner)}
            className="rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow transition-opacity hover:opacity-90"
          >
            {showScanner ? "Hide Scanner" : "Launch Camera Scanner"}
          </button>

          {/* Course Filter Dropdown */}
          <div className="flex items-center space-x-2">
            <label htmlFor="course-select" className="text-sm font-medium text-muted-foreground">
              Course:
            </label>
            <select
              id="course-select"
              value={selectedCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.code}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Auto-Detection Notification Banner */}
      {scannerNotification && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-500">
          {scannerNotification}
        </div>
      )}

      {/* Embedded Camera Scanner Section */}
      {showScanner && (
        <div className="my-6">
          <WebcamScanner onFaceDetected={handleFaceDetected} />
        </div>
      )}

      {/* Quick Metrics Bar */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground">Total Enrolled</span>
          <p className="mt-1 text-2xl font-bold">{records.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground">Present</span>
          <p className="mt-1 text-2xl font-bold text-emerald-500">{presentCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground">Absent</span>
          <p className="mt-1 text-2xl font-bold text-rose-500">{absentCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground">Late</span>
          <p className="mt-1 text-2xl font-bold text-amber-500">{lateCount}</p>
        </div>
      </div>

      {/* Attendance Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <span className="text-sm text-muted-foreground">Loading attendance data...</span>
        </div>
      ) : (
        <AttendanceTable records={records} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}