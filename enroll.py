import cv2
import os
import pickle
import numpy as np
from insightface.app import FaceAnalysis

# --------------------------------------------------
# SETTINGS
# --------------------------------------------------

DATABASE_FILE = "data/faces.pkl"
SAMPLES_NEEDED = 5

# --------------------------------------------------
# LOAD INSIGHTFACE
# --------------------------------------------------

print("Loading InsightFace model...")

app = FaceAnalysis(
    name="buffalo_s",
    providers=["CPUExecutionProvider"],
    allowed_modules=["detection", "recognition"]
)

app.prepare(
    ctx_id=-1,
    det_size=(320, 320)
)

print("Model loaded!")

# --------------------------------------------------
# LOAD EXISTING DATABASE
# --------------------------------------------------

os.makedirs("data", exist_ok=True)

if os.path.exists(DATABASE_FILE):
    with open(DATABASE_FILE, "rb") as f:
        database = pickle.load(f)
else:
    database = {}

# --------------------------------------------------
# GET STUDENT NAME
# --------------------------------------------------

name = input("\nEnter student name: ").strip()

if not name:
    print("Invalid name.")
    exit()

# --------------------------------------------------
# OPEN CAMERA
# --------------------------------------------------

camera = cv2.VideoCapture(0)

print("\nCamera started.")
print("Look at the camera.")
print("Press Q to cancel.")

embeddings = []

while len(embeddings) < SAMPLES_NEEDED:

    success, frame = camera.read()

    if not success:
        print("Could not read camera.")
        break

    faces = app.get(frame)

    # Draw all detected faces
    for face in faces:

        x1, y1, x2, y2 = face.bbox.astype(int)

        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            (0, 255, 0),
            2
        )

    # We only want to capture when exactly ONE face is visible
    if len(faces) == 1:

        face = faces[0]

        # Get normalized face embedding
        embedding = face.normed_embedding

        embeddings.append(embedding.copy())

        print(
            f"Captured sample "
            f"{len(embeddings)}/{SAMPLES_NEEDED}"
        )

        # Small delay so we don't capture
        # essentially identical frames
        cv2.waitKey(300)

    # Display progress
    cv2.putText(
        frame,
        f"Samples: {len(embeddings)}/{SAMPLES_NEEDED}",
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (0, 255, 0),
        2
    )

    cv2.imshow("Student Enrollment", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

# --------------------------------------------------
# CLEAN UP CAMERA
# --------------------------------------------------

camera.release()
cv2.destroyAllWindows()

# --------------------------------------------------
# SAVE EMBEDDINGS
# --------------------------------------------------

if len(embeddings) == SAMPLES_NEEDED:

    # If student already exists, add to their samples
    if name in database:
        database[name].extend(embeddings)
    else:
        database[name] = embeddings

    with open(DATABASE_FILE, "wb") as f:
        pickle.dump(database, f)

    print("\nEnrollment successful!")
    print(f"Student: {name}")
    print(f"Samples stored: {len(embeddings)}")
    print(f"Database: {DATABASE_FILE}")

else:

    print("\nEnrollment cancelled.")
    print("Not enough samples were captured.")