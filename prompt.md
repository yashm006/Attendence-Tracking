# AI Prompt for Web Application Generation

Copy and paste the prompt below directly into your AI web code generator (e.g., v0.dev, Cursor, Claude, or ChatGPT) to build the complete frontend for both pages.

***

### PROMPT START

**Role:** Senior UI/UX Engineer & React/Tailwind Developer.  
**Task:** Build a modern, sleek, dark-mode web app frontend in **Next.js 14 (App Router), Tailwind CSS, Lucide React icons, and Framer Motion** for an **AI Automated Attendance System**. 

The app consists of two primary pages:
1. **Student Enrollment Portal** (`/enroll`)
2. **Live Attendance Dashboard** (`/`)

---

### Design System & Theme Guidelines
* **Theme:** Deep dark mode (Slate/Zinc background `#090d16`, dark card panels `#111827` with subtle borders `#1f2937`).
* **Accents:** Emerald/Teal (`#10b981` / `#06b6d4`) for success/recognition, Electric Indigo (`#6366f1`) for UI primary actions, and Rose Red (`#f43f5e`) for unknown/unregistered faces.
* **Vibe:** Modern SaaS dashboard with glassmorphism, glowing badges, clean typography, rounded cards (`rounded-2xl`), and subtle micro-animations.

---

### Page 1: Student Enrollment Portal (`/enroll`)

#### 1. Header & Navigation
* Title: "Student Face Enrollment Portal" with an active system status badge ("System Ready" in emerald green).
* Back-link or Navigation bar to switch between "Live Dashboard" and "Enrollment Portal".

#### 2. Layout (Grid Structure)
* **Left Column (Form & Progress Tracker):**
  * **Input Fields Card:**
    * Student Full Name input field (with search/clear icon).
    * Student Roll / ID Number input field.
    * Department / Course dropdown selector.
    * "Start Enrollment" CTA button (Emerald gradient button with a camera/scan icon).
  * **Interactive Capture Progress Card:**
    * Visual step counter showing progress (e.g., **"Samples Captured: 0 / 5"**).
    * Circular progress bar or step pills (1 to 5) that light up green as samples are recorded.
    * Onscreen positioning tips card ("Look directly at camera", "Maintain good lighting", "Keep face centered").
  * **Status Banner:**
    * Dynamic alert/status box displaying current state:
      * *Idle State:* "Ready to enroll next student."
      * *Active State:* "Capturing face sample 3 of 5... Stay still."
      * *Success State:* "Successfully enrolled [Student Name]! Ready for next."

* **Right Column (Webcam Stream & ML Overlay Area):**
  * **Webcam Container Card:**
    * Aspect ratio fixed at 4:3 / 16:9 (`640x480` relative dimensions).
    * Dark placeholder container with camera grid guidelines/crosshairs.
    * **ML Visual Hook:** Stack a transparent HTML5 `<canvas>` element directly over the `<video>` element (absolute positioning) to allow backend drawing of face bounding boxes and landmark dots.
    * Live streaming badge ("Live WebCam Feed" with pulsing green dot) on the top left.
    * Footer info bar displaying stream stats: `Resolution: 640x480 | FPS: 30 | Provider: GPU Accelerated`.

---

### Page 2: Live Attendance Dashboard (`/`)

#### 1. Header & Top Metrics Bar
* Title: "Smart AI Attendance Terminal".
* **3 Stat Cards across top:**
  1. **Total Present Today:** Large metric counter (e.g., "42 Students") with trend badge.
  2. **Active Camera Status:** Metric showing "Online (30 FPS)" with green dot indicator.
  3. **Last Recognized:** Displays the last student logged name + timestamp (e.g., "Yash Mathur - 02:45 PM").

#### 2. Layout (Split Screen Grid - 60/40)

* **Left Panel (Live Recognition Video Stream):**
  * High-tech camera card with custom header ("Live Classroom Stream").
  * **Webcam Container + Canvas Stack:**
    * HTML5 `<video>` feed with stacked `<canvas>` overlay for bounding boxes.
    * Live bounding box target legend floating on bottom: Green box = "Recognized", Red box = "Unknown Face".
  * Quick Control Toggle bar under video: "Pause Stream", "Toggle Mirror Mode", "Fullscreen View".

* **Right Panel (Real-Time Attendance Log Feed):**
  * Header: "Live Attendance Logs" with an animated "Real-Time Sync" badge and a "Export CSV" button.
  * Search Bar & Date Filter to quickly search logged students.
  * **Live Activity Table / List:**
    * Columns: **Student Name**, **Roll ID**, **Time**, **Date**, **Confidence Score / Status**.
    * Highlight row animations whenever a new attendance entry is appended.
    * Badge components for status (e.g., `PRESENT` in green, `UNKNOWN` in gray/red).
    * Empty state graphic/illustration for when no logs exist yet today.

---

### Technical Architecture Hooks (For Developer ML Integration)

Include clear code comments and React state definitions for backend ML integration:

```tsx
// =========================================================================
// ML INTEGRATION HOOKS & PLACEHOLDERS (DO NOT IMPLEMENT HEAVY ML ENGINE)
// =========================================================================

// 1. Webcam Frame Capture Slot
const videoRef = useRef<HTMLVideoElement null |>(null);
const canvasRef = useRef<HTMLCanvasElement null |>(null);

// 2. Dynamic Detection Data Schema (Received from WebSocket / Backend API)
interface FaceDetection {
  bbox: [number, number, number, number]; // [x1, y1, x2, y2]
  name: string;
  similarity: number;
}

// 3. State triggers for ML Backend API
const [isEnrolling, setIsEnrolling] = useState(false);
const [sampleCount, setSampleCount] = useState(0); // Max 5
const [recentLogs, setRecentLogs] = useState([]);

// 4. Placeholder Function to draw bounding boxes from backend ML payload
const drawOverlay = (detections: FaceDetection[]) => {
  // Developer will bind FastAPI WebSocket stream here to draw boxes on canvasRef
};

---

### Response Deliverables Required
1. Clean Next.js React components using Tailwind CSS classes.

2. Modular layout split into readable components (/components/WebcamStream.tsx, /components/AttendanceTable.tsx, /components/StatsCards.tsx).

3. Fully functional UI interactivity (tab switching, form submit simulation, mock sample capture progress timer, and CSV export action placeholders).