# FINAL MASTER PROMPT — AI AUTOMATED FACE ATTENDANCE SYSTEM

## Role

You are a Senior UI/UX Engineer and expert Next.js / React / TypeScript / Tailwind CSS developer.

Build a polished, production-quality **frontend-only web application** for a college **AI Automated Face Attendance System**.

The frontend will eventually communicate with a Python FastAPI backend running:

* InsightFace / ArcFace
* GPU-accelerated face detection and recognition
* PostgreSQL
* pgvector for face embedding similarity search

This task is **FRONTEND ONLY**.

Use realistic mock data and explicit API/WebSocket integration hooks.

---

# 1. CRITICAL ARCHITECTURE RULES

The frontend must NEVER perform face recognition or face embedding operations.

The browser may only:

1. Access the camera.
2. Display the camera feed.
3. Capture frames/images.
4. Send frames to the FastAPI backend.
5. Receive recognition results.
6. Display backend-provided bounding boxes and recognition information.

DO NOT use:

* face-api.js
* TensorFlow.js
* MediaPipe face recognition
* InsightFace in the browser
* ONNX face-recognition models
* Any other client-side face-recognition or ML model.

The frontend must never connect directly to PostgreSQL.

Database credentials and backend secrets must never be exposed to client-side code.

---

# 2. TWO LOGICAL PORTALS

The system consists of two logically separate portals.

## Attendance Portal

Used by:

* Professor
* Admin

Purpose:

* Start attendance sessions
* Capture attendance
* Monitor recognition
* Review attendance
* Manually correct results
* View audit trail
* Confirm attendance
* Export attendance
* View attendance history

## Enrollment Portal

Used ONLY by:

* Admin

Purpose:

* Register students
* Capture five face samples
* Submit enrollment data to the backend
* Manage enrollment workflow

A Professor MUST NOT be able to access enrollment functionality.

Even if both portals are initially deployed from the same Next.js application, treat them as separate logical areas with strict role-based access.

---

# 3. ROLE-BASED ACCESS CONTROL

Use mock authentication initially.

Define these roles:

```text
admin
professor
```

Example mock users:

```text
Admin
email: admin@college.edu
role: admin

Professor
email: professor@college.edu
role: professor
```

Do not implement real password authentication yet.

Create a clean authentication abstraction so real JWT/session authentication can later be connected to FastAPI.

---

## Permission Matrix

Implement exactly this permission model:

| Feature                    | Admin | Professor |
| -------------------------- | ----: | --------: |
| Login                      |   Yes |       Yes |
| Attendance Dashboard       |   Yes |       Yes |
| Capture Attendance         |   Yes |       Yes |
| Review Attendance          |   Yes |       Yes |
| Manual Attendance Override |   Yes |       Yes |
| View Audit Trail           |   Yes |       Yes |
| Attendance History         |   Yes |       Yes |
| Export Attendance          |   Yes |       Yes |
| Student Enrollment         |   Yes |        No |

Do NOT add Student Management or Professor Management features unless explicitly requested later.

Frontend route guards are required, but remember:

**Frontend authorization is not real security.**

The eventual FastAPI backend must independently enforce authorization.

---

# 4. ROUTES

Implement these routes:

```text
/login
/
 /attendance/history
 /attendance/history/[sessionId]
 /enroll
 /unauthorized
```

The main `/` route is the Attendance Dashboard.

---

## Route Rules

### `/login`

Accessible without authentication.

### `/`

Accessible by:

* Admin
* Professor

### `/attendance/history`

Accessible by:

* Admin
* Professor

### `/attendance/history/[sessionId]`

Accessible by:

* Admin
* Professor

### `/enroll`

Accessible by:

* Admin only

### `/unauthorized`

Accessible by authenticated users who attempt to access something they are not authorized to use.

---

# 5. PROFESSOR ACCESS TO ENROLLMENT

If a Professor attempts to access:

```text
/enroll
```

display a professional 403-style page:

