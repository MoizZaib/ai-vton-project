# 📋 Models & Schemas

## Overview

This document describes the Pydantic models used for data validation and serialization in the backend.

## File Location

```
backend-fastapi/models/schemas.py
```

---

## Product Model

### Schema Definition

```python
class Product(BaseModel):
    id: int
    name: str
    shoulder: float
    chest: float
    sleeve: float
    neck: Optional[float] = None
    length: Optional[float] = None
    image: Optional[str] = None
```

### Fields

| Field      | Type  | Required | Description                   |
| ---------- | ----- | -------- | ----------------------------- |
| `id`       | int   | Yes      | Unique product identifier     |
| `name`     | str   | Yes      | Product display name          |
| `shoulder` | float | Yes      | Shoulder width in inches      |
| `chest`    | float | Yes      | Chest circumference in inches |
| `sleeve`   | float | Yes      | Sleeve length in inches       |
| `neck`     | float | No       | Neck circumference in inches  |
| `length`   | float | No       | Body length in inches         |
| `image`    | str   | No       | Path to product image         |

### Example

```json
{
  "id": 1,
  "name": "Classic White Shirt",
  "shoulder": 17,
  "chest": 40,
  "sleeve": 25,
  "neck": 15.5,
  "length": 28,
  "image": "uploads/shirt1.jpg"
}
```

---

## UserMeasurement Model

### Schema Definition

```python
class UserMeasurement(BaseModel):
    shoulder: float
    chest: float
    sleeve: float
    neck: Optional[float] = None
    length: Optional[float] = None
    confidence: Optional[float] = None
    message: Optional[str] = None
```

### Fields

| Field        | Type  | Required | Description                          |
| ------------ | ----- | -------- | ------------------------------------ |
| `shoulder`   | float | Yes      | Measured shoulder width in inches    |
| `chest`      | float | Yes      | Measured chest size in inches        |
| `sleeve`     | float | Yes      | Measured sleeve/arm length in inches |
| `neck`       | float | No       | Measured neck size in inches         |
| `length`     | float | No       | Measured torso length in inches      |
| `confidence` | float | No       | Detection confidence (0-100%)        |
| `message`    | str   | No       | Status message                       |

### Example

```json
{
  "shoulder": 17.2,
  "chest": 38.5,
  "sleeve": 24.0,
  "neck": 15.0,
  "length": 26.5,
  "confidence": 80.0,
  "message": "Measurements extracted with 80.0% confidence"
}
```

---

## FitStatus Model

### Schema Definition

```python
class FitStatus(BaseModel):
    difference: float
    status: str  # "Normal", "Tight", "Loose"
    description: str
```

### Fields

| Field         | Type  | Description                                  |
| ------------- | ----- | -------------------------------------------- |
| `difference`  | float | Difference between user and product (inches) |
| `status`      | str   | Fit classification                           |
| `description` | str   | Human-readable fit description               |

### Status Values

| Status   | Condition     | Description                     |
| -------- | ------------- | ------------------------------- |
| `Normal` | -2 ≤ diff ≤ 2 | Good, comfortable fit           |
| `Tight`  | diff < -2     | Too small, may be uncomfortable |
| `Loose`  | diff > 2      | Too large, may not fit well     |

### Example

```json
{
  "difference": -1.2,
  "status": "Normal",
  "description": "Good fit (-1.2 inches snug)"
}
```

---

## FitReport Model

### Schema Definition

```python
class FitReport(BaseModel):
    shoulder_fit: FitStatus
    chest_fit: FitStatus
    sleeve_fit: FitStatus
    neck_fit: Optional[FitStatus] = None
    length_fit: Optional[FitStatus] = None
    overall: str
    recommendation: str
```

### Fields

