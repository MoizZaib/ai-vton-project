# 🔧 Backend Documentation

## Overview

The backend is built with **FastAPI**, a modern, high-performance Python web framework. It provides RESTful APIs for product management and AI-powered body measurement analysis.

## Directory Structure

```
backend-fastapi/
├── main.py                    # FastAPI application and routes
├── requirements.txt           # Python dependencies
├── product_db.json           # Product database (JSON)
├── uploads/                  # Image storage directory
├── models/
│   └── schemas.py           # Pydantic models
└── services/
    └── measurement_service.py  # MediaPipe integration
```

## Quick Start

```bash
# Navigate to backend
cd backend-fastapi

# Create virtual environment
python -m venv venv

# Activate (Windows CMD)
venv\Scripts\activate

# Activate (Git Bash / Unix)
source venv/Scripts/activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Core Components

### main.py

The main application file containing:

- FastAPI app initialization
- CORS middleware configuration
- API route definitions
- Static file serving

### models/schemas.py

Pydantic models for:

- Product data validation
- User measurement structures
- Fit report generation
- API request/response schemas

### services/measurement_service.py

AI processing service that:

- Uses MediaPipe Pose Landmarker
- Extracts body measurements from images
- Generates fit comparisons

## API Endpoints

| Method | Endpoint             | Description                     |
| ------ | -------------------- | ------------------------------- |
| GET    | `/products`          | List all products               |
| GET    | `/products/{id}`     | Get single product              |
| POST   | `/admin/add-product` | Add new product (requires key)  |
| POST   | `/measure`           | Extract measurements from image |
| POST   | `/compare`           | Compare user to product         |
| POST   | `/analyze`           | Full analysis with product      |

## Documentation Files

- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [Models & Schemas](./MODELS.md) - Data model documentation
- [Measurement Service](./MEASUREMENT_SERVICE.md) - MediaPipe service details

## Dependencies

| Package          | Version  | Purpose             |
| ---------------- | -------- | ------------------- |
| fastapi          | ≥0.109.0 | Web framework       |
| uvicorn          | ≥0.27.0  | ASGI server         |
| mediapipe        | ≥0.10.30 | Pose detection      |
| opencv-python    | ≥4.9.0   | Image processing    |
| numpy            | ≥1.26.3  | Numerical computing |
| pillow           | ≥10.2.0  | Image handling      |
| python-multipart | ≥0.0.6   | File uploads        |

## Configuration

### CORS Settings

```python
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]
```

### Admin Key

- Default: `MYSECRET`
- Change in `main.py` for production

## Error Handling

The backend returns consistent error responses:

```json
{
  "detail": "Error message here"
}
```

Common status codes:

- `200` - Success
- `400` - Bad request / Validation error
- `401` - Unauthorized (admin routes)
- `404` - Resource not found
- `500` - Server error

---

Next: [API Reference](./API_REFERENCE.md)