```text
403

Access Denied

You do not have permission to access the Student Enrollment Portal.

[ Return to Dashboard ]
```

Also:

* Hide Enrollment from Professor navigation.
* Do not render enrollment controls for Professor accounts.
* Do not rely solely on hiding the navigation item.
* Protect the route using the mock authentication context.

---

# 6. PROJECT STRUCTURE

Use:

```text
app/
├── layout.tsx
├── globals.css
│
├── page.tsx
│
├── login/
│   └── page.tsx
│
├── attendance/
│   └── history/
│       ├── page.tsx
│       └── [sessionId]/
│           └── page.tsx
│
├── enroll/
│   └── page.tsx
│
├── unauthorized/
│   └── page.tsx
│
components/
├── Navigation.tsx
│
├── CaptureMode.tsx
├── ReviewMode.tsx
├── WebcamStream.tsx
├── RecognitionBanner.tsx
│
├── AttendanceTable.tsx
├── AttendanceReviewTable.tsx
├── StatsCards.tsx
├── ManualOverrideDialog.tsx
├── AuditTrail.tsx
│
├── EnrollmentForm.tsx
├── CaptureProgress.tsx
│
├── StatusBanner.tsx
├── AccessDeniedCard.tsx
│
└── ui/
    ├── Button.tsx
    ├── Card.tsx
    ├── Input.tsx
    ├── Badge.tsx
    ├── Dialog.tsx
    ├── Select.tsx
    └── Tooltip.tsx
│
lib/
├── types.ts
├── api.ts
├── useWebSocket.ts
├── authContext.tsx
└── mockData.ts
```

Keep the code modular and reusable.

---

# 7. LOGIN PAGE

Create a professional college-system login page.

Include:

* College/system logo placeholder
* Application name
* Email input
* Password input
* Login button
* Loading state
* Invalid credentials state

Use mock authentication.

After login:

Admin → `/`

Professor → `/`

The dashboard and navigation should automatically adapt to the authenticated role.

---

# 8. NAVIGATION

Create a professional navigation component.

Display:

* Application name
* Current user
* User role
* Backend connection status
* Navigation
* Logout

For Admin:

```text
Dashboard
Attendance History
Enrollment
```

For Professor:

```text
Dashboard
Attendance History
```

Enrollment MUST NOT appear for Professors.

The navigation should be optimized for desktop/tablet administrative screens.

However:

**Navigation must NOT appear during Capture Mode.**

Capture Mode is a dedicated kiosk-style experience.

---

# 9. ATTENDANCE WORKFLOW

The attendance workflow is:

```text
Professor/Admin Login
        ↓
Attendance Dashboard
        ↓
Select Course / Class
        ↓
Start Attendance Session
        ↓
Enter Capture Mode
        ↓
Camera starts
        ↓
Students walk past camera
        ↓
Frames sent to FastAPI backend
        ↓
Backend performs face detection + recognition
        ↓
Frontend receives recognition result
        ↓
Attendance result displayed
        ↓
Capture session ends
        ↓
Enter Review Mode
        ↓
Professor reviews results
        ↓
Professor can manually override results
        ↓
Needs-review cases resolved
        ↓
Audit trail recorded
        ↓
Professor confirms attendance
        ↓
Session finalized
        ↓
Attendance can be exported
```

---

# 10. TWO DISTINCT ATTENDANCE VIEWS

Do NOT create one dashboard where the camera, attendance table, statistics, and review controls are all visible simultaneously.

There must be two distinct states:

## CAPTURE MODE

Optimized for the phone camera at the classroom door.

## REVIEW MODE

Optimized for the professor reviewing attendance after capture.

These should feel like two different interfaces.

---

# 11. CAPTURE MODE — KIOSK INTERFACE

Capture Mode is extremely important.

The eventual deployment may use a professor's smartphone placed on a stand near the classroom door while students walk past it.

Therefore Capture Mode must be **mobile-first and kiosk-like**.

Do NOT show:

