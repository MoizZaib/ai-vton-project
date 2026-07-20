# 📦 Installation Guide

Complete installation guide for the AI-Based Clothing Size Suggestion system.

## System Requirements

### Hardware Requirements

| Requirement | Minimum      | Recommended            |
| ----------- | ------------ | ---------------------- |
| RAM         | 4 GB         | 8 GB                   |
| Storage     | 500 MB       | 1 GB                   |
| CPU         | Dual Core    | Quad Core              |
| GPU         | Not required | NVIDIA (for faster ML) |

### Software Requirements

| Software | Minimum Version | Download Link                                   |
| -------- | --------------- | ----------------------------------------------- |
| Python   | 3.9             | [python.org](https://www.python.org/downloads/) |
| Node.js  | 18.0            | [nodejs.org](https://nodejs.org/)               |
| Git      | 2.0             | [git-scm.com](https://git-scm.com/)             |
| pip      | 21.0            | Included with Python                            |
| npm      | 9.0             | Included with Node.js                           |

## Installation Steps

### Step 1: Verify Prerequisites

```bash
# Check Python version
python --version  # Should be 3.9+

# Check Node.js version
node --version  # Should be 18+

# Check npm version
npm --version  # Should be 9+

# Check Git version
git --version  # Should be 2+
```

### Step 2: Get the Project

If you have the project files, navigate to the directory:

```bash
cd d:/code/ecom-vton
```

Or clone from repository (if available):

```bash
git clone <repository-url>
cd ecom-vton
```

### Step 3: Backend Installation

```bash
# Navigate to backend directory
cd backend-fastapi

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows (Git Bash):
source venv/Scripts/activate
# Windows (Command Prompt):
venv\Scripts\activate.bat
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Create uploads directory
mkdir -p uploads

# Verify installation
python -c "import fastapi; import mediapipe; print('Backend dependencies OK')"
```

### Step 4: Frontend Installation

```bash
# Navigate to frontend directory
cd ../frontend-react

# Install Node.js dependencies
npm install

# Verify installation
npm list react  # Should show react@18.x.x
```

### Step 5: Verify Installation

**Start Backend:**

```bash
cd backend-fastapi
source venv/Scripts/activate  # or appropriate activation command
uvicorn main:app --reload
```

**Start Frontend (new terminal):**

```bash
cd frontend-react
npm run dev
```

**Verify:**

- Backend: Open http://localhost:8000/docs - should show Swagger UI
- Frontend: Open http://localhost:3000 - should show home page

## Dependencies

### Backend Dependencies (requirements.txt)

```
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
python-multipart>=0.0.6
mediapipe>=0.10.30
opencv-python>=4.9.0.80
numpy>=1.26.3
pydantic>=2.5.3
pillow>=10.2.0
```

### Frontend Dependencies (package.json)

```json
{
  "dependencies": {
    "axios": "^1.6.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "vite": "^5.0.12"
  }
}
```

## Configuration

### Backend Configuration

Located in `backend-fastapi/main.py`:

```python
# CORS origins (allowed frontend URLs)
allow_origins=["http://localhost:3000", "http://localhost:5173"]

# Admin secret key
ADMIN_SECRET = "MYSECRET"

# Upload directory
UPLOAD_DIR = "uploads"
```

### Frontend Configuration

Located in `frontend-react/src/api/api.js`:

```javascript
// Backend API URL
const API_BASE_URL = 'http://localhost:8000'
```

## Post-Installation

### Download MediaPipe Model

The model downloads automatically on first run, but you can pre-download:

```bash
cd backend-fastapi/models
# Model will be downloaded automatically when server starts
```

### Add Sample Products

Access admin panel to add products:

```
http://localhost:3000/admin?key=MYSECRET
```

Or use the pre-loaded sample products in `product_db.json`.

## Platform-Specific Notes

### Windows

- Use Git Bash for Unix-like commands
- Or use Command Prompt with `venv\Scripts\activate`
- Ensure Python is in PATH

### macOS

- Install Xcode Command Line Tools: `xcode-select --install`
- May need Homebrew for some dependencies

### Linux (Ubuntu/Debian)

```bash
# Install Python
sudo apt update
sudo apt install python3 python3-pip python3-venv

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs
```

## Updating

### Update Backend

```bash
cd backend-fastapi
source venv/Scripts/activate
pip install -r requirements.txt --upgrade
```

### Update Frontend

```bash
cd frontend-react
npm update
```

## Uninstallation

```bash
# Remove virtual environments
rm -rf backend-fastapi/venv
rm -rf frontend-react/node_modules

# Remove uploaded files
rm -rf backend-fastapi/uploads/*

# Remove entire project
cd ..
rm -rf ecom-vton
```

---

Next: [System Architecture](../architecture/SYSTEM_ARCHITECTURE.md)
