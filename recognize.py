import csv
import os
import pickle
import threading
import time
from datetime import datetime
import cv2
import numpy as np
from insightface.app import FaceAnalysis

# ==================================================
# SETTINGS
# ==================================================
DATABASE_FILE = "data/faces.pkl"
ATTENDANCE_FILE = "attendance.csv"
RECOGNITION_THRESHOLD = 0.45
COOLDOWN_SECONDS = 300

os.makedirs("data", exist_ok=True)


# ==================================================
# THREADED WEBCAM
# ==================================================
class ThreadedWebcam:

    def __init__(self, src=0):
        self.stream = cv2.VideoCapture(src)
        self.stream.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.stream.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        self.success, self.frame = self.stream.read()
        self.stopped = False

    def start(self):
        threading.Thread(target=self.update, daemon=True).start()
        return self

    def update(self):
        while not self.stopped:
            self.success, self.frame = self.stream.read()

    def read(self):
        return self.frame

    def stop(self):
        self.stopped = True
        self.stream.release()


# ==================================================
# LOAD & VECTORIZE DATABASE
# ==================================================
print("Loading face database...")
try:
    with open(DATABASE_FILE, "rb") as f:
        database = pickle.load(f)
except FileNotFoundError:
    print("Face database not found! Run enrollment first.")
    exit()

if len(database) == 0:
    print("Face database is empty.")
    exit()

known_names = []
known_embeddings = []

for name, embeddings in database.items():
    for emb in embeddings:
        known_names.append(name)
        known_embeddings.append(emb)

known_embeddings_matrix = np.array(known_embeddings)
print(
    f"Loaded {len(database)} student(s) with {len(known_embeddings)} total vector samples."
)

# ==================================================
# ATTENDANCE LOGGER WITH COOLDOWN
# ==================================================
last_logged_time = {}


def log_attendance(student_name):
    current_time = time.time()

    if (
        student_name in last_logged_time
        and (current_time - last_logged_time[student_name]) < COOLDOWN_SECONDS
    ):
        return False

    last_logged_time[student_name] = current_time
    now = datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    time_str = now.strftime("%H:%M:%S")

    file_exists = os.path.exists(ATTENDANCE_FILE)

    with open(ATTENDANCE_FILE, "a", newline="") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["Name", "Date", "Time"])
        writer.writerow([student_name, date_str, time_str])

    print(f"[ATTENDANCE MARKED] {student_name} at {time_str}")
    return True


# ==================================================
# LOAD INSIGHTFACE ON GPU
# ==================================================
print("\nLoading InsightFace model on GPU...")
app = FaceAnalysis(
    name="buffalo_s",
    # Pass CUDA execution provider first, fallback to CPU
    providers=["CUDAExecutionProvider", "CPUExecutionProvider"],
    allowed_modules=["detection", "recognition"],
)

# ctx_id = 0 assigns execution to GPU 0 (ctx_id = -1 was CPU)
app.prepare(ctx_id=0, det_size=(320, 320))
print("Model successfully loaded on GPU!")

# ==================================================
# START RECOGNITION LOOP
# ==================================================
camera = ThreadedWebcam(0).start()
time.sleep(1.0)

print("\nStarting real-time GPU recognition. Press 'Q' to quit.")

# With GPU acceleration, you can run inference every single frame or every 2nd frame
process_every_n_frames = 1
frame_count = 0
faces = []

while True:
    frame = camera.read()
    if frame is None:
        break

    frame = cv2.flip(frame, 1)
    frame_count += 1

    if frame_count % process_every_n_frames == 0:
        faces = app.get(frame)

    for face in faces:
        x1, y1, x2, y2 = face.bbox.astype(int)
        live_embedding = face.normed_embedding

        similarities = np.dot(known_embeddings_matrix, live_embedding)
        best_idx = np.argmax(similarities)
        best_similarity = similarities[best_idx]

        if best_similarity >= RECOGNITION_THRESHOLD:
            best_name = known_names[best_idx]
            color = (0, 255, 0)
            log_attendance(best_name)
        else:
            best_name = "Unknown"
            color = (0, 0, 255)

        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
        label = f"{best_name} ({best_similarity:.2f})"
        cv2.putText(
            frame,
            label,
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            color,
            2,
        )

    cv2.imshow("Student Attendance System (GPU)", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

camera.stop()
cv2.destroyAllWindows()
print("\nRecognition stopped.")