* Sidebar
* Large navigation menu
* Attendance table
* Large statistics dashboard
* Unnecessary administrative controls

Instead, use almost the entire screen for the camera.

---

## Capture Mode Layout

Conceptually:

```text
┌───────────────────────────────┐
│                               │
│                               │
│        CAMERA FEED            │
│                               │
│      ┌──────────────┐         │
│      │ FACE BOUNDARY│         │
│      └──────────────┘         │
│                               │
│                               │
│      ✓ RAHUL SHARMA           │
│      Attendance Recorded      │
│                               │
│          ● CAPTURING          │
│                               │
└───────────────────────────────┘
```

Use a large Recognition Banner.

---

# 12. CAPTURE MODE FEATURES

Capture Mode must support:

### Full-screen interface

Use the browser Fullscreen API where appropriate.

### Camera preview

Use the native MediaDevices API.

### Backend connection status

Clearly show whether the recognition backend is connected.

### Recognition banner

Large and easy to see from a distance.

Examples:

```text
✓ RAHUL SHARMA
Attendance Recorded
```

```text
? UNKNOWN FACE
No matching student found
```

```text
⚠ NEEDS REVIEW
Possible match: Arjun Mehta
Confidence: 78%
```

### Audio feedback

Play a short success/error sound when appropriate.

Provide a setting to enable/disable sound.

Do not use annoying continuous sounds.

### Vibration

Use the browser vibration API where supported.

For example:

* Short vibration → recognized
* Different vibration → unknown/needs review

Gracefully handle devices that do not support vibration.

### Screen Wake Lock

Use the Screen Wake Lock API where supported.

While Capture Mode is active:

```text
navigator.wakeLock
```

should be used to attempt to keep the screen awake.

Handle unsupported browsers gracefully.

### Exit Capture Mode

Provide a clearly accessible but unobtrusive way to stop the session and enter Review Mode.

---

# 13. CAMERA STATES

Support:

```text
initializing
camera_ready
camera_permission_denied
camera_unavailable
backend_connecting
backend_connected
backend_disconnected
capturing
stopped
```

Display useful messages for each state.

Example:

```text
Camera permission required.

Please allow camera access to begin attendance capture.
```

---

# 14. FACE RECOGNITION RESULTS

The backend will eventually return information such as:

```ts
interface FaceDetection {
    studentId?: string;
    name?: string;
    confidence?: number;

    bbox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };

    status:
        | "recognized"
        | "already_present"
        | "unknown"
        | "needs_review"
        | "processing";
}
```

The frontend should draw bounding boxes using the backend-provided coordinates.

Do NOT calculate the bounding box in the frontend.

Do NOT detect the face in the frontend.

---

# 15. CONFIDENCE THRESHOLDS

The system must have an explicit confidence classification.

Use configurable mock thresholds.

For example:

```text
confidence >= 0.90
→ recognized

0.70 <= confidence < 0.90
→ needs_review

confidence < 0.70
→ unknown
```

These values are only demonstration defaults and must be easy to change later.

Show the threshold information somewhere in the Review interface.

Example:

```text
Recognition Threshold

Automatic Match: ≥ 90%
Needs Review: 70–89%
Unknown: < 70%
```

Do not imply that these thresholds are scientifically validated.

---

# 16. NEEDS_REVIEW STATUS

`needs_review` is a first-class attendance state.

It must appear in:

* Capture Mode
* Review Mode
* Attendance statistics
* Attendance table
* History
* Audit trail

Example:

```text
⚠ Needs Review

Possible Match:
Arjun Mehta

Confidence:
78%

[ Review ]
```

A professor must resolve every `needs_review` case before final confirmation.

Do not allow the session to be finalized while unresolved `needs_review` records remain, unless the professor explicitly resolves them.

---

# 17. ATTENDANCE STATES

Use these states:

```text
Present
Already Present
Unknown
Needs Review
Pending
Absent
```

`Unknown` means the system could not match the face to an enrolled student.

