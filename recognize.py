import cv2
import threading
import time
import pickle
import numpy as np

from insightface.app import FaceAnalysis


# --------------------------------------------------
# SETTINGS
# --------------------------------------------------

DATABASE_FILE = "data/faces.pkl"

# Starting threshold.
# We will calibrate this later.
RECOGNITION_THRESHOLD = 0.65


# --------------------------------------------------
# THREADED WEBCAM
# --------------------------------------------------

class ThreadedWebcam:

    def __init__(self, src=0):

        self.stream = cv2.VideoCapture(src)

        self.success, self.frame = self.stream.read()

        self.stopped = False


    def start(self):

        threading.Thread(
            target=self.update,
            args=(),
            daemon=True
        ).start()

        return self


    def update(self):

        while not self.stopped:

            self.success, self.frame = self.stream.read()


    def read(self):

        return self.frame


    def stop(self):

        self.stopped = True

        self.stream.release()


# --------------------------------------------------
# LOAD DATABASE
# --------------------------------------------------

print("Loading face database...")

try:

    with open(DATABASE_FILE, "rb") as f:

        database = pickle.load(f)

except FileNotFoundError:

    print("Face database not found!")

    print(f"Please run enroll.py first.")

    exit()


if len(database) == 0:

    print("Face database is empty.")

    exit()


print(f"Loaded {len(database)} student(s).")

for name, embeddings in database.items():

    print(f"  {name}: {len(embeddings)} sample(s)")


# --------------------------------------------------
# LOAD INSIGHTFACE
# --------------------------------------------------

print("\nLoading InsightFace model...")

app = FaceAnalysis(

    name="buffalo_s",

    providers=["CPUExecutionProvider"],

    allowed_modules=[
        "detection",
        "recognition"
    ]
)

app.prepare(

    ctx_id=-1,

    det_size=(320, 320)
)

print("Model loaded!")


# --------------------------------------------------
# START CAMERA
# --------------------------------------------------

camera = ThreadedWebcam(0).start()

time.sleep(1.0)

print("\nStarting recognition...")
print("Press Q to quit.")


# --------------------------------------------------
# RECOGNITION LOOP
# --------------------------------------------------

process_every_n_frames = 3

frame_count = 0

faces = []


while True:

    frame = camera.read()

    if frame is None:

        break

    frame = cv2.flip(frame, 1)

    frame_count += 1


    # ----------------------------------------------
    # RUN FACE RECOGNITION EVERY FEW FRAMES
    # ----------------------------------------------

    if frame_count % process_every_n_frames == 0:

        faces = app.get(frame)


    # ----------------------------------------------
    # PROCESS EACH DETECTED FACE
    # ----------------------------------------------

    for face in faces:

        # Face bounding box

        x1, y1, x2, y2 = face.bbox.astype(int)


        # ------------------------------------------
        # GET LIVE FACE EMBEDDING
        # ------------------------------------------

        live_embedding = face.normed_embedding


        # ------------------------------------------
        # FIND BEST MATCH
        # ------------------------------------------

        best_name = "Unknown"

        best_similarity = -1


        for name, stored_embeddings in database.items():

            for stored_embedding in stored_embeddings:

                similarity = np.dot(
                    live_embedding,
                    stored_embedding
                )


                if similarity > best_similarity:

                    best_similarity = similarity

                    best_name = name


        # ------------------------------------------
        # APPLY THRESHOLD
        # ------------------------------------------

        if best_similarity < RECOGNITION_THRESHOLD:

            best_name = "Unknown"


        # ------------------------------------------
        # DRAW FACE BOX
        # ------------------------------------------

        cv2.rectangle(

            frame,

            (x1, y1),

            (x2, y2),

            (0, 255, 0),

            2
        )


        # ------------------------------------------
        # DISPLAY NAME
        # ------------------------------------------

        label = f"{best_name} ({best_similarity:.2f})"


        cv2.putText(

            frame,

            label,

            (x1, y1 - 10),

            cv2.FONT_HERSHEY_SIMPLEX,

            0.7,

            (0, 255, 0),

            2
        )


    # ----------------------------------------------
    # SHOW CAMERA
    # ----------------------------------------------

    cv2.imshow(

        "Face Recognition",

        frame
    )


    # ----------------------------------------------
    # QUIT
    # ----------------------------------------------

    if cv2.waitKey(1) & 0xFF == ord("q"):

        break


# --------------------------------------------------
# CLEAN UP
# --------------------------------------------------

camera.stop()

cv2.destroyAllWindows()

print("\nCamera closed.")