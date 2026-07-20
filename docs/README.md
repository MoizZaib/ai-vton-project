AI-VTON: AI-Powered Virtual Try-On & Clothing Size Recommendation
An AI-powered Final Year Design Project that estimates body measurements using MediaPipe, recommends suitable clothing sizes, and provides a virtual try-on experience for e-commerce applications.

🎥 Project Demo
📹 Demo Video: https://streamable.com/gxrmw7

The demo showcases the complete workflow, including product browsing, AI body measurement, clothing size recommendation, virtual try-on, and the admin panel.

🎯 Features
Admin Panel: Upload products with size details (shoulder, chest, sleeve, neck, length)
User Panel: Browse products and check size compatibility
AI Measurement: Upload upper-body photo to extract body measurements using MediaPipe
Size Comparison: Get detailed fit recommendations (Tight/Normal/Loose)
🛠️ Tech Stack
Frontend
React (Vite)
Tailwind CSS
Axios
React Router
Backend
Python FastAPI
MediaPipe (body pose detection)
OpenCV (image processing)
Pydantic (data validation)
Storage
Local JSON file (product_db.json)
📁 Project Structure
ai-vton-project/
├── backend-fastapi/
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── measurement_service.py
│   ├── uploads/
│   ├── main.py
│   ├── product_db.json
│   └── requirements.txt
├── frontend-react/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── SizeChecker.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
🚀 Installation & Setup
Prerequisites
Python 3.9+
Node.js 18+
pip (Python package manager)
npm (Node package manager)
Backend Setup
Navigate to backend directory:
cd backend-fastapi
Create a virtual environment (recommended):
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
Install dependencies:
pip install -r requirements.txt
Create uploads directory:
mkdir uploads
Start the backend server:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
The API will be available at: http://localhost:8000 API docs at: http://localhost:8000/docs

Frontend Setup
Navigate to frontend directory:
cd frontend-react
Install dependencies:
npm install
Start the development server:
npm run dev
The frontend will be available at: http://localhost:3000

📱 Usage
User Flow
Browse Products: Go to /products to see available clothing items
Check Size: Click "Check My Size" on any product
Upload Photo: Upload a clear upper-body photo facing the camera
Get Results: View your measurements and fit recommendations
Admin Access
Access the admin panel at:

http://localhost:3000/admin?key=MYSECRET
Admin capabilities:

Add new products with measurements
Upload product images
Delete existing products
🔌 API Endpoints
Method	Endpoint	Description
GET	/	Health check
GET	/products	Get all products
GET	/products/{id}	Get single product
POST	/admin/add-product?key=MYSECRET	Add new product
DELETE	/admin/delete-product/{id}?key=MYSECRET	Delete product
POST	/measure	Extract measurements from image
POST	/compare	Compare user vs product measurements
POST	/analyze?product_id={id}	Combined measure + compare
📊 Size Comparison Logic
The system compares user measurements with product measurements:

Difference	Status
> +2 inches	Loose
-2 to +2 inches	Normal (Good Fit)
< -2 inches	Tight
🤖 AI Measurement Extraction
The system uses MediaPipe Pose to detect body landmarks:

Shoulder Width: Distance between left and right shoulder landmarks
Chest: Estimated from shoulder width (multiplier-based)
Sleeve Length: Shoulder → Elbow → Wrist distance
Torso Length: Shoulder to hip distance
Neck: Estimated from face width
Scaling Reference: Face width (~6 inches) is used to convert pixel measurements to inches.

📝 Sample API Response
{
  "user_measurements": {
    "shoulder": 17.2,
    "chest": 38.5,
    "sleeve": 24.0,
    "length": 26.5
  },
  "product_measurements": {
    "shoulder": 16,
    "chest": 40,
    "sleeve": 25,
    "length": 28
  },
  "fit_report": {
    "shoulder_fit": {
      "difference": -1.2,
      "status": "Normal",
      "description": "Good fit (-1.2 inches snug)"
    },
    "chest_fit": {
      "difference": 1.5,
      "status": "Normal",
      "description": "Good fit (+1.5 inches room)"
    },
    "overall": "Good Fit",
    "recommendation": "Recommended: Normal Fit"
  }
}
📸 Photo Guidelines
For best measurement accuracy:

Use a clear, well-lit photo
Face the camera directly
Stand straight with arms slightly away from body
Wear fitted clothing (not baggy)
Include full upper body (head to hips)
🔮 Future Upgrades
This codebase is designed to be modular for future enhancements:

 User authentication system
 Cloud storage (AWS S3, Cloudinary)
 Full VTON model integration (CP-VTON / TryOnDiffusion)
 Database migration (PostgreSQL/MongoDB)
 Improved measurement accuracy with depth sensors
 Multiple size recommendations (S, M, L, XL)
 Mobile app version
🐛 Troubleshooting
Common Issues
MediaPipe installation fails

pip install mediapipe --upgrade
CORS errors

Ensure backend is running on port 8000
Check that frontend is on port 3000 or 5173
Image upload fails

Check that /uploads directory exists
Verify file permissions
No pose detected

Use a clearer photo
Ensure good lighting
Face the camera directly
👥 Team
This project was developed as a Final Year Design Project (FYDP) at Dawood University of Engineering & Technology, Karachi, under the supervision of Mr. Irfan Ahmed.

Team Members
Muhammad Anas
Faraz Ahmed
Moiz Zaib
Hassaan Qaisar
Daniyal Ahmed
👨‍💻 My Contribution
My primary responsibility in this project was backend development. My contributions included:

Developed RESTful APIs using FastAPI
Implemented clothing size comparison and fit recommendation logic
Integrated MediaPipe Pose for AI-based body measurement estimation
Used OpenCV for image processing and measurement extraction
Assisted with frontend-backend integration
Tested, debugged, and improved backend functionality
📄 License
This repository is shared for educational and portfolio purposes only.

Built with ❤️ using Python, FastAPI, React, MediaPipe, and OpenCV.
