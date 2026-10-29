# AI Image Recognition

An AI-powered web application that allows users to upload an image and identify its likely contents using a pretrained Vision Transformer (ViT) model.

The application combines a React frontend with a Python FastAPI backend to provide image classification results, confidence scores, and a visual preview of the uploaded image.

## Features

- Upload images through a web interface
- Preview the selected image before recognition
- Predict the top 5 image categories
- Display confidence scores with visual progress bars
- Validate image uploads and handle API errors
- Expose a REST API for image classification
- Separate frontend and backend for easier maintenance

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Axios
- CSS

**Backend**
- Python
- FastAPI
- Pillow
- Uvicorn

**AI / Machine Learning**
- PyTorch
- Hugging Face Transformers
- Google ViT Base Patch16 224 pretrained model

## How It Works

1. The user selects an image in the React frontend.
2. Axios sends the image to the FastAPI backend using a multipart form-data request.
3. Pillow opens the uploaded image and converts it to RGB format.
4. The pretrained ViT model classifies the image.
5. The backend returns the top 5 predicted labels and their confidence scores.
6. The frontend displays the predictions and confidence bars.

## Project Structure

```text
ai-image-recognition/
├── app/
│   ├── __init__.py
│   ├── main.py
│   └── classifier.py
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── imageApi.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
├── requirements.txt
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10 or a compatible version for the installed dependencies
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ai-image-recognition
```

### 2. Set up the backend

Create and activate a Python virtual environment.

**Windows PowerShell:**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the dependencies:

```powershell
python -m pip install -r requirements.txt
```

Start the backend from the project root:

```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

The API will be available at:

- API root: http://127.0.0.1:8001/
- Health check: http://127.0.0.1:8001/health
- Interactive API documentation: http://127.0.0.1:8001/docs

The pretrained model may need to download the first time it runs.

### 3. Set up the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

http://localhost:5173

Make sure the backend is running before submitting an image.

## API Endpoint

### `POST /predict`

Accepts an image uploaded as multipart form data.

**Request field**

| Field | Type | Description |
|---|---|---|
| `file` | File | Image to classify |

**Example response**

```json
{
  "filename": "dog.jpg",
  "predictions": [
    {
      "rank": 1,
      "label": "golden retriever",
      "confidence": 0.8649
    }
  ]
}
```

The example illustrates the response structure; actual predictions depend on the uploaded image.

## Current Model Limitations

The pretrained ViT model is designed for general image classification across ImageNet-1k categories. It can recognize many common objects and animals, but it is not designed to identify specific celebrities, perform unrestricted object detection, or guarantee correct predictions.

Confidence scores are model outputs and should not be interpreted as guaranteed probabilities of correctness.

## What I Learned

- Integrating a pretrained machine learning model into a backend API
- Building REST endpoints with FastAPI
- Handling image uploads and image preprocessing
- Connecting a React frontend to a Python backend with Axios
- Managing asynchronous API requests, loading states, and errors
- Displaying model predictions in a user-friendly interface

## Future Improvements

- Save recognition history in PostgreSQL
- Add automated backend and frontend tests
- Improve logging and API error handling
- Add more advanced image analysis capabilities
- Deploy the frontend and backend for public access

## License

Choose and add a license if you intend to allow others to reuse or modify this project.
