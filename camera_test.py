import cv2
import threading
import time
from insightface.app import FaceAnalysis

class ThreadedWebcam:
    def __init__(self, src=0):
        self.stream = cv2.VideoCapture(src)
        self.success, self.frame = self.stream.read()
        self.stopped = False

    def start(self):
        threading.Thread(target=self.update, args=(), daemon=True).start()
        return self

    def update(self):
        while not self.stopped:
            self.success, self.frame = self.stream.read()

    def read(self):
        return self.frame

    def stop(self):
        self.stopped = True
        self.stream.release()

# 1. Switch to 'buffalo_s' and restrict modules to save CPU cycles
app = FaceAnalysis(
    name="buffalo_s",
    providers=["CPUExecutionProvider"],  # Swap to "CUDAExecutionProvider" if using an NVIDIA GPU
    allowed_modules=["detection", "recognition"] 
)

# 2. Keep detection size light
app.prepare(ctx_id=-1, det_size=(320, 320))

camera = ThreadedWebcam(0).start()
time.sleep(1.0)

print("Starting camera... Press Q to quit.")

process_every_n_frames = 3  # Run inference on 1 out of every 3 frames
frame_count = 0
faces = []

while True:
    frame = camera.read()
    if frame is None:
        break

    frame_count += 1
    if frame_count % process_every_n_frames == 0:
        faces = app.get(frame)

    for face in faces:
        x1, y1, x2, y2 = face.bbox.astype(int)
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        
        cv2.putText(
            frame,
            f"Face: {face.det_score:.2f}",
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2
        )

    cv2.imshow("InsightFace - Fast Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

camera.stop()
cv2.destroyAllWindows()
print("\nCamera closed.")