| Field            | Type      | Required | Description           |
| ---------------- | --------- | -------- | --------------------- |
| `shoulder_fit`   | FitStatus | Yes      | Shoulder fit analysis |
| `chest_fit`      | FitStatus | Yes      | Chest fit analysis    |
| `sleeve_fit`     | FitStatus | Yes      | Sleeve fit analysis   |
| `neck_fit`       | FitStatus | No       | Neck fit analysis     |
| `length_fit`     | FitStatus | No       | Length fit analysis   |
| `overall`        | str       | Yes      | Overall fit summary   |
| `recommendation` | str       | Yes      | Size recommendation   |

### Overall Values

| Value                            | Condition                            |
| -------------------------------- | ------------------------------------ |
| `Good Fit`                       | All measurements within normal range |
| `Some adjustments may be needed` | 1-2 measurements outside range       |
| `May not fit well`               | 3+ measurements outside range        |

### Example

```json
{
  "shoulder_fit": {
    "difference": -0.2,
    "status": "Normal",
    "description": "Good fit (-0.2 inches snug)"
  },
  "chest_fit": {
    "difference": 1.5,
    "status": "Normal",
    "description": "Good fit (+1.5 inches room)"
  },
  "sleeve_fit": {
    "difference": 1.0,
    "status": "Normal",
    "description": "Good fit (+1.0 inches room)"
  },
  "overall": "Good Fit",
  "recommendation": "Recommended: Normal Fit"
}
```

---

## CompareRequest Model

### Schema Definition

```python
class CompareRequest(BaseModel):
    user_measurements: UserMeasurement
    product_id: int
```

### Fields

| Field               | Type            | Required | Description                |
| ------------------- | --------------- | -------- | -------------------------- |
| `user_measurements` | UserMeasurement | Yes      | User's body measurements   |
| `product_id`        | int             | Yes      | Product to compare against |

### Example

```json
{
  "user_measurements": {
    "shoulder": 17.2,
    "chest": 38.5,
    "sleeve": 24.0,
    "neck": 15.0,
    "length": 26.5
  },
  "product_id": 1
}
```

---

## AnalyzeResponse Model

### Schema Definition

```python
class AnalyzeResponse(BaseModel):
    user_measurements: UserMeasurement
    product_measurements: dict
    fit_report: FitReport
```

### Fields

| Field                  | Type            | Description                 |
| ---------------------- | --------------- | --------------------------- |
| `user_measurements`    | UserMeasurement | Extracted user measurements |
| `product_measurements` | dict            | Product's measurements      |
| `fit_report`           | FitReport       | Fit analysis results        |

### Example

```json
{
  "user_measurements": {
    "shoulder": 17.2,
    "chest": 38.5,
    "sleeve": 24.0,
    "confidence": 80.0
  },
  "product_measurements": {
    "shoulder": 17,
    "chest": 40,
    "sleeve": 25
  },
  "fit_report": {
    "shoulder_fit": {
      "difference": -0.2,
      "status": "Normal",
      "description": "Good fit"
    },
    "chest_fit": {
      "difference": 1.5,
      "status": "Normal",
      "description": "Good fit"
    },
    "sleeve_fit": {
      "difference": 1.0,
      "status": "Normal",
      "description": "Good fit"
    },
    "overall": "Good Fit",
    "recommendation": "Recommended: Normal Fit"
  }
}
```

---

## Validation Rules

### Automatic Validation

Pydantic automatically validates:

- **Type correctness**: Fields must match declared types
- **Required fields**: Missing required fields raise errors
- **Optional fields**: Can be `None` or omitted

### Custom Validation Example

```python
from pydantic import BaseModel, validator

class UserMeasurement(BaseModel):
    shoulder: float

    @validator('shoulder')
    def shoulder_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Shoulder must be positive')
        if v > 30:
            raise ValueError('Shoulder measurement seems too large')
        return v
```

---

## Usage in API

### Request Validation

```python
@app.post("/compare")
async def compare_measurements(request: CompareRequest):
    # request is automatically validated
    user = request.user_measurements
    product_id = request.product_id
```

### Response Serialization

```python
@app.get("/products", response_model=List[Product])
async def get_products():
    return products  # Automatically serialized to JSON
```

---

Next: [Measurement Service](./MEASUREMENT_SERVICE.md)
