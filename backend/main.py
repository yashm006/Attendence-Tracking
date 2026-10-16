from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import cv2
import numpy as np
import insightface
from insightface.app import FaceAnalysis
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from contextlib import asynccontextmanager

from database import engine, Base, get_db
from models import Student, AttendanceLog

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="AI Face Attendance API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

face_app = FaceAnalysis(
    name="buffalo_l",
    providers=["CUDAExecutionProvider", "CPUExecutionProvider"]
)
face_app.prepare(ctx_id=0, det_size=(640, 640))

COSINE_SIMILARITY_THRESHOLD = 0.45

class FramePayload(BaseModel):
    image: str
    course_code: str

class StudentRegisterPayload(BaseModel):
    student_id: str
    name: str
    images: list[str]

def decode_base64_image(base64_str: str) -> np.ndarray:
    try:
        raw_base64 = base64_str.split(",")[1] if "," in base64_str else base64_str
        image_bytes = base64.b64decode(raw_base64)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        return frame
    except Exception:
        return None

@app.get("/")
def health_check():
    return {"status": "online", "service": "AI Face Attendance Engine"}

@app.post("/api/register-student")
async def register_student(payload: StudentRegisterPayload, db: AsyncSession = Depends(get_db)):
    if not payload.images:
        raise HTTPException(status_code=400, detail="No reference images provided.")

    extracted_embeddings = []

    for img_str in payload.images:
        frame = decode_base64_image(img_str)
        if frame is None:
            continue

        faces = face_app.get(frame)
        if len(faces) > 0:
            largest_face = max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
            extracted_embeddings.append(largest_face.embedding)

    if not extracted_embeddings:
        raise HTTPException(
            status_code=400,
            detail="No valid faces detected across any captured frames. Please ensure your face is clearly visible."
        )

    # Average embeddings across captured poses and normalize to unit length
    mean_embedding = np.mean(extracted_embeddings, axis=0)
    norm = np.linalg.norm(mean_embedding)
    if norm > 0:
        mean_embedding = mean_embedding / norm

    # Auto-generate institutional email
    clean_id = payload.student_id.strip().lower()
    auto_email = f"{clean_id}@iiitdwd.ac.in"

    student = Student(
        id=payload.student_id.strip().upper(),
        name=payload.name.strip(),
        email=auto_email,
        embedding=mean_embedding.tolist()
    )

    db.add(student)
    try:
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to register student: {str(e)}")

    return {
        "status": "success",
        "student_id": student.id,
        "name": student.name,
        "poses_processed": len(extracted_embeddings)
    }

@app.post("/api/verify-face")
async def verify_face(payload: FramePayload, db: AsyncSession = Depends(get_db)):
    try:
        frame = decode_base64_image(payload.image)
        if frame is None:
            raise HTTPException(status_code=400, detail="Failed to decode image frame.")

        faces = face_app.get(frame)
        if len(faces) == 0:
            return {
                "matched": False,
                "message": "No face detected in webcam frame.",
                "faces_found": 0
            }

        largest_face = max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
        current_embedding = largest_face.embedding.tolist()
        bbox = [int(v) for v in largest_face.bbox]

        query = (
            select(
                Student,
                Student.embedding.cosine_distance(current_embedding).label("distance")
            )
            .order_by("distance")
            .limit(1)
        )

        result = await db.execute(query)
        match_row = result.first()

        if not match_row:
            return {"matched": False, "message": "No registered students found in database."}

        student, distance = match_row
        cosine_similarity = 1.0 - distance

        if cosine_similarity >= COSINE_SIMILARITY_THRESHOLD:
            log_entry = AttendanceLog(
                student_id=student.id,
                course_code=payload.course_code,
                confidence=float(cosine_similarity)
            )
            db.add(log_entry)
            await db.commit()

            return {
                "matched": True,
                "student_id": student.id,
                "student_name": student.name,
                "confidence": round(float(cosine_similarity), 4),
                "bbox": bbox,
                "faces_found": len(faces)
            }

        return {
            "matched": False,
            "message": "Face detected, but no matching student record was found.",
            "confidence": round(float(cosine_similarity), 4),
            "faces_found": len(faces)
        }

    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@app.get("/api/attendance-logs")
async def get_attendance_logs(db: AsyncSession = Depends(get_db)):
    try:
        query = (
            select(
                AttendanceLog.id,
                AttendanceLog.student_id,
                Student.name.label("student_name"),
                AttendanceLog.course_code,
                AttendanceLog.confidence,
                AttendanceLog.timestamp
            )
            .join(Student, AttendanceLog.student_id == Student.id)
            .order_by(AttendanceLog.timestamp.desc())
        )
        result = await db.execute(query)
        logs = result.all()

        return [
            {
                "id": row.id,
                "student_id": row.student_id,
                "student_name": row.student_name,
                "course_code": row.course_code,
                "confidence": round(row.confidence, 4),
                "timestamp": row.timestamp.isoformat() if row.timestamp else ""
            }
            for row in logs
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch logs: {str(e)}")