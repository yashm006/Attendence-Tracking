from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import cv2
import numpy as np

app = FastAPI(title="AI Face Attendance API", version="1.0.0")

# Enable CORS for Next.js frontend on localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FramePayload(BaseModel):
    image: str  # Base64 encoded frame from frontend canvas
    course_code: str

@app.get("/")
def health_check():
    return {"status": "online", "service": "AI Face Attendance Engine"}

@app.post("/api/verify-face")
async def verify_face(payload: FramePayload):
    try:
        # Strip header if present (e.g., "data:image/jpeg;base64,")
        raw_base64 = payload.image.split(",")[1] if "," in payload.image else payload.image
        
        # Decode base64 bytes into OpenCV image matrix (BGR format)
        image_bytes = base64.b64decode(raw_base64)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            raise HTTPException(status_code=400, detail="Failed to decode image frame")

        # Frame processing metadata
        height, width, _ = frame.shape

        # Placeholder detection payload (Ready for InsightFace embedding similarity matrix)
        return {
            "matched": True,
            "student_id": "s101",
            "student_name": "Alex Rivera",
            "confidence": 0.96,
            "frame_dimensions": f"{width}x{height}",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")