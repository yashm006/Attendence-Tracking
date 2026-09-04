import os
import pickle
import threading
import time
import cv2
from flask import Flask, Response, jsonify, render_template_string, request
from insightface.app import FaceAnalysis

# ==================================================
# SETTINGS & GLOBALS
# ==================================================
DATABASE_FILE = "data/faces.pkl"
SAMPLES_NEEDED = 5
TIME_BETWEEN_SAMPLES = 1.0

os.makedirs("data", exist_ok=True)

# Load Database
if os.path.exists(DATABASE_FILE):
    with open(DATABASE_FILE, "rb") as f:
        database = pickle.load(f)
else:
    database = {}

# Load InsightFace Model
print("Loading InsightFace model...")
app_model = FaceAnalysis(
    name="buffalo_s",
    providers=["CPUExecutionProvider"],
    allowed_modules=["detection", "recognition"],
)
app_model.prepare(ctx_id=-1, det_size=(320, 320))
print("Model loaded successfully!")


# ==================================================
# THREADED WEBCAM
# ==================================================
class ThreadedWebcam:

    def __init__(self, src=0):
        self.stream = cv2.VideoCapture(src)
        self.stream.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.stream.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        self.stream.set(cv2.CAP_PROP_FPS, 30)
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


camera = ThreadedWebcam(0).start()
time.sleep(1.0)

# ==================================================
# ASYNC STATE & LOCKS
# ==================================================
latest_faces = []
lock = threading.Lock()

enrollment_state = {
    "active": False,
    "student_name": "",
    "samples": [],
    "last_capture_time": 0,
    "status": "Idle",
    "completed": False,
}


# ==================================================
# BACKGROUND AI INFERENCE WORKER
# ==================================================
def face_processing_worker():
    global latest_faces, database, enrollment_state

    while True:
        frame = camera.read()
        if frame is None:
            time.sleep(0.01)
            continue

        # Mirror frame prior to model processing
        flipped_frame = cv2.flip(frame, 1)

        # Run heavy ML inference asynchronously in background
        faces = app_model.get(flipped_frame)

        with lock:
            latest_faces = faces

            # Process enrollment captures asynchronously
            if enrollment_state["active"] and not enrollment_state["completed"]:
                current_time = time.time()
                samples = enrollment_state["samples"]

                if len(faces) == 1 and (
                    current_time - enrollment_state["last_capture_time"]
                    >= TIME_BETWEEN_SAMPLES
                ):
                    face = faces[0]
                    samples.append(face.normed_embedding.copy())
                    enrollment_state["last_capture_time"] = current_time
                    print(
                        f"Captured sample {len(samples)}/{SAMPLES_NEEDED} for {enrollment_state['student_name']}"
                    )

                if len(samples) >= SAMPLES_NEEDED:
                    student_name = enrollment_state["student_name"]
                    if student_name in database:
                        database[student_name].extend(samples)
                    else:
                        database[student_name] = samples

                    with open(DATABASE_FILE, "wb") as f:
                        pickle.dump(database, f)

                    print(f"Enrollment completed for {student_name}")
                    enrollment_state["active"] = False
                    enrollment_state["completed"] = True

        time.sleep(0.02)


# Start background AI processing thread
threading.Thread(target=face_processing_worker, daemon=True).start()

app = Flask(__name__)

