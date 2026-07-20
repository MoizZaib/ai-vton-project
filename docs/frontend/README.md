# 🎨 Frontend Documentation

## Overview

The frontend is built with **React 18** and **Vite**, providing a modern, fast user interface for the AI-Based Clothing Size Suggestion system.

## Directory Structure

```
frontend-react/
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Main app with routing
    ├── index.css           # Global styles (Tailwind)
    ├── api/
    │   └── api.js          # Axios API client
    ├── components/
    │   └── BuyModal.jsx    # Purchase modal component
    └── pages/
        ├── Home.jsx        # Landing page
        ├── ProductList.jsx # Product catalog
        ├── SizeChecker.jsx # AI size analysis
        └── AdminPanel.jsx  # Product management
```

## Quick Start

```bash
# Navigate to frontend
cd frontend-react

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# http://localhost:5173
```

## Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| Vite | 5.0.12 | Build tool |
| React Router | 6.21.2 | Client routing |
| Tailwind CSS | 3.4.1 | Styling |
| Axios | 1.6.5 | HTTP client |

## Application Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Landing page with features |
| `/products` | ProductList | Browse product catalog |
| `/size-checker` | SizeChecker | AI body measurement |
| `/admin` | AdminPanel | Product management |

## Key Features

### 🏠 Home Page
- Feature highlights
- Navigation to main sections
- Call-to-action buttons

### 📦 Product List
- Grid layout of products
- Product images from backend
- "Buy Now" and "Try It" buttons
- Purchase modal integration

### 📏 Size Checker
- Photo upload interface
- Product selection
- Real-time AI analysis
- Fit recommendations
- Purchase encouragement for good fits

### 🔐 Admin Panel
- Key-based authentication
- Add new products
- Form with all measurements
- Image upload

## Documentation Files

- [Components](./COMPONENTS.md) - Reusable component documentation
- [Pages](./PAGES.md) - Page component documentation
- [BuyModal](./components/BuyModal.md) - Purchase modal details

## State Management

Uses React's built-in hooks:
- `useState` for local state
- `useEffect` for side effects
- No external state library needed

## Styling Approach

**Tailwind CSS** utility classes for:
- Responsive design
- Consistent spacing
- Color system
- Hover/focus states

Example:
```jsx
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  Click me
</button>
```

## API Integration

Centralized in `src/api/api.js`:
```javascript
import axios from "axios";

const API_BASE = "http://localhost:8000";

export const getProducts = () => axios.get(`${API_BASE}/products`);
export const analyzeImage = (formData, productId) => 
  axios.post(`${API_BASE}/analyze?product_id=${productId}`, formData);
```

## Build Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

Next: [Components](./COMPONENTS.md)