`Needs Review` means the system found a possible match but confidence is not high enough for automatic confirmation.

`Absent` applies during review/finalization rather than being a camera recognition result.

---

# 18. DUPLICATE DETECTION

If a student is recognized multiple times during the same session:

Do not repeatedly create attendance records.

Instead display:

```text
Already Present

Rahul Sharma
Already marked present at 10:42 AM
```

The live feed can still show the recognition event, but the attendance state remains unchanged.

---

# 19. REVIEW MODE

After Capture Mode ends, transition into Review Mode.

Review Mode is designed for the professor.

It should contain:

### Summary

```text
Total Students: 50
Present: 42
Absent: 6
Needs Review: 2
Unknown: 1
```

### Attendance table

Columns:

```text
Student
Roll Number
Status
Confidence
Recognition Time
Source
Actions
```

`Source` should indicate:

```text
AI
Manual Override
```

---

# 20. MANUAL OVERRIDE

Every attendance record must be editable before final confirmation.

The professor must be able to:

* Change Present → Absent
* Change Absent → Present
* Resolve Needs Review → Present
* Resolve Needs Review → Absent
* Remove/reject a false AI match

Provide an Edit/Override action.

When a manual override is made, open a dialog.

Example:

```text
Manual Attendance Override

Student:
Rahul Sharma

Current Status:
Present

New Status:
[ Absent ▼ ]

Reason / Note:
[____________________________]

[ Cancel ]    [ Save Override ]
```

Require a reason/note for manual overrides.

---

# 21. AUDIT TRAIL

Every manual modification must create an audit entry.

Store/display:

```ts
interface AuditEntry {
    id: string;
    studentId: string;
    previousStatus: string;
    newStatus: string;
    reason: string;
    changedBy: string;
    changedAt: string;
    source: "ai" | "manual";
}
```

Example:

```text
AUDIT TRAIL

10:42:18
AI recognition
Rahul Sharma → Present
Confidence: 94%

10:43:02
Professor override
Rahul Sharma
Present → Absent

Reason:
False recognition

Changed by:
Prof. Sharma
```

The audit trail must never silently overwrite the original AI decision.

The original automated result must remain visible.

---

# 22. FINAL CONFIRMATION

Provide:

```text
[ Confirm Attendance ]
```

Before confirmation, display a summary:

```text
Present: 42
Absent: 6
Needs Review: 0
Unknown: 1
Manual Overrides: 3
```

If unresolved `needs_review` records exist:

```text
2 students still require review.

Resolve all Needs Review cases before confirming attendance.
```

After confirmation:

```text
Attendance session finalized successfully.
```

A finalized session becomes read-only.

Manual editing must no longer be possible after finalization.

---

# 23. EXPORT FUNCTIONALITY

Add export functionality.

The following must have export controls:

## Current session

Provide:

```text
Export CSV
Export Excel
```

## Attendance history

Provide:

```text
Export CSV
Export Excel
```

The frontend may initially generate mock exports or call future backend endpoints.

Create API placeholders such as:

```text
GET /attendance/{sessionId}/export?format=csv

GET /attendance/{sessionId}/export?format=xlsx
```

The implementation should make it easy to replace the mock behavior with FastAPI-generated files.

---

# 24. ATTENDANCE HISTORY

Create:

```text
/attendance/history
```

Display previous sessions.

Columns:

```text
Course
Date
Professor
Total Students
Present
Absent
Needs Review
Attendance %
Status
```

Provide search/filter controls where appropriate.

Each session should be clickable.

---

# 25. ATTENDANCE HISTORY DETAIL

Use a dedicated route:

```text
/attendance/history/[sessionId]
```

Do NOT use a dialog as the primary history-detail interface.

The detail page should show:

* Course
* Professor
* Date
* Start time
* End time
* Session duration
* Total students
* Present
* Absent
* Unknown
* Needs Review
* Attendance percentage
* Manual override count
* Full attendance records
* Audit trail
* Export controls

