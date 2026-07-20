# 📚 AI-Based Clothing Size Suggestion - Documentation

Welcome to the complete documentation for the AI-Based Clothing Size Suggestion system. This documentation covers all aspects of the project including architecture, APIs, components, and usage guides.

## 📖 Table of Contents

### Getting Started

- [Project Overview](./overview/PROJECT_OVERVIEW.md)
- [Quick Start Guide](./overview/QUICK_START.md)
- [Installation Guide](./overview/INSTALLATION.md)

### Architecture

- [System Architecture](./architecture/SYSTEM_ARCHITECTURE.md)
- [Tech Stack](./architecture/TECH_STACK.md)
- [Data Flow](./architecture/DATA_FLOW.md)

### Backend Documentation

- [Backend Overview](./backend/README.md)
- [API Reference](./backend/API_REFERENCE.md)
- [Models & Schemas](./backend/MODELS.md)
- [Measurement Service](./backend/MEASUREMENT_SERVICE.md)

### Frontend Documentation

- [Frontend Overview](./frontend/README.md)
- [Components](./frontend/COMPONENTS.md)
- [Pages](./frontend/PAGES.md)
- [API Integration](./frontend/API_INTEGRATION.md)

### Component Details

- [BuyModal Component](./frontend/components/BuyModal.md)
- [Home Page](./frontend/pages/Home.md)
- [ProductList Page](./frontend/pages/ProductList.md)
- [SizeChecker Page](./frontend/pages/SizeChecker.md)
- [AdminPanel Page](./frontend/pages/AdminPanel.md)

### Guides

- [User Guide](./guides/USER_GUIDE.md)
- [Admin Guide](./guides/ADMIN_GUIDE.md)
- [Development Guide](./guides/DEVELOPMENT_GUIDE.md)

### Reference

- [Environment Variables](./reference/ENVIRONMENT.md)
- [Troubleshooting](./reference/TROUBLESHOOTING.md)
- [FAQ](./reference/FAQ.md)

---

## 🎯 Project Summary

This project provides an AI-powered clothing size recommendation system that:

- Analyzes user body measurements from uploaded photos
- Compares measurements against product specifications
- Provides fit recommendations (Tight/Normal/Loose)
- Enables purchase when fit is optimal

## 🏗️ Project Structure

```
ecom-vton/
├── backend-fastapi/          # Python FastAPI backend
│   ├── models/               # Pydantic schemas
│   ├── services/             # Business logic (MediaPipe)
│   ├── uploads/              # Uploaded images
│   ├── main.py               # API endpoints
│   └── requirements.txt      # Python dependencies
├── frontend-react/           # React Vite frontend
│   ├── src/
│   │   ├── api/              # API integration
│   │   ├── components/       # Reusable components
│   │   └── pages/            # Page components
│   └── package.json          # Node dependencies
├── docs/                     # This documentation
└── README.md                 # Project root README
```

## 🔗 Quick Links

| Resource           | URL                                      |
| ------------------ | ---------------------------------------- |
| Frontend           | http://localhost:3000                    |
| Backend API        | http://localhost:8000                    |
| API Docs (Swagger) | http://localhost:8000/docs               |
| Admin Panel        | http://localhost:3000/admin?key=MYSECRET |

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**License:** MIT