# ==================================================
# FRONTEND HTML
# ==================================================
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Face Enrollment System</title>
    <style>
        body { font-family: Arial, sans-serif; background: #121212; color: white; text-align: center; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: #1e1e1e; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5); }
        h2 { margin-top: 0; }
        .video-box { margin: 20px 0; border: 3px solid #333; border-radius: 8px; overflow: hidden; display: inline-block; background: black; }
        img { display: block; width: 640px; height: 480px; object-fit: cover; }
        .form-group { margin: 15px 0; }
        input[type="text"] { padding: 12px; width: 260px; font-size: 16px; border-radius: 6px; border: 1px solid #444; background: #2a2a2a; color: white; outline: none; }
        input[type="text"]:focus { border-color: #28a745; }
        button { padding: 12px 24px; font-size: 16px; border: none; border-radius: 6px; cursor: pointer; background: #28a745; color: white; margin-left: 10px; font-weight: bold; }
        button:hover { background: #218838; }
        button:disabled { background: #555; cursor: not-allowed; }
        .status-box { font-size: 18px; margin-top: 15px; padding: 10px; border-radius: 6px; background: #2a2a2a; display: inline-block; min-width: 300px; }
        .count { font-size: 24px; color: #00ffcc; font-weight: bold; }
        .info { margin-top: 15px; color: #999; font-size: 14px; }
    </style>
</head>
<body>
<div class="container">
    <h2>Student Face Enrollment Portal</h2>
    <div class="form-group">
        <input type="text" id="studentName" placeholder="Enter Student Name" autocomplete="off" />
        <button id="enrollButton" onclick="startEnrollment()">Start Enrollment</button>
    </div>
    <div class="video-box">
        <img src="/video_feed" alt="Webcam Stream">
    </div>
    <div class="status-box" id="statusBox">
        Status: Ready for next student
    </div>
    <div class="info">
        Camera: 640 × 480 | Multi-threaded Async Inference
    </div>
</div>

<script>
function startEnrollment() {
    const nameInput = document.getElementById("studentName");
    const button = document.getElementById("enrollButton");
    const statusBox = document.getElementById("statusBox");
    const name = nameInput.value.trim();

    if (!name) {
        alert("Please enter a student name first.");
        nameInput.focus();
        return;
    }

    button.disabled = true;
    nameInput.disabled = true;

    fetch("/start_enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name })
    })
    .then(response => response.json())
    .then(data => {
        statusBox.innerText = data.message;
    })
    .catch(error => {
        console.error(error);
        statusBox.innerText = "Could not start enrollment.";
        button.disabled = false;
        nameInput.disabled = false;
    });
}

setInterval(() => {
    fetch("/status")
    .then(response => response.json())
    .then(data => {
        const box = document.getElementById("statusBox");
        const nameInput = document.getElementById("studentName");
        const button = document.getElementById("enrollButton");

        if (data.active) {
            box.innerHTML = `Enrolling: <b>${data.student_name}</b> | Captured: <span class="count">${data.samples_count}/${data.total_needed}</span>`;
        } else if (data.completed) {
            box.innerHTML = `<span style="color: #28a745; font-weight: bold;">Successfully enrolled ${data.student_name}!</span> Ready for next.`;
            nameInput.value = "";
            nameInput.disabled = false;
            button.disabled = false;
        }
    })
    .catch(error => console.error(error));
}, 800);
</script>
</body>
</html>
"""


# ==================================================
# UNBLOCKED FAST VIDEO GENERATOR
# ==================================================
def generate_frames():
    while True:
        start_time = time.time()

        frame = camera.read()
        if frame is None:
            continue

        # Flip frame horizontally
        frame = cv2.flip(frame, 1)

        # Get latest face predictions without waiting for model execution
        with lock:
            faces_to_draw = list(latest_faces)
            is_active = enrollment_state["active"]
            student_name = enrollment_state["student_name"]
            sample_count = len(enrollment_state["samples"])

        # Draw bounding boxes instantly
        for face in faces_to_draw:
            x1, y1, x2, y2 = face.bbox.astype(int)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

        if is_active:
            cv2.putText(
                frame,
                f"Enrolling: {student_name} ({sample_count}/{SAMPLES_NEEDED})",
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 255, 255),
                2,
            )

        # Encode frame to JPEG
        success, buffer = cv2.imencode(
            ".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 70]
        )
        if not success:
            continue

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n"
        )

        # Maintain clean ~30 FPS stream
        elapsed = time.time() - start_time
        sleep_time = max(0.001, (1.0 / 30.0) - elapsed)
        time.sleep(sleep_time)


# ==================================================
# ROUTES
# ==================================================
@app.route("/")
def index():
    return render_template_string(HTML_TEMPLATE)


@app.route("/video_feed")
def video_feed():
    return Response(
        generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame"
    )


@app.route("/start_enrollment", methods=["POST"])
def start_enrollment():
    data = request.get_json()
    raw_name = data.get("name", "").strip() if data else ""

    if not raw_name:
        return jsonify({"message": "Student name is required."}), 400

    clean_name = raw_name

    with lock:
        enrollment_state["active"] = True
        enrollment_state["completed"] = False
        enrollment_state["student_name"] = clean_name
        enrollment_state["samples"] = []
        enrollment_state["last_capture_time"] = 0

    print(f"\nStarting enrollment for {clean_name}...")
    return jsonify(
        {
            "message": f"Started enrollment for {clean_name}. Look at the camera."
        }
    )


@app.route("/status")
def status():
    with lock:
        return jsonify(
            {
                "active": enrollment_state["active"],
                "completed": enrollment_state["completed"],
                "student_name": enrollment_state["student_name"],
                "samples_count": len(enrollment_state["samples"]),
                "total_needed": SAMPLES_NEEDED,
            }
        )


# ==================================================
# MAIN
# ==================================================
if __name__ == "__main__":
    print("\n======================================")
    print("Student Face Enrollment System")
    print("======================================")
    print("Open: http://127.0.0.1:5000")
    print("======================================\n")

    app.run(host="127.0.0.1", port=5000, debug=False, threaded=True)