If the session is finalized, clearly display:

```text
FINALIZED
Read Only
```

---

# 26. ENROLLMENT PORTAL

Create:

```text
/enroll
```

Admin only.

The enrollment workflow is:

```text
Student Information
        ↓
Start Face Capture
        ↓
Capture Sample 1 / 5
        ↓
Capture Sample 2 / 5
        ↓
Capture Sample 3 / 5
        ↓
Capture Sample 4 / 5
        ↓
Capture Sample 5 / 5
        ↓
Submit Samples
        ↓
FastAPI generates embeddings
        ↓
PostgreSQL / pgvector stores enrollment data
        ↓
Enrollment Successful
```

---

# 27. ENROLLMENT FORM

Fields:

```text
Student Name
Roll Number
Enrollment Number
Department
Year
Section
Email
```

Validate required fields.

Use mock data.

After entering information, allow the admin to proceed to face capture.

---

# 28. FACE CAPTURE

Create:

```text
CaptureProgress.tsx
```

Display five capture steps:

```text
● 1
● 2
● 3
○ 4
○ 5
```

Example:

```text
Position your face inside the frame.

Sample 2 of 5

Hold still...

[ Capture ]
```

After all samples:

```text
✓ Five samples captured

[ Submit Enrollment ]
```

The frontend only captures/sends the samples.

The backend performs:

* face detection
* embedding generation
* validation
* database storage

---

# 29. API ABSTRACTION

Create:

```text
lib/api.ts
```

Use:

```ts
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
```

Include placeholder methods:

```text
login()
getCurrentUser()

getAttendanceSession()
startAttendanceSession()
stopAttendanceSession()
confirmAttendance()

getAttendanceHistory()
getAttendanceSessionDetails()

overrideAttendance()
getAuditTrail()

exportAttendanceCsv()
exportAttendanceExcel()

enrollStudent()
uploadFaceSamples()
```

Keep all backend communication inside this abstraction rather than scattering fetch calls throughout components.

---

# 30. WEBSOCKET HOOK

Create:

```text
lib/useWebSocket.ts
```

The intended architecture is:

```text
Browser Camera
       │
       │ WebSocket
       ▼
FastAPI
       │
       ▼
InsightFace / ArcFace
       │
       ▼
PostgreSQL + pgvector
       │
       ▼
Recognition Result
       │
       │ WebSocket
       ▼
Frontend
```

The hook should expose functionality conceptually similar to:

```ts
connect()
disconnect()
sendFrame(frame)
connectionState
recognitionResults
```

Use mock responses initially.

Make the hook easy to connect to the real FastAPI WebSocket endpoint later.

---

# 31. TYPESCRIPT TYPES

Create strongly typed interfaces for:

```text
User
Student
Professor
Course
AttendanceSession
AttendanceRecord
AttendanceLog
FaceDetection
RecognitionResult
EnrollmentData
AuditEntry
WebSocketMessage
```

Avoid `any` wherever reasonably possible.

---

# 32. MOCK DATA

Create realistic fictional data.

Example students:

```text
Rahul Sharma
Ananya Rao
Arjun Mehta
Priya Nair
Aditya Kulkarni
Sneha Patil
```

Do not use real personal information.

Generate realistic:

* courses
* students
* attendance records
* confidence scores
* timestamps
* manual overrides
* audit entries
* history sessions

Include several `needs_review` examples so the review UI can be demonstrated.

---

# 33. RESPONSIVE DESIGN

The system has two different responsive requirements.

## Administrative UI

Dashboard / Review / History:

* Desktop
* Laptop
* Tablet

## Capture Mode

Primarily:

* Smartphone
* Tablet

Capture Mode must be mobile-first.

The UI should adapt to portrait and landscape orientation.

Do not assume a desktop monitor.

---

# 34. DESIGN LANGUAGE

The application should look like professional college administration software.

Use:

