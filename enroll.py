import cv2
import os
import pickle
import time

from insightface.app import FaceAnalysis


# --------------------------------------------------
# SETTINGS
# --------------------------------------------------

DATABASE_FILE = "data/faces.pkl"
SAMPLES_NEEDED = 5
PREPARATION_TIME = 5
TIME_BETWEEN_SAMPLES = 1.0


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

if not camera.isOpened():
    print("Could not open camera.")
    exit()

print("\nCamera started.")
print("Get ready!")
print("Press Q at any time to cancel.")


# --------------------------------------------------
# PREPARATION COUNTDOWN
# --------------------------------------------------

countdown_start = time.time()

while True:

    success, frame = camera.read()

    if not success:
        print("Could not read camera.")
        camera.release()
        cv2.destroyAllWindows()
        exit()

    elapsed = time.time() - countdown_start
    remaining = PREPARATION_TIME - elapsed

    if remaining <= 0:
        break

    seconds_left = int(remaining) + 1

    cv2.putText(
        frame,
        "Get ready!",
        (40, 60),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.2,
        (0, 255, 0),
        3
    )

    cv2.putText(
        frame,
        f"Starting in {seconds_left}",
        (40, 110),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.0,
        (0, 255, 0),
        2
    )

    cv2.imshow("Student Enrollment", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):

        camera.release()
        cv2.destroyAllWindows()

        print("\nEnrollment cancelled.")
        exit()


# --------------------------------------------------
# CAPTURE FACE EMBEDDINGS
# --------------------------------------------------

print("\nStarting enrollment!")
print("Keep your face visible.")
print("Slightly change your pose between captures.")

embeddings = []

last_capture_time = 0


while len(embeddings) < SAMPLES_NEEDED:

    success, frame = camera.read()

    if not success:
        print("Could not read camera.")
        break

    # ----------------------------------------------
    # DETECT FACES
    # ----------------------------------------------

    faces = app.get(frame)

    # ----------------------------------------------
    # DRAW DETECTED FACES
    # ----------------------------------------------

    for face in faces:

        x1, y1, x2, y2 = face.bbox.astype(int)

        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            (0, 255, 0),
            2
        )


    # ----------------------------------------------
    # CAPTURE ONLY WHEN EXACTLY ONE FACE IS FOUND
    # ----------------------------------------------

    current_time = time.time()

    if (
        len(faces) == 1
        and current_time - last_capture_time >= TIME_BETWEEN_SAMPLES
    ):

        face = faces[0]

        # Get normalized face embedding
        embedding = face.normed_embedding

        # Store a copy
        embeddings.append(embedding.copy())

        last_capture_time = current_time

        print(
            f"Captured sample "
            f"{len(embeddings)}/{SAMPLES_NEEDED}"
        )


    # ----------------------------------------------
    # DISPLAY STATUS
    # ----------------------------------------------

    cv2.putText(
        frame,
        f"Samples: {len(embeddings)}/{SAMPLES_NEEDED}",
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (0, 255, 0),
        2
    )

    if len(faces) == 0:

        cv2.putText(
            frame,
            "No face detected",
            (20, 80),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 0, 255),
            2
        )

    elif len(faces) > 1:

        cv2.putText(
            frame,
            "Only one person should be visible",
            (20, 80),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 0, 255),
            2
        )

    else:

        cv2.putText(
            frame,
            "Face detected",
            (20, 80),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2
        )


    # ----------------------------------------------
    # SHOW CAMERA
    # ----------------------------------------------

    cv2.imshow("Student Enrollment", frame)


    # ----------------------------------------------
    # QUIT
    # ----------------------------------------------

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

    # Student already exists
    if name in database:

        database[name].extend(embeddings)

    # New student
    else:

        database[name] = embeddings


    with open(DATABASE_FILE, "wb") as f:

        pickle.dump(database, f)


    print("\nEnrollment successful!")
    print(f"Student: {name}")
    print(f"Samples stored this session: {len(embeddings)}")
    print(f"Total samples for {name}: {len(database[name])}")
    print(f"Database: {DATABASE_FILE}")


else:

    print("\nEnrollment cancelled.")
    print(
        f"Only {len(embeddings)}/{SAMPLES_NEEDED} "
        "samples were captured."
    )