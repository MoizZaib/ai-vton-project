"""
Pydantic models for request/response validation
"""

from pydantic import BaseModel
from typing import Optional, Dict


class ProductCreate(BaseModel):
    """Schema for creating a new product"""
    name: str
    shoulder: float
    chest: float
    sleeve: Optional[float] = None
    neck: Optional[float] = None
    length: Optional[float] = None


class Product(BaseModel):
    """Schema for product response"""
    id: int
    name: str
    shoulder: float
    chest: float
    sleeve: Optional[float] = None
    neck: Optional[float] = None
    length: Optional[float] = None
    image: str


class UserMeasurement(BaseModel):
    """Schema for user body measurements"""
    shoulder: float
    chest: float
    sleeve: Optional[float] = None
    neck: Optional[float] = None
    length: Optional[float] = None
    confidence: float = 0.0
    message: Optional[str] = None


class CompareRequest(BaseModel):
    """Schema for comparison request"""
    product_id: int
    user_measurements: Dict[str, Optional[float]]


class FitDetail(BaseModel):
    """Details about fit for a specific measurement"""
    difference: float
    status: str  # Tight, Normal, Loose
    description: str


class FitReport(BaseModel):
    """Complete fit report comparing user to product"""
    shoulder_fit: Optional[FitDetail] = None
    chest_fit: Optional[FitDetail] = None
    sleeve_fit: Optional[FitDetail] = None
    neck_fit: Optional[FitDetail] = None
    length_fit: Optional[FitDetail] = None
    overall: str
    recommendation: str


class AnalysisResponse(BaseModel):
    """Combined analysis response"""
    user_measurements: Dict[str, Optional[float]]
    product_measurements: Dict[str, Optional[float]]
    fit_report: FitReport
