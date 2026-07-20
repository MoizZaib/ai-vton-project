# 🛠️ Tech Stack

## Overview

This project uses a modern, production-ready tech stack optimized for AI-powered web applications.

## Frontend Stack

### Core Framework

| Technology       | Version | Purpose                                            |
| ---------------- | ------- | -------------------------------------------------- |
| **React**        | 18.2.0  | UI library for building component-based interfaces |
| **Vite**         | 5.0.12  | Next-generation frontend build tool                |
| **React Router** | 6.21.2  | Client-side routing                                |

### Styling

| Technology       | Version | Purpose                     |
| ---------------- | ------- | --------------------------- |
| **Tailwind CSS** | 3.4.1   | Utility-first CSS framework |
| **PostCSS**      | 8.4.33  | CSS transformation tool     |
| **Autoprefixer** | 10.4.17 | Automatic vendor prefixes   |

### HTTP Client

| Technology | Version | Purpose                   |
| ---------- | ------- | ------------------------- |
| **Axios**  | 1.6.5   | Promise-based HTTP client |

### Why These Choices?

#### React + Vite

- **Fast Development**: Vite provides instant HMR (Hot Module Replacement)
- **Optimized Builds**: Tree-shaking and code splitting out of the box
- **Modern Standards**: ES modules and native browser features
- **React 18**: Concurrent features and improved performance

#### Tailwind CSS

- **Rapid Prototyping**: Style directly in JSX
- **Consistent Design**: Built-in design system
- **Small Bundle**: PurgeCSS removes unused styles
- **Responsive**: Mobile-first utilities

## Backend Stack

### Core Framework

| Technology   | Version  | Purpose                                 |
| ------------ | -------- | --------------------------------------- |
| **FastAPI**  | 0.109.0+ | Modern, fast Python web framework       |
| **Uvicorn**  | 0.27.0+  | ASGI server for production              |
| **Pydantic** | 2.5.3+   | Data validation using Python type hints |

### AI/ML Libraries

| Technology    | Version  | Purpose                                 |
| ------------- | -------- | --------------------------------------- |
| **MediaPipe** | 0.10.30+ | Google's ML solution for pose detection |
| **OpenCV**    | 4.9.0+   | Computer vision and image processing    |
| **NumPy**     | 1.26.3+  | Numerical computing                     |
| **Pillow**    | 10.2.0+  | Image manipulation                      |

### Why These Choices?

#### FastAPI

- **Performance**: One of the fastest Python frameworks
- **Automatic Docs**: Swagger UI and ReDoc out of the box
- **Type Safety**: Pydantic integration for validation
- **Async Support**: Native async/await support
- **Standards**: OpenAPI and JSON Schema compliant

#### MediaPipe

- **Accuracy**: State-of-the-art pose detection
- **Speed**: Optimized for real-time processing
- **Cross-Platform**: Works on CPU and GPU
- **Google-Backed**: Active development and support

## Data Storage

### Current Implementation

| Storage             | Type        | Purpose                 |
| ------------------- | ----------- | ----------------------- |
| **product_db.json** | JSON File   | Product catalog storage |
| **uploads/**        | File System | Image storage           |

### Future Migration Options

| Storage    | Use Case                              |
| ---------- | ------------------------------------- |
| PostgreSQL | Relational data with complex queries  |
| MongoDB    | Document storage for flexible schemas |
| Redis      | Caching and session management        |
| AWS S3     | Cloud image storage                   |

## Development Tools

### Package Managers

| Tool     | Purpose                     |
| -------- | --------------------------- |
| **pip**  | Python package management   |
| **npm**  | Node.js package management  |
| **venv** | Python virtual environments |

### Code Quality

| Tool         | Purpose                      |
| ------------ | ---------------------------- |
| **ESLint**   | JavaScript linting           |
| **Prettier** | Code formatting              |
| **Black**    | Python formatting (optional) |

## Architecture Patterns

### Frontend

- **Component-Based**: Reusable UI components
- **Page Routing**: URL-based navigation
- **API Layer**: Centralized API calls
- **State Management**: React hooks (useState, useEffect)

### Backend

- **Service Layer**: Business logic separation
- **Schema Validation**: Pydantic models
- **Dependency Injection**: FastAPI dependencies
- **RESTful Design**: Resource-based endpoints

## Performance Characteristics

### Frontend

| Metric         | Value            |
| -------------- | ---------------- |
| Initial Bundle | ~200KB (gzipped) |
| HMR Speed      | <100ms           |
| Build Time     | <10 seconds      |

### Backend

| Metric          | Value               |
| --------------- | ------------------- |
| Request Latency | <50ms (without ML)  |
| ML Processing   | 2-5 seconds         |
| Memory Usage    | ~500MB (with model) |

## Compatibility Matrix

### Browser Support

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | 90+             |
| Firefox | 88+             |
| Safari  | 14+             |
| Edge    | 90+             |

### Python Support

| Version | Status       |
| ------- | ------------ |
| 3.9     | ✅ Supported |
| 3.10    | ✅ Supported |
| 3.11    | ✅ Supported |
| 3.12    | ✅ Supported |
| 3.13    | ✅ Supported |

### Node.js Support

| Version | Status       |
| ------- | ------------ |
| 18.x    | ✅ Supported |
| 20.x    | ✅ Supported |
| 22.x    | ✅ Supported |

## Dependency Graph

```
Frontend:
react
├── react-dom
├── react-router-dom
└── axios

Development:
vite
├── @vitejs/plugin-react
├── tailwindcss
├── postcss
└── autoprefixer

Backend:
fastapi
├── starlette
├── pydantic
└── uvicorn

ML Pipeline:
mediapipe
├── opencv-python
├── numpy
└── pillow
```

## Security Libraries

| Library              | Purpose                 |
| -------------------- | ----------------------- |
| **python-multipart** | Secure file uploads     |
| **CORS Middleware**  | Cross-origin protection |

## Future Technology Considerations

### Potential Additions

| Technology    | Purpose                   |
| ------------- | ------------------------- |
| TypeScript    | Type safety for frontend  |
| Redux/Zustand | Complex state management  |
| TensorFlow.js | Client-side ML            |
| WebGL         | GPU-accelerated rendering |
| WebRTC        | Real-time video capture   |
| Docker        | Containerization          |
| Kubernetes    | Orchestration             |

---

Next: [Data Flow](./DATA_FLOW.md)
