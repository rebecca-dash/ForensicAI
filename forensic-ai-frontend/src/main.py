import os
import cv2
import torch
import uvicorn
import numpy as np
from fastapi import FastAPI, File, UploadFile
from PIL import Image
from io import BytesIO
from transformers import pipeline

# Initialize FastAPI app
app = FastAPI()

# Load AI models
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')  # YOLO for object detection
text_generator = pipeline("text-generation", model="gpt-3.5-turbo")  # GPT for reports


def read_image(file) -> np.ndarray:
    """Convert uploaded image file to OpenCV format."""
    image = Image.open(BytesIO(file))
    return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)


@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    image = read_image(await file.read())
    results = model(image)
    detections = results.pandas().xyxy[0]  # Convert to Pandas DataFrame

    findings = []
    for _, row in detections.iterrows():
        findings.append(f"Detected {row['name']} at ({row['xmin']}, {row['ymin']})")

    # Generate forensic report
    report_text = text_generator(
        f"Crime Scene Report:\nFindings: {findings}\nExplain forensic relevance.",
        max_length=150
    )[0]['generated_text']

    return {"findings": findings, "report": report_text}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
