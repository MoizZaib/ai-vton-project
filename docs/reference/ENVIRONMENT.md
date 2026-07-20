# 🌍 Environment Setup

## Overview

This document covers environment configuration for different deployment scenarios.

---

## Development Environment

### Backend (Python)

#### Virtual Environment Setup

**Windows (CMD):**
```cmd
cd backend-fastapi
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**Windows (Git Bash):**
```bash
cd backend-fastapi
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
```

**Linux/macOS:**
```bash
cd backend-fastapi
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Environment Variables

Create `.env` file in `backend-fastapi/`:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true

# Security
ADMIN_KEY=your-secret-admin-key

# File Storage
UPLOAD_DIR=uploads

# CORS Origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

Load in Python:
```python
from dotenv import load_dotenv
import os

load_dotenv()

ADMIN_KEY = os.getenv("ADMIN_KEY", "MYSECRET")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
```

---

### Frontend (Node.js)

#### Node.js Setup

**Using nvm (recommended):**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node 18
nvm install 18
nvm use 18
```

**Direct installation:**
- Download from https://nodejs.org/
- Use LTS version (18.x or 20.x)

#### Environment Variables

Create `.env` file in `frontend-react/`:

```env
# API Configuration
VITE_API_URL=http://localhost:8000

# Feature Flags
VITE_ENABLE_ANALYTICS=false
```

Use in code:
```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

---

## Production Environment

### Backend Production

#### Requirements

```
# requirements.txt for production
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
gunicorn>=21.2.0
mediapipe>=0.10.30
opencv-python>=4.9.0
numpy>=1.26.3
pillow>=10.2.0
python-multipart>=0.0.6
python-dotenv>=1.0.0
```

#### Gunicorn Configuration

Create `gunicorn.conf.py`:

```python
# Gunicorn configuration
bind = "0.0.0.0:8000"
workers = 4
worker_class = "uvicorn.workers.UvicornWorker"
timeout = 120
keepalive = 5
accesslog = "-"
errorlog = "-"
loglevel = "info"
```

Run:
```bash
gunicorn main:app -c gunicorn.conf.py
```

#### Systemd Service

Create `/etc/systemd/system/sizesuggestion.service`:

```ini
[Unit]
Description=AI Size Suggestion Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/ecom-vton/backend-fastapi
Environment="PATH=/var/www/ecom-vton/backend-fastapi/venv/bin"
ExecStart=/var/www/ecom-vton/backend-fastapi/venv/bin/gunicorn main:app -c gunicorn.conf.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl enable sizesuggestion
sudo systemctl start sizesuggestion
```

---

### Frontend Production

#### Build

```bash
cd frontend-react
npm run build
```

Output in `dist/` folder.

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name example.com;

    # Frontend
    location / {
        root /var/www/ecom-vton/frontend-react/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend uploads
    location /uploads/ {
        alias /var/www/ecom-vton/backend-fastapi/uploads/;
    }
}
```

---

## Docker Environment

### Dockerfile (Backend)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8000

# Run
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Dockerfile (Frontend)

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build: ./backend-fastapi
    ports:
      - "8000:8000"
    volumes:
      - uploads:/app/uploads
      - ./backend-fastapi/product_db.json:/app/product_db.json
    environment:
      - ADMIN_KEY=${ADMIN_KEY:-MYSECRET}
    restart: unless-stopped

  frontend:
    build: ./frontend-react
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  uploads:
```

Run:
```bash
docker-compose up -d
```

---

## Cloud Deployment

### AWS EC2

1. **Launch EC2 instance** (Ubuntu 22.04)
2. **Install dependencies:**
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv nodejs npm nginx
   ```
3. **Clone and setup project**
4. **Configure Nginx and systemd**
5. **Enable SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d example.com
   ```

### Heroku

**Backend (`Procfile`):**
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Frontend:**
Deploy with Heroku static buildpack or Vercel.

### Vercel (Frontend)

1. Connect GitHub repository
2. Set framework to Vite
3. Configure environment variables
4. Deploy

### Railway

1. Connect repository
2. Add backend service
3. Add frontend service
4. Configure environment variables

---

## Environment Checklist

### Development
- [ ] Python 3.9+ installed
- [ ] Node.js 18+ installed
- [ ] Virtual environment created
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Both servers running

### Production
- [ ] SSL certificate configured
- [ ] Environment variables set
- [ ] Firewall configured
- [ ] Backup strategy in place
- [ ] Monitoring setup
- [ ] Error logging configured

---

Back to: [Documentation Index](../README.md)
