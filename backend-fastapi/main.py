"""
AI-VTON: AI-Powered Virtual Try-On System
FastAPI Backend with MediaPipe + Machine Learning

FYP Project - Body Measurement Extraction & Size Recommendation
"""

import os
import json
import uuid
from typing import Optional, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile, Query, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from models.schemas import Product, ProductCreate, UserMeasurement, CompareRequest, FitReport
from services.measurement_service import MeasurementService

# Load environment variables
load_dotenv()

# Configuration from environment
class Config:
    """Application configuration from environment variables"""
    ADMIN_SECRET_KEY: str = os.getenv("ADMIN_SECRET_KEY", "fyp2024")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    CORS_ORIGINS: List[str] = os.getenv(
        "CORS_ORIGINS", 
        "http://localhost:5173,http://localhost:3000"
    ).split(",")
    UPLOAD_DIR: str = "uploads"
    DB_FILE: str = "product_db.json"

config = Config()

# Initialize measurement service (singleton)
measurement_service = MeasurementService()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup/shutdown events"""
    # Startup
    os.makedirs(config.UPLOAD_DIR, exist_ok=True)
    print(f"🚀 AI-VTON Backend starting on {config.HOST}:{config.PORT}")
    print(f"📁 Upload directory: {config.UPLOAD_DIR}")
    print(f"🔐 Admin authentication enabled")
    yield
    # Shutdown
    print("👋 AI-VTON Backend shutting down")


app = FastAPI(
    title="AI-VTON API",
    description="AI-Powered Virtual Try-On - Body Measurement & Size Recommendation",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/uploads", StaticFiles(directory=config.UPLOAD_DIR), name="uploads")


# ==================== Database Helpers ====================

def load_products() -> List[dict]:
    """Load products from JSON database"""
    if not os.path.exists(config.DB_FILE):
        return []
    try:
        with open(config.DB_FILE, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return []


def save_products(products: List[dict]) -> None:
    """Save products to JSON database"""
    with open(config.DB_FILE, "w") as f:
        json.dump(products, f, indent=2)


def get_next_id() -> int:
    """Get next available product ID"""
    products = load_products()
    return max((p.get("id", 0) for p in products), default=0) + 1


# ==================== Auth Helpers ====================

def verify_admin(key: str = Query(..., description="Admin secret key")) -> bool:
    """Verify admin authentication"""
    if key != config.ADMIN_SECRET_KEY:
        raise HTTPException(status_code=403, detail="Invalid admin key")
    return True


# ==================== Size Chart Constants ====================

SIZE_CHART = {
    "XS": {"shoulder": (14, 15), "chest": (34, 36), "sleeve": (22, 23), "length": (26, 27), "waist": (28, 30)},
    "S": {"shoulder": (15, 16), "chest": (36, 38), "sleeve": (23, 24), "length": (27, 28), "waist": (30, 32)},
    "M": {"shoulder": (16, 17), "chest": (38, 40), "sleeve": (24, 25), "length": (28, 29), "waist": (32, 34)},
    "L": {"shoulder": (17, 18), "chest": (40, 42), "sleeve": (25, 26), "length": (29, 30), "waist": (34, 36)},
    "XL": {"shoulder": (18, 19), "chest": (42, 44), "sleeve": (26, 27), "length": (30, 31), "waist": (36, 38)},
    "XXL": {"shoulder": (19, 20), "chest": (44, 46), "sleeve": (27, 28), "length": (31, 32), "waist": (38, 40)},
}

BODY_PARTS = {
    "shoulder": {"name": "Shoulder Width", "unit": "inches", "description": "Distance across the back from shoulder point to shoulder point"},
    "chest": {"name": "Chest/Bust", "unit": "inches", "description": "Circumference around the fullest part of the chest"},
    "sleeve": {"name": "Sleeve Length", "unit": "inches", "description": "From shoulder seam to wrist"},
    "length": {"name": "Garment Length", "unit": "inches", "description": "From highest point of shoulder to bottom hem"},
    "waist": {"name": "Waist", "unit": "inches", "description": "Circumference around the natural waistline"},
    "hip": {"name": "Hip", "unit": "inches", "description": "Circumference around the fullest part of hips"},
    "inseam": {"name": "Inseam", "unit": "inches", "description": "From crotch to ankle"},
    "neck": {"name": "Neck", "unit": "inches", "description": "Circumference around the base of neck"},
}


# ==================== API Endpoints ====================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": "AI-VTON",
        "version": "2.0.0",
        "description": "AI-Powered Virtual Try-On System"
    }


@app.get("/size-chart")
async def get_size_chart():
    """Get complete size chart with all body parts and measurements"""
    return {
        "size_chart": SIZE_CHART,
        "body_parts": BODY_PARTS,
        "sizes": list(SIZE_CHART.keys()),
        "note": "All measurements in inches. Ranges indicate min-max for each size."
    }


@app.get("/products", response_model=List[Product])
async def get_products():
    """Fetch all products"""
    return load_products()


@app.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: int):
    """Fetch a single product by ID"""
    products = load_products()
    product = next((p for p in products if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.get("/products/filter/search")
async def filter_products(
    search: Optional[str] = Query(None, description="Search query for product name"),
    size: Optional[str] = Query(None, description="Size filter: xs, small, medium, large, xl, all")
):
    """Filter products by search query and size - server side filtering"""
    products = load_products()
    result = products
    
    # Search filter
    if search:
        search_lower = search.lower()
        result = [p for p in result if search_lower in p["name"].lower()]
    
    # Size filter based on shoulder width
    if size and size != "all":
        size_ranges = {
            "xs": (0, 15),
            "small": (15, 16),
            "medium": (16, 18),
            "large": (18, 19),
            "xl": (19, float('inf'))
        }
        if size in size_ranges:
            min_s, max_s = size_ranges[size]
            result = [p for p in result if min_s < p.get("shoulder", 0) <= max_s]
    
    return result


# ==================== Admin Endpoints ====================

@app.post("/admin/add-product", response_model=Product)
async def add_product(
    key: str = Query(..., description="Admin secret key"),
    name: str = Query(..., description="Product name"),
    shoulder: float = Query(..., description="Shoulder width in inches"),
    chest: float = Query(..., description="Chest width in inches"),
    sleeve: Optional[float] = Query(None, description="Sleeve length in inches"),
    length: Optional[float] = Query(None, description="Garment length in inches"),
    image: Optional[UploadFile] = File(None)
):
    """Add a new product (Admin only)"""
    verify_admin(key)
    
    products = load_products()
    
    # Handle image upload
    image_path = None
    if image and image.filename:
        ext = os.path.splitext(image.filename)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        filename = f"{uuid.uuid4()}{ext}"
        image_path = f"uploads/{filename}"
        
        with open(os.path.join(config.UPLOAD_DIR, filename), "wb") as f:
            content = await image.read()
            f.write(content)
    
    # Create new product
    new_product = {
        "id": get_next_id(),
        "name": name,
        "shoulder": shoulder,
        "chest": chest,
        "sleeve": sleeve,
        "length": length,
        "image": image_path
    }
    
    products.append(new_product)
    save_products(products)
    
    return new_product


@app.delete("/admin/delete-product/{product_id}")
async def delete_product(
    product_id: int,
    key: str = Query(..., description="Admin secret key")
):
    """Delete a product (Admin only)"""
    verify_admin(key)
    
    products = load_products()
    product = next((p for p in products if p["id"] == product_id), None)
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Delete image if exists
    if product.get("image"):
        image_file = product["image"].replace("uploads/", "")
        image_path = os.path.join(config.UPLOAD_DIR, image_file)
        if os.path.exists(image_path):
            os.remove(image_path)
    
    products = [p for p in products if p["id"] != product_id]
    save_products(products)
    
    return {"message": f"Product {product_id} deleted successfully"}


# ==================== Measurement Endpoints ====================

@app.post("/measure")
async def measure_body(image: UploadFile = File(...)):
    """Extract body measurements from uploaded image"""
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
    
    try:
        contents = await image.read()
        result = measurement_service.get_measurements_from_image(contents)
        
        if not result.get("success"):
            return JSONResponse(
                status_code=400,
                content={"success": False, "error": result.get("error", "Measurement failed")}
            )
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/compare")
async def compare_sizes(request: CompareRequest):
    """Compare user measurements with product measurements"""
    products = load_products()
    product = next((p for p in products if p["id"] == request.product_id), None)
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Calculate fit for each measurement
    measurements = request.user_measurements
    fit_report = {}
    
    for key in ["shoulder", "chest", "sleeve", "length"]:
        user_val = getattr(measurements, key, None)
        prod_val = product.get(key)
        
        if user_val is not None and prod_val is not None:
            diff = user_val - prod_val
            if diff > 1.5:
                status = "Tight"
            elif diff < -1.5:
                status = "Loose"
            else:
                status = "Normal"
            
            fit_report[f"{key}_fit"] = {
                "user": user_val,
                "product": prod_val,
                "difference": round(diff, 1),
                "status": status
            }
    
    # Overall recommendation
    statuses = [v["status"] for v in fit_report.values()]
    if "Tight" in statuses:
        overall = "Too Tight - Consider larger size"
        recommendation = "This item may be too small. We recommend going up one size."
    elif statuses.count("Loose") > len(statuses) / 2:
        overall = "Too Loose - Consider smaller size"
        recommendation = "This item may be too large. You might prefer a smaller size."
    else:
        overall = "Good Fit!"
        recommendation = "This size should fit you well based on your measurements."
    
    fit_report["overall"] = overall
    fit_report["recommendation"] = recommendation
    
    return {
        "product": product,
        "user_measurements": measurements.model_dump(),
        "fit_report": fit_report
    }


@app.post("/analyze")
async def analyze_and_compare(
    product_id: int = Query(..., description="Product ID to compare against"),
    user_height: Optional[int] = Query(None, description="User height in inches for calibration"),
    image: UploadFile = File(...)
):
    """Analyze image and compare with product in one step"""
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Get product
    products = load_products()
    product = next((p for p in products if p["id"] == product_id), None)
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    try:
        contents = await image.read()
        result = measurement_service.get_measurements_from_image(contents, user_height)
        
        if not result.get("success"):
            return result
        
        # Compare with product
        user_measurements = result.get("measurements", {})
        fit_report = {}
        
        for key in ["shoulder", "chest", "sleeve", "length"]:
            user_val = user_measurements.get(key)
            prod_val = product.get(key)
            
            if user_val is not None and prod_val is not None:
                diff = user_val - prod_val
                if diff > 1.5:
                    status = "Tight"
                elif diff < -1.5:
                    status = "Loose"
                else:
                    status = "Normal"
                
                fit_report[f"{key}_fit"] = {
                    "user": user_val,
                    "product": prod_val,
                    "difference": round(diff, 1),
                    "status": status
                }
        
        # Overall recommendation
        statuses = [v["status"] for v in fit_report.values()]
        if "Tight" in statuses:
            overall = "Too Tight - Consider larger size"
            recommendation = "This item may be too small. We recommend going up one size."
        elif statuses.count("Loose") > len(statuses) / 2:
            overall = "Too Loose - Consider smaller size"  
            recommendation = "This item may be too large. You might prefer a smaller size."
        else:
            overall = "Good Fit!"
            recommendation = "This size should fit you well based on your measurements."
        
        fit_report["overall"] = overall
        fit_report["recommendation"] = recommendation
        
        return {
            "success": True,
            "user_measurements": user_measurements,
            "product_measurements": {
                "shoulder": product.get("shoulder"),
                "chest": product.get("chest"),
                "sleeve": product.get("sleeve"),
                "length": product.get("length")
            },
            "fit_report": fit_report,
            "confidence": result.get("confidence", 85),
            "calibration": result.get("calibration", "face")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== Run Server ====================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=config.HOST,
        port=config.PORT,
        reload=config.DEBUG
    )