* Clean modern interface
* Strong information hierarchy
* Rounded cards
* Subtle borders
* Restrained shadows
* Professional typography
* Accessible contrast
* Clear status indicators
* Consistent spacing
* Responsive layouts

Avoid:

* Excessive gradients
* Excessive glassmorphism
* Huge hero sections
* Marketing landing-page aesthetics
* Excessive animations
* Decorative elements that interfere with camera usage

Use Framer Motion only for subtle transitions:

* Status changes
* Recognition banners
* Table row insertion
* Dialogs
* Capture progress
* Page transitions

---

# 35. CAPTURE MODE VISUAL PRIORITY

Capture Mode is not a normal dashboard.

Its visual hierarchy should be:

```text
1. Camera
2. Recognition result
3. Attendance status
4. Backend/camera status
5. Stop/exit control
```

Everything else is secondary.

The professor should be able to glance at the phone from several feet away and immediately understand:

```text
WHO was recognized
WHAT happened
WHETHER attendance was recorded
```

---

# 36. ACCESSIBILITY

Ensure:

* Keyboard navigation where applicable
* Proper labels
* Accessible buttons
* Sufficient contrast
* ARIA labels for camera controls
* Clear error messages
* Visible focus states
* Do not rely on color alone to communicate status

---

# 37. SECURITY RULES

These rules are mandatory:

1. No face recognition in the browser.
2. No ML models in the frontend.
3. No database connections from the frontend.
4. No database credentials in frontend code.
5. No API secrets in client-side code.
6. Use mock authentication for now.
7. Implement frontend role guards.
8. Backend must eventually enforce RBAC independently.
9. Professor accounts cannot access enrollment.
10. Keep Enrollment and Attendance logically separated.
11. Preserve the original AI decision when manual overrides occur.
12. Every manual override must have a reason and audit entry.
13. Finalized attendance sessions are read-only.
14. `needs_review` cases must be resolved before final confirmation.
15. Camera frames are sent to the backend; they are not processed locally.

---

# 38. FINAL USER EXPERIENCE

The finished application should support this complete experience:

### Admin

```text
Login
 ↓
Attendance Dashboard
 ↓
Start Capture
 ↓
Kiosk Camera Mode
 ↓
AI Recognition
 ↓
Stop Capture
 ↓
Review Attendance
 ↓
Resolve Needs Review
 ↓
Make Manual Overrides if necessary
 ↓
Inspect Audit Trail
 ↓
Confirm Attendance
 ↓
Export CSV / Excel
```

Admin can additionally:

```text
Enrollment
 ↓
Enter Student Data
 ↓
Capture 5 Samples
 ↓
Submit
 ↓
Enrollment Complete
```

### Professor

```text
Login
 ↓
Attendance Dashboard
 ↓
Start Capture
 ↓
Kiosk Camera Mode
 ↓
AI Recognition
 ↓
Stop Capture
 ↓
Review Attendance
 ↓
Resolve Needs Review
 ↓
Manual Overrides
 ↓
Audit Trail
 ↓
Confirm Attendance
 ↓
Export
```

Professor attempting:

```text
/enroll
```

must receive:

```text
403 Access Denied
```

---

# 39. FINAL DEVELOPMENT REQUIREMENT

Build the application as a complete working Next.js frontend using mock data.

Do not create a generic dashboard template.

Build the UI around the actual workflow of a college AI face-attendance system.

Prioritize:

1. Correct role-based access
2. Dedicated mobile Capture Mode
3. Dedicated Review Mode
4. Reliable camera UX
5. AI recognition result visualization
6. `needs_review` workflow
7. Manual overrides
8. Audit trail
9. Attendance confirmation
10. CSV/Excel export
11. Attendance history and detail pages
12. Admin-only enrollment
13. FastAPI/WebSocket integration hooks
14. Responsive design
15. Maintainable TypeScript architecture

The frontend must be immediately runnable as a Next.js application using mock data, while keeping the architecture ready for integration with the real FastAPI + InsightFace/ArcFace + PostgreSQL/pgvector backend later.
