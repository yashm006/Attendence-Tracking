# AI-Powered Automated Attendance System

An enterprise-grade, real-time facial recognition attendance system powered by **InsightFace**, **FastAPI**, **Next.js**, and **PostgreSQL (pgvector)**.

---

## Key Features

- **Real-Time Identification:** Sub-50ms inference utilizing CUDA-accelerated InsightFace models.
- **Asynchronous Processing:** Multi-threaded frame processing and dynamic WebSocket video streaming.
- **Vector Search Engine:** High-performance cosine similarity matching natively inside PostgreSQL using `pgvector`.
- **Enrollment Portal:** Integrated web portal for single and batch student registration.
- **Live Attendance Dashboard:** Real-time log updating with anti-duplication cooldown filters.
- **Analytics & Exporting:** Export attendance data in CSV and Excel formats.

---

## Architecture Overview

```
+------------------+         WebSockets         +-------------------+
| Next.js Frontend | <------------------------> | FastAPI ML Service|
+------------------+                            +-------------------+
|                                                |
| REST API                                       | Vector Queries
v                                                v
+-------------------------------------------------------------------+
|                  PostgreSQL Database + pgvector                   |
+-------------------------------------------------------------------+
```

---

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend API:** FastAPI (Python 3.10+) / Node.js
- **Machine Learning:** InsightFace (`buffalo_s`), OpenCV, ONNX Runtime GPU (CUDA 12.x)
- **Database:** PostgreSQL 16 with `pgvector`
- **Streaming:** WebSockets / WebRTC

---

## Getting Started

### Prerequisites

- NVIDIA GPU with CUDA 11.8+ / 12.x and cuDNN installed.
- Docker & Docker Compose.
- Python 3.10+
- Node.js 18+

---

### Installation & Local Setup

#### 1. Clone the Repository
```bash
git clone [https://github.com/your-org/attendance-system.git](https://github.com/your-org/attendance-system.git)
cd attendance-system
```


#### 2. Start Database
```Bash
docker-compose up -d postgres
```

#### 3. Setup ML Engine & Backend
```Bash
# Create Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run ML API service
uvicorn ml_service.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 4. Setup Frontend
```Bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000 in your browser.
