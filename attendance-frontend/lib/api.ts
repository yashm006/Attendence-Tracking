const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export interface VerificationResponse {
  matched: boolean;
  student_id?: string;
  student_name?: string;
  confidence?: number;
  bbox?: number[];
  faces_found?: number;
  message?: string;
}

export interface RegistrationResponse {
  status: string;
  student_id: string;
  name: string;
  poses_processed: number;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  student_name: string;
  course_code: string;
  confidence: number;
  timestamp: string;
}

export async function verifyFaceFrame(
  base64Image: string,
  courseCode: string
): Promise<VerificationResponse> {
  const response = await fetch(`${BACKEND_URL}/api/verify-face`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: base64Image,
      course_code: courseCode,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to process face verification frame.");
  }

  return response.json();
}

export async function registerStudent(
  studentId: string,
  name: string,
  base64Images: string[]
): Promise<RegistrationResponse> {
  const response = await fetch(`${BACKEND_URL}/api/register-student`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      student_id: studentId,
      name: name,
      images: base64Images,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to enroll student.");
  }

  return response.json();
}

export async function fetchAttendanceLogs(): Promise<AttendanceRecord[]> {
  const response = await fetch(`${BACKEND_URL}/api/attendance-logs`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch attendance logs.");
  }

  return response.json();
}