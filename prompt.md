# AI Prompt for Web Application Generation

**Role:** Senior UI/UX Engineer and Next.js/React/Tailwind Developer.

**Task:** Build a polished, production-quality frontend for an **AI Automated Face Attendance System**.

The application will eventually connect to a **Python FastAPI backend using InsightFace/ArcFace for face detection and recognition**. For this task, build the frontend only and provide clean, clearly isolated integration hooks for the backend.

Do **not** implement actual face-recognition or ML logic in the frontend.

---

# 1. Technology Stack

Use:

* **Next.js** with App Router
* **TypeScript**
* **React**
* **Tailwind CSS**
* **Lucide React** for icons
* **Framer Motion** for subtle animations

Use modern Next.js conventions and functional React components.

Organize the project into reusable components rather than putting everything into `page.tsx`.

Suggested structure:

```text
app/
├── page.tsx
├── enroll/
│   └── page.tsx
├── layout.tsx
└── globals.css

components/
├── WebcamStream.tsx
├── AttendanceTable.tsx
├── StatsCards.tsx
├── Navigation.tsx
├── EnrollmentForm.tsx
├── CaptureProgress.tsx
├── StatusBanner.tsx
└── ui/

lib/
├── api.ts
└── types.ts
```

Keep backend/API-related code separate from UI components.

---

# 2. Design System

Create a modern dark-mode interface.

### Background

* Main background: `#090d16`
* Cards/panels: `#111827`
* Borders: `#1f2937`

### Accent colors

* Emerald/Teal: `#10b981` / `#06b6d4`
* Indigo: `#6366f1`
* Error/Unknown: `#f43f5e`
* Neutral text: slate/zinc tones

### Visual style

* Modern SaaS / AI dashboard
* Rounded cards (`rounded-2xl`)
* Subtle borders
* Slight glass/blur effects where appropriate
* Clean typography
* Good spacing
* Clear hierarchy
* Subtle Framer Motion animations

Avoid excessive glowing effects, excessive animations, or visually distracting elements.

The interface should look like a **real college attendance product**, not a sci-fi demo.

It must remain highly usable on a laptop and tablet.

---

# 3. Application Pages

The application has two primary pages.

```text
/enroll       → Student Enrollment Portal
/             → Live Attendance Dashboard
```

Provide navigation between the two.

---

# 4. Shared Navigation

Create a reusable navigation/header component.

Display:

**Smart AI Attendance**

Navigation items:

* Live Dashboard
* Enrollment

Also display a system status indicator:

🟢 `System Ready`

The navigation should remain consistent across both pages.

---

# 5. Student Enrollment Portal — `/enroll`

## Layout

Use a responsive two-column layout on desktop.

```text
┌──────────────────────┬─────────────────────────────┐
│ Enrollment Form      │                             │
│                      │      Webcam Preview         │
│ Capture Progress     │                             │
│                      │                             │
│ Status               │                             │
└──────────────────────┴─────────────────────────────┘
```

On smaller screens, stack the columns vertically.

---

## A. Student Information Card

Fields:

### Student Full Name

Text input.

### Student Roll / ID

Text input.

### Department / Course

Dropdown.

Example options:

```text
Computer Science & Engineering
Electronics & Communication
Electrical Engineering
Mechanical Engineering
Civil Engineering
```

### Start Enrollment

Large primary button:

**Start Enrollment**

Use a camera/scan icon.

The button should remain disabled until required fields are valid.

---

# 6. Enrollment State Machine

Implement the enrollment UI using explicit states.

```text
IDLE
 ↓
ENROLLING
 ↓
CAPTURING
 ↓
COMPLETED
```

The capture process should simulate five samples.

Example:

```text
Samples Captured: 0 / 5

1   2   3   4   5
○   ○   ○   ○   ○
```

As samples are captured:

```text
Samples Captured: 3 / 5

●   ●   ●   ○   ○
```

Use a mock timer to simulate capture for demonstration purposes.

Important:

The mock capture logic must be isolated and clearly marked so that it can later be replaced by a FastAPI/WebSocket implementation.

---

# 7. Enrollment Positioning Tips

Display a small guidance card:

### Positioning Tips

