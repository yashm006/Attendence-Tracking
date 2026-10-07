# Frontend Folder Structure

```
frontend/
├── app/
│   ├── layout.tsx             # Root layout with Sidebar and Top Navigation
│   ├── page.tsx               # Main Dashboard (Live Attendance Stream & Recent Logs)
│   ├── enroll/
│   │   └── page.tsx           # Student Face Enrollment Portal
│   ├── students/
│   │   └── page.tsx           # Registered Students Directory & Profiles
│   └── attendance/
│       └── page.tsx           # Historical Logs, Filtering & CSV Export
├── components/
│   ├── ui/                    # Reusable shadcn/ui buttons, tables, dialogs
│   ├── LiveCameraFeed.tsx     # Webcam + HTML5 Canvas Bounding Box Overlay
│   ├── AttendanceTable.tsx    # Live updating attendance table
│   └── EnrollmentCamera.tsx   # Capture step component for face samples
├── lib/
│   └── websocket.ts           # WebSocket connection manager for backend streams
└── package.json
```


### System Architecture

```
                 ┌─────────────────────────┐
                 │   Enrollment Website    │
                 │                         │
                 │  Admin/Enrollment only  │
                 │  Student registration   │
                 └────────────┬────────────┘
                              │
                              │ FastAPI
                              ▼
                       ┌─────────────┐
                       │   Database  │
                       └─────────────┘
                              ▲
                              │ FastAPI
                              │
                 ┌────────────┴────────────┐
                 │ Attendance Tracking Web │
                 │                         │
                 │ Professor Login         │
                 │ Live Camera             │
                 │ Attendance Dashboard    │
                 │ Logs / Export           │
                 └─────────────────────────┘
```

```mermaid
flowchart TD
    %% Client & User Layer
    subgraph Client_Layer ["1. Client & Role Access Layer"]
        User_Faculty["Faculty / Professor Terminal"]
        User_Admin["Admin / Registrar Terminal"]
    end

    %% Frontend App (Next.js)
    subgraph Frontend_App ["2. Frontend Application (Next.js 14)"]
        LoginPage["/login (JWT Auth & Role Guard)"]
        
        subgraph Live_Terminal ["Live Attendance Dashboard (/)"]
            DashboardUI["Dashboard & Stats Cards"]
            WebcamModule["WebcamStream Component"]
            CanvasOverlay["HTML5 Canvas Bounding Box Overlay"]
        end

        subgraph Enrollment_Portal ["Enrollment Portal (/enroll)"]
            EnrollForm["Student Info Form"]
            SampleCapture["5-Sample Capture Workflow"]
        end
    end

    %% Network / Protocol Layer
    subgraph Network_Layer ["3. Communication Layer"]
        REST_API["HTTP / REST API Engine"]
        WS_Stream["WebSocket Stream (/ws/recognize)"]
    end

    %% Backend Engine (FastAPI)
    subgraph Backend_Layer ["4. AI & Backend Microservice (FastAPI)"]
        API_Gateway["FastAPI Router & Auth Middleware"]
        
        subgraph GPU_Engine ["GPU Accelerated ML Pipeline"]
            OpenCV_Proc["OpenCV Frame Sampler"]
            InsightFace["InsightFace Engine (CUDA / TensorRT)"]
            Embedding_Gen["ArcFace 512-dim Vector Extractor"]
        end
        
        Business_Logic["Attendance Cooldown & Verification Engine"]
    end

    %% Database Layer (PostgreSQL)
    subgraph Data_Layer ["5. Database & Vector Storage Layer"]
        PostgreSQL[("PostgreSQL 16 Database")]
        PGVector["pgvector Extension"]
        
        subgraph DB_Tables ["Relational Schema"]
            Table_Students["students (ID, Roll, Name, Dept)"]
            Table_Vectors["embeddings (vector 512)"]
            Table_Logs["attendance (Timestamp, Student_ID, Status)"]
        end
    end

    %% Workflows & Data Flow Connections
    User_Faculty -->|Logs in as Faculty| LoginPage
    User_Admin -->|Logs in as Admin| LoginPage

    LoginPage -->|Access Granted: Professor| DashboardUI
    LoginPage -->|Access Granted: Admin| EnrollForm

    %% Dashboard Live Recognition Flow
    WebcamModule -->|JPEG Frames @ 10 FPS| WS_Stream
    WS_Stream -->|Compressed Frames| API_Gateway
    API_Gateway --> OpenCV_Proc --> InsightFace --> Embedding_Gen
    Embedding_Gen -->|512-dim Vector Search| PGVector
    PGVector -->|Cosine Similarity Match| Business_Logic
    Business_Logic -->|Write Attendance Log| Table_Logs
    API_Gateway -->|Bounding Box & Name Payloads| WS_Stream
    WS_Stream -->|Render Coordinates| CanvasOverlay

    %% Student Enrollment Flow
    EnrollForm -->|Student Data + 5 Image Samples| REST_API
    SampleCapture -->|Image Blobs| REST_API
    REST_API --> API_Gateway
    API_Gateway --> Embedding_Gen
    Embedding_Gen -->|Store Vectors| Table_Vectors
    API_Gateway -->|Save Student Profile| Table_Students

    %% DB Structure Linkages
    PostgreSQL --- PGVector
    PostgreSQL --- DB_Tables

```