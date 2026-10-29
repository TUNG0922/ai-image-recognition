
from io import BytesIO

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from app.classifier import classify_image


app = FastAPI(
    title="AI Image Recognition API",
    description="Upload an image and classify its contents",
    version="1.0.0",
)

# Allow requests from the local React development server.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@app.get("/")
def home():
    return {
        "message": "AI Image Recognition API is running!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    # Validate the uploaded file's declared content type.
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image file.",
        )

    # Read the uploaded file.
    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty.",
        )

    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image size must not exceed 10 MB.",
        )

    # Decode the image and convert it to RGB.
    try:
        image = Image.open(
            BytesIO(image_bytes)
        ).convert("RGB")

    except (UnidentifiedImageError, OSError, ValueError):
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid image.",
        )

    # Run AI inference.
    try:
        predictions = classify_image(image)

    except Exception:
        # Log the real exception in the backend terminal.
        import logging

        logging.exception("Image classification failed")

        raise HTTPException(
            status_code=500,
            detail="Image classification failed.",
        )

    return {
        "filename": file.filename,
        "predictions": predictions,
    }