* Look directly at the camera
* Keep your face centered
* Maintain good lighting
* Remove anything covering your face
* Stay relatively still during capture

---

# 8. Enrollment Status Banner

Create a dynamic status component.

### Idle

> Ready to enroll next student.

### Capturing

> Capturing face sample 3 of 5... Stay still.

### Success

> Successfully enrolled Yash Mathur!

### Error

> Enrollment failed. Please try again.

Use appropriate visual states and icons.

---

# 9. Webcam Component

Create a reusable:

```text
/components/WebcamStream.tsx
```

The component should use the browser's camera API:

```tsx
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
});
```

Display the live camera stream using:

```tsx
<video />
```

The video should be muted and autoplay.

Mirror the camera preview horizontally for a natural selfie-style experience.

After obtaining the camera frame, the frontend should be structured so that frames can later be sampled/sent to the FastAPI backend.

---

# 10. Canvas Overlay

Place a transparent HTML5 canvas directly above the video.

Structure:

```text
relative container
│
├── <video>
│
└── <canvas>
```

The canvas must automatically synchronize with the video's displayed dimensions.

The canvas will eventually be used to draw:

* Face bounding boxes
* Recognition labels
* Confidence/similarity
* Facial landmarks if supplied by backend

Do not implement actual ML detection.

---

# 11. ML Integration Types

Create reusable TypeScript interfaces.

```tsx
export interface FaceDetection {
    bbox: [number, number, number, number];
    name: string;
    similarity: number;
}

export interface AttendanceLog {
    id: string;
    studentName: string;
    rollId: string;
    timestamp: string;
    date: string;
    similarity?: number;
    status: "PRESENT" | "UNKNOWN";
}
```

Use these types throughout the application.

---

# 12. Backend Integration Hooks

Create a dedicated file:

```text
/lib/api.ts
```

Put placeholder API functions there.

For example:

```tsx
export async function startEnrollment() {
    // TODO: connect to FastAPI
}

export async function captureEnrollmentSample() {
    // TODO: connect to FastAPI
}

export async function getAttendanceLogs() {
    // TODO: connect to FastAPI
}
```

Do not scatter API calls throughout UI components.

The UI should be designed so that replacing mock functions with real API calls requires minimal changes.

---

# 13. Live Attendance Dashboard — `/`

Page title:

# Smart AI Attendance Terminal

---

# 14. Top Statistics

Display three cards.

### Total Present Today

Example:

```text
42 Students
```

Include a small trend indicator.

### Active Camera

```text
Online
30 FPS
```

with green status indicator.

### Last Recognized

Example:

```text
Yash Mathur
02:45 PM
```

These values may initially use mock data.

Keep the data source isolated so it can later come from FastAPI.

---

# 15. Main Dashboard Layout

Use approximately a 60/40 layout.

```text
┌──────────────────────────────┬────────────────────────┐
│                              │                        │
│   LIVE CLASSROOM STREAM      │  LIVE ATTENDANCE LOGS │
│                              │                        │
│                              │                        │
│                              │                        │
└──────────────────────────────┴────────────────────────┘
```

Responsive behavior:

On smaller screens, stack vertically.

---

# 16. Live Classroom Stream

Create a large camera card.

Header:

```text
Live Classroom Stream
🟢 LIVE
```

Camera area:

```text
<video>
<canvas overlay>
```

The overlay should support backend-provided detections.

Example:

```text
┌───────────────────────────────┐
│                               │
│      ┌───────────────┐        │
│      │ Yash Mathur   │        │
│      │ 94.2%         │        │
│      └───────────────┘        │
│                               │
└───────────────────────────────┘
```

Recognition colors:

* Green → Recognized
* Red → Unknown
* Neutral → Detection without recognition

---

# 17. Camera Controls

Below the video provide:

* Pause / Resume Stream
* Mirror Mode
* Fullscreen

Buttons should have icons and tooltips.

Do not actually stop the camera when simply pausing the UI preview unless appropriate; distinguish between pausing the video display and stopping the MediaStream.

---

# 18. Attendance Log Panel

Header:

**Live Attendance Logs**

Include:

* Real-Time Sync indicator
* Export CSV button
* Search input
* Date filter

---

# 19. Attendance Table

Columns:

| Student Name | Roll ID | Time | Date | Confidence | Status |
| ------------ | ------- | ---- | ---- | ---------- | ------ |

Example:

```text
Yash Mathur     23CS101    02:45 PM    07/10/2026    94.2%    PRESENT
Rahul Kumar     23CS102    02:46 PM    07/10/2026    91.7%    PRESENT
Unknown         —          02:47 PM    07/10/2026    —        UNKNOWN
```

New attendance entries should receive a subtle highlight animation.

Do not use excessive animation.

---

# 20. CSV Export

Implement a frontend placeholder for:

**Export CSV**

For the mock version, generate a CSV from the currently displayed attendance logs and trigger a browser download.

Keep this functionality independent from the backend so it can later be changed to server-side export.

---

# 21. Empty State

If there are no attendance logs:

Display a clean empty state:

```text
No attendance records yet.

Recognized students will appear here automatically.
```

Use a suitable Lucide icon.

---

# 22. React State

Use clean state management.

For example:

```tsx
const [isEnrolling, setIsEnrolling] = useState(false);
const [sampleCount, setSampleCount] = useState(0);
const [recentLogs, setRecentLogs] = useState<AttendanceLog[]>([]);
const [isCameraActive, setIsCameraActive] = useState(false);
const [isMirrored, setIsMirrored] = useState(true);
const [isPaused, setIsPaused] = useState(false);
```

Do not introduce Redux or another state-management library unless genuinely necessary.

---

# 23. Webcam References

Use:

```tsx
const videoRef = useRef<HTMLVideoElement | null>(null);
const canvasRef = useRef<HTMLCanvasElement | null>(null);
```

The webcam component should clean up the MediaStream when unmounted.

---

# 24. ML Overlay Function

Provide a clean placeholder:

```tsx
const drawOverlay = (detections: FaceDetection[]) => {
    // TODO:
    // Draw backend-provided face bounding boxes,
    // names, similarity scores, and landmarks.
};
```

Do not perform face detection inside the browser.

---

# 25. Mock Data

Include realistic mock data for development.

Mock students:

```text
Yash Mathur
Rahul Kumar
Aditya Sharma
Priya Singh
Arjun Patel
```

Mock confidence values should look realistic.

Make it extremely obvious in the code which data is mock data.

---

# 26. Important Architecture Constraint

The frontend must NOT assume that face recognition happens inside Next.js.

The intended architecture is:

```text
Browser
   │
   │ Webcam
   ▼
Next.js Frontend
   │
   │ HTTP / WebSocket
   ▼
FastAPI Backend
   │
   ├── InsightFace / ArcFace
   ├── Face Embeddings
   ├── Recognition
   └── Attendance Logic
           │
           ▼
        Database
```

Next.js is responsible primarily for:

* UI
* Routing
* User interaction
* Camera interface
* Displaying recognition results
* Attendance dashboard
* Sending/receiving data

FastAPI is responsible for:

* Face detection
* Face recognition
* Embedding generation
* Enrollment processing
* Attendance verification
* Database operations

---

# 27. Code Quality Requirements

The generated application must:

* Use TypeScript.
* Use reusable components.
* Avoid giant `page.tsx` files.
* Avoid duplicated UI code.
* Use semantic HTML.
* Include accessible buttons and inputs.
* Include loading states.
* Include error states.
* Clean up camera streams correctly.
* Avoid unnecessary dependencies.
* Keep mock/backend code clearly separated.
* Use responsive layouts.
* Work without the backend initially using mock data.

Do not create fake backend endpoints.

Do not implement fake face recognition.

Do not pretend that mock recognition is real ML.

---

# 28. Final Deliverable

Generate the complete frontend code required to run the application.

The result should provide:

1. `/` — Live Attendance Dashboard
2. `/enroll` — Student Enrollment Portal
3. Reusable webcam component
4. Camera preview using `getUserMedia`
5. Canvas overlay
6. Enrollment workflow simulation
7. Attendance table
8. Search/filter functionality
9. CSV export
10. Responsive design
11. Mock data
12. Clearly documented FastAPI integration points
13. Clean TypeScript types
14. Modular component architecture

The application should be immediately runnable with:

```bash
npm install
npm run dev
```

Do not require a backend to see the UI.
