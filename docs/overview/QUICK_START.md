# 🚀 Quick Start Guide

Get the AI Clothing Size Suggestion system running in under 5 minutes.

## Prerequisites

Ensure you have installed:

- **Python 3.9+**: [Download Python](https://www.python.org/downloads/)
- **Node.js 18+**: [Download Node.js](https://nodejs.org/)
- **Git**: [Download Git](https://git-scm.com/)

## Step 1: Clone/Navigate to Project

```bash
cd d:/code/ecom-vton
```

## Step 2: Start Backend

Open a terminal and run:

```bash
# Navigate to backend
cd backend-fastapi

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# Windows (Git Bash):
source venv/Scripts/activate
# Windows (CMD):
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```

✅ Backend running at: **http://localhost:8000**

## Step 3: Start Frontend

Open another terminal and run:

```bash
# Navigate to frontend
cd frontend-react

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

✅ Frontend running at: **http://localhost:3000**

## Step 4: Access the Application

| Page             | URL                                      | Description           |
| ---------------- | ---------------------------------------- | --------------------- |
| **Home**         | http://localhost:3000                    | Landing page          |
| **Products**     | http://localhost:3000/products           | Browse products       |
| **Size Checker** | http://localhost:3000/size-checker       | Check your size       |
| **Admin**        | http://localhost:3000/admin?key=MYSECRET | Manage products       |
| **API Docs**     | http://localhost:8000/docs               | Swagger documentation |

## Step 5: Test the System

### Test 1: Check Your Size

1. Go to **http://localhost:3000/products**
2. Click **"Try It"** on any product
3. Upload an upper-body photo
4. Click **"Analyze My Size"**
5. View your fit recommendation

### Test 2: Add a Product (Admin)

1. Go to **http://localhost:3000/admin?key=MYSECRET**
2. Fill in product details:
   - Name: "Test Shirt"
   - Shoulder: 17
   - Chest: 40
3. Upload a product image
4. Click **"Add Product"**

## Common Commands

### Backend

```bash
# Start server
uvicorn main:app --reload

# Start with specific host/port
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Quick Troubleshooting

### Backend won't start?

```bash
# Ensure virtual environment is activated
source venv/Scripts/activate  # Git Bash
# or
venv\Scripts\activate  # CMD
```

### MediaPipe error?

```bash
# Reinstall dependencies
pip install --upgrade mediapipe
```

### Frontend won't start?

```bash
# Clear node modules and reinstall
rm -rf node_modules
npm install
```

### CORS errors?

- Ensure backend is running on port 8000
- Ensure frontend is running on port 3000 or 5173

## What's Next?

- 📖 Read the [User Guide](../guides/USER_GUIDE.md)
- 🔧 Explore the [API Reference](../backend/API_REFERENCE.md)
- 🛠️ Check the [Development Guide](../guides/DEVELOPMENT_GUIDE.md)

---

Need help? Check the [Troubleshooting Guide](../reference/TROUBLESHOOTING.md)
