"use client";

import { AttendanceRecord, AttendanceStatus } from "../types";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onStatusChange: (id: string, newStatus: AttendanceStatus) => void;
}

export default function AttendanceTable({ records, onStatusChange }: AttendanceTableProps) {
  const getStatusBadgeClass = (status: AttendanceStatus) => {
    switch (status) {
      case "Present":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Absent":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "Late":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-6 py-4 font-medium">Roll No</th>
            <th className="px-6 py-4 font-medium">Student Name</th>
            <th className="px-6 py-4 font-medium">Course</th>
            <th className="px-6 py-4 font-medium">Time</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {records.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                No attendance records found.
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{record.rollNumber}</td>
                <td className="px-6 py-4 font-medium">{record.studentName}</td>
                <td className="px-6 py-4 text-muted-foreground">{record.courseCode}</td>
                <td className="px-6 py-4 text-muted-foreground">{record.timestamp}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <select
                    value={record.status}
                    onChange={(e) =>
                      onStatusChange(record.id, e.target.value as AttendanceStatus)
                    }
                    className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
