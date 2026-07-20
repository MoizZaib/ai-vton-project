# 🔧 Troubleshooting Guide

## Overview

This guide helps resolve common issues with the AI-Based Clothing Size Suggestion system.

---

## Installation Issues

### Issue: "mediapipe==0.10.9" Not Found

**Error:**
```
ERROR: Could not find a version that satisfies the requirement mediapipe==0.10.9
```

**Cause:** Specific MediaPipe version not available for your Python/platform.

**Solution:**
```bash
# Use flexible version
pip install mediapipe>=0.10.30
```

Or update `requirements.txt`:
```
mediapipe>=0.10.30
```

---

### Issue: Virtual Environment Activation Fails (Git Bash)

**Error:**
```
venv\Scripts\activate: command not found
```

**Cause:** Git Bash uses Unix-style paths.

**Solution:**
```bash
# Use source command with forward slashes
source venv/Scripts/activate
```

---

### Issue: "No module named 'cv2'"

**Error:**
```
ModuleNotFoundError: No module named 'cv2'
```

**Cause:** OpenCV not installed.

**Solution:**
```bash
pip install opencv-python
```

---

### Issue: npm install Fails

**Error:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
# Try with legacy peer deps
npm install --legacy-peer-deps

# Or clear cache and retry
npm cache clean --force
npm install
```

---

## Runtime Issues

### Issue: "Could not detect body pose in the image"

**Cause:** MediaPipe couldn't find pose landmarks.

**Solutions:**

1. **Check photo quality:**
   - Full body visible (head to hips minimum)
   - Clear, well-lit image
   - Person facing camera
   - Arms slightly away from body

2. **Try different photo:**
   - Stand straighter
   - Better lighting
   - Plain background

3. **Check file format:**
   - Use JPEG or PNG
   - Ensure file isn't corrupted

---

### Issue: CORS Error in Browser

**Error:**
```
Access to XMLHttpRequest at 'http://localhost:8000' has been blocked by CORS policy
```

**Cause:** Backend CORS not configured for frontend origin.

**Solution:**

Check `main.py` includes your frontend URL:
```python
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # Add your URL if different
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### Issue: "Invalid admin key"

**Error:**
```
{"detail": "Invalid admin key"}
```

**Cause:** Wrong or missing key in request.

**Solutions:**

1. **Check URL:**
   ```
   http://localhost:5173/admin?key=MYSECRET
   ```

2. **Verify key in code:**
   ```python
   # In main.py
   ADMIN_KEY = "MYSECRET"  # Case-sensitive
   ```

3. **Check for typos:**
   - Key is case-sensitive
   - No extra spaces
   - `?key=` not `&key=` for first parameter

---

### Issue: Images Not Loading

**Symptom:** Product images show as broken.

**Causes & Solutions:**

1. **Static files not served:**
   ```python
   # Ensure in main.py
   app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
   ```

2. **Uploads directory missing:**
   ```bash
   mkdir uploads
   ```

3. **Wrong image path:**
   - Check `product_db.json` has correct paths
   - Paths should be `uploads/filename.jpg`

---

### Issue: Backend Won't Start

**Error:**
```
ERROR: [Errno 10048] error while attempting to bind on address
```

**Cause:** Port 8000 already in use.

**Solutions:**

1. **Kill existing process:**
   ```bash
   # Windows
   netstat -ano | findstr :8000
   taskkill /PID <PID> /F
   
   # Unix
   lsof -i :8000
   kill -9 <PID>
   ```

2. **Use different port:**
   ```bash
   uvicorn main:app --reload --port 8001
   ```

---

### Issue: Frontend Won't Start

**Error:**
```
Error: Cannot find module 'react'
```

**Cause:** Dependencies not installed.

**Solution:**
```bash
cd frontend-react
rm -rf node_modules
npm install
```

---

## MediaPipe Issues

### Issue: Pose Detection Model Download Fails

**Error:**
```
urllib.error.URLError: <urlopen error [Errno 11001] getaddrinfo failed>
```

**Cause:** Network issue or firewall blocking download.

**Solutions:**

1. **Manual download:**
   - Download from: https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task
   - Save to `backend-fastapi/pose_landmarker_heavy.task`

2. **Check firewall:**
   - Allow Python to access internet
   - Try on different network

---

### Issue: "mp.solutions.pose has no attribute..."

**Error:**
```
AttributeError: module 'mediapipe.solutions' has no attribute 'pose'
```

**Cause:** Using old MediaPipe API with new version.

**Solution:** The code should use the new Tasks API:
```python
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# Not the old way:
# mp.solutions.pose  <- This is deprecated
```

Make sure `measurement_service.py` uses the new PoseLandmarker API.

---

## Database Issues

### Issue: "FileNotFoundError: product_db.json"

**Cause:** Database file doesn't exist.

**Solution:**
```bash
# Create with empty products array
echo '{"products": []}' > product_db.json
```

---

### Issue: JSON Parse Error

**Error:**
```
json.decoder.JSONDecodeError: Expecting value
```

**Cause:** Corrupted or empty JSON file.

**Solution:**
```bash
# Reset database
echo '{"products": []}' > product_db.json
```

---

## Performance Issues

### Issue: Slow Image Analysis

**Cause:** MediaPipe processing takes time on CPU.

**Solutions:**

1. **Use smaller images:**
   - Resize before upload
   - 1000x1000 max recommended

2. **Enable GPU (if available):**
   ```python
   # In measurement_service.py
   base_options = python.BaseOptions(
       model_asset_path=self.model_path,
       delegate=python.BaseOptions.Delegate.GPU
   )
   ```

3. **Use lighter model:**
   - Use `pose_landmarker_lite.task` instead of heavy

---

### Issue: High Memory Usage

**Cause:** MediaPipe model loaded multiple times.

**Solution:** Implement singleton pattern:
```python
class MeasurementService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
```

---

## Browser Issues

### Issue: File Upload Not Working

**Causes & Solutions:**

1. **File too large:**
   - Reduce image size
   - Check server limits

2. **Wrong file type:**
   - Use JPEG or PNG only
   - Check file extension

3. **JavaScript disabled:**
   - Enable JavaScript in browser

---

### Issue: Page Not Loading

**Cause:** JavaScript errors.

**Solutions:**

1. **Check console:**
   - Press F12 → Console tab
   - Look for red errors

2. **Clear cache:**
   - Ctrl+Shift+Delete
   - Clear cached files

3. **Try different browser:**
   - Chrome recommended
   - Firefox as alternative

---

## Getting Help

If issues persist:

1. **Check logs:**
   - Backend: Terminal output
   - Frontend: Browser console (F12)

2. **Verify versions:**
   ```bash
   python --version  # Should be 3.9+
   node --version    # Should be 18+
   npm --version     # Should be 9+
   ```

3. **Test API directly:**
   - Open http://localhost:8000/docs
   - Test endpoints in Swagger UI

4. **Review documentation:**
   - [Installation Guide](../overview/INSTALLATION.md)
   - [Development Guide](../guides/DEVELOPMENT_GUIDE.md)

---

Next: [FAQ](./FAQ.md)
