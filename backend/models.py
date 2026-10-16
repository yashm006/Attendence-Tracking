import uuid
from sqlalchemy import Column, String, DateTime, Float, ForeignKey
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, index=True)  # e.g., Roll No or UUID
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    # ArcFace 512-dim floating-point embedding vector
    embedding = Column(Vector(512), nullable=False)

class AttendanceLog(Base):
    __tablename__ = "attendance_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    course_code = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())