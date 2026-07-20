# 💻 Development Guide

## Overview

This guide is for developers who want to understand, modify, or extend the AI-Based Clothing Size Suggestion system.

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Python | 3.9+ | Backend runtime |
| Node.js | 18+ | Frontend runtime |
| Git | Any | Version control |
| VS Code | Any | Recommended IDE |

### Recommended VS Code Extensions

- Python
- Pylance
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier
- ESLint

## Project Structure

```
ecom-vton/
├── backend-fastapi/           # Python backend
│   ├── main.py                # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   ├── product_db.json        # Product database
│   ├── uploads/               # Image storage
│   ├── models/
│   │   └── schemas.py         # Pydantic models
│   └── services/
│       └── measurement_service.py  # MediaPipe logic
│
├── frontend-react/            # React frontend
│   ├── package.json           # Node dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind config
│   ├── index.html            # HTML entry
│   └── src/
│       ├── main.jsx          # React entry
│       ├── App.jsx           # Main app
│       ├── index.css         # Global styles
│       ├── api/
│       │   └── api.js        # API client
│       ├── components/
│       │   └── BuyModal.jsx  # Components
│       └── pages/
│           ├── Home.jsx
│           ├── ProductList.jsx
│           ├── SizeChecker.jsx
│           └── AdminPanel.jsx
│
└── docs/                      # Documentation
```

## Development Setup

### Backend Setup

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

# Start development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend-react

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running Both

Open two terminals:

**Terminal 1 (Backend):**
```bash
cd backend-fastapi
source venv/Scripts/activate
uvicorn main:app --reload
```

**Terminal 2 (Frontend):**
```bash
cd frontend-react
npm run dev
```

## Code Organization

### Backend Architecture

```
main.py
├── App Configuration
│   ├── CORS setup
│   └── Static file serving
├── Route Handlers
│   ├── GET /products
│   ├── GET /products/{id}
│   ├── POST /admin/add-product
│   ├── POST /measure
│   ├── POST /compare
│   └── POST /analyze
└── Helper Functions

models/schemas.py
├── Product
├── UserMeasurement
├── FitStatus
├── FitReport
├── CompareRequest
└── AnalyzeResponse

services/measurement_service.py
├── __init__
├── extract_measurements
├── _calculate_distance
├── _pixels_to_inches
└── generate_fit_report
```

### Frontend Architecture

```
App.jsx
├── BrowserRouter
└── Routes
    ├── / → Home
    ├── /products → ProductList
    ├── /size-checker → SizeChecker
    └── /admin → AdminPanel

api/api.js
├── getProducts()
├── getProduct(id)
├── addProduct()
├── measureImage()
├── compareSize()
└── analyzeImage()
```

## Adding Features

### Adding a New API Endpoint

1. **Define schema** in `models/schemas.py`:
```python
class NewRequest(BaseModel):
    field1: str
    field2: int
```

2. **Add route** in `main.py`:
```python
@app.post("/new-endpoint")
async def new_endpoint(request: NewRequest):
    # Implementation
    return {"status": "success"}
```

3. **Add API call** in `api/api.js`:
```javascript
export const newEndpoint = (data) => 
    axios.post(`${API_BASE}/new-endpoint`, data);
```

### Adding a New Page

1. **Create component** in `src/pages/NewPage.jsx`:
```jsx
function NewPage() {
  return (
    <div className="container mx-auto p-4">
      <h1>New Page</h1>
    </div>
  );
}

export default NewPage;
```

2. **Add route** in `App.jsx`:
```jsx
import NewPage from './pages/NewPage';

// In Routes
<Route path="/new-page" element={<NewPage />} />
```

### Adding a New Component

1. **Create component** in `src/components/MyComponent.jsx`:
```jsx
function MyComponent({ prop1, prop2 }) {
  return (
    <div className="...">
      {/* Content */}
    </div>
  );
}

export default MyComponent;
```

2. **Import and use**:
```jsx
import MyComponent from '../components/MyComponent';

// In render
<MyComponent prop1="value" prop2={data} />
```

## Testing

### Manual API Testing

Use the built-in Swagger UI at `http://localhost:8000/docs`

### cURL Examples

```bash
# Get all products
curl http://localhost:8000/products

# Analyze image
curl -X POST "http://localhost:8000/analyze?product_id=1" \
  -F "file=@test.jpg"

# Add product
curl -X POST "http://localhost:8000/admin/add-product?key=MYSECRET&name=Test&shoulder=17&chest=40&sleeve=25" \
  -F "image=@product.jpg"
```

### Frontend Testing

```bash
# Lint code
npm run lint

# Build for production (catches errors)
npm run build
```

## Debugging

### Backend Debugging

1. **Add logging**:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# In function
logger.debug(f"Variable value: {variable}")
```

2. **Use FastAPI debug mode**:
```bash
uvicorn main:app --reload --log-level debug
```

### Frontend Debugging

1. **Console logging**:
```javascript
console.log('State:', state);
console.log('Props:', props);
```

2. **React DevTools**:
   - Install browser extension
   - Inspect component state and props

## Environment Variables

### Backend

Create `.env` file:
```env
ADMIN_KEY=your-secret-key
DEBUG=true
```

Load in code:
```python
from dotenv import load_dotenv
import os

load_dotenv()
ADMIN_KEY = os.getenv("ADMIN_KEY", "MYSECRET")
```

### Frontend

Create `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

Use in code:
```javascript
const API_BASE = import.meta.env.VITE_API_URL;
```

## Code Style

### Python

- Use type hints
- Follow PEP 8
- Document functions with docstrings

```python
def calculate_fit(user: float, product: float) -> dict:
    """
    Calculate fit status based on measurement difference.
    
    Args:
        user: User's measurement in inches
        product: Product's measurement in inches
        
    Returns:
        Dictionary with difference, status, and description
    """
    diff = product - user
    # ...
```

### JavaScript

- Use functional components
- Destructure props
- Use meaningful variable names

```javascript
function ProductCard({ product, onBuy, onTry }) {
  const { id, name, image } = product;
  
  const handleBuyClick = () => {
    onBuy(product);
  };
  
  return (
    // ...
  );
}
```

## Building for Production

### Backend

```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend

```bash
# Build
npm run build

# Preview build
npm run preview

# Files output to dist/
```

## Common Development Tasks

### Reset Database

```bash
# Delete and recreate product_db.json
echo '{"products": []}' > product_db.json
```

### Clear Uploads

```bash
# Windows
del /Q uploads\*

# Unix
rm -f uploads/*
```

### Update Dependencies

```bash
# Backend
pip install --upgrade -r requirements.txt

# Frontend
npm update
```

---

Next: [Troubleshooting](../reference/TROUBLESHOOTING.md)
