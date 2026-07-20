# 🔄 Data Flow

## Overview

This document describes how data flows through the AI-Based Clothing Size Suggestion system.

## Main Data Flows

### 1. Product Listing Flow

```
┌─────────────┐     GET /products     ┌─────────────┐
│   React     │ ──────────────────▶  │   FastAPI   │
│  Frontend   │                       │   Backend   │
└─────────────┘                       └──────┬──────┘
       ▲                                     │
       │                                     ▼
       │                              ┌─────────────┐
       │                              │   Load      │
       │                              │ product_db  │
       │                              │   .json     │
       │                              └──────┬──────┘
       │                                     │
       │         JSON Array                  │
       └─────────────────────────────────────┘
         [
           {id, name, shoulder, chest, ...},
           ...
         ]
```

### 2. Size Analysis Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                         USER INITIATES                              │
└────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│ STEP 1: Image Upload                                               │
│                                                                    │
│  User selects photo ──▶ FileReader ──▶ Preview displayed          │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│ STEP 2: API Request                                                │
│                                                                    │
│  FormData created ──▶ POST /analyze?product_id=X                  │
│                       Content-Type: multipart/form-data            │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│ STEP 3: Backend Processing                                         │
│                                                                    │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐        │
│  │ Save Temp    │───▶│ MediaPipe    │───▶│ Calculate    │        │
│  │ Image File   │    │ Detection    │    │ Distances    │        │
│  └──────────────┘    └──────────────┘    └──────────────┘        │
│                                                 │                  │
│                                                 ▼                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐        │
│  │ Delete Temp  │◀───│ Generate     │◀───│ Convert to   │        │
│  │ File         │    │ Fit Report   │    │ Inches       │        │
│  └──────────────┘    └──────────────┘    └──────────────┘        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│ STEP 4: Response                                                   │
│                                                                    │
│  {                                                                 │
│    "user_measurements": {shoulder: 17.2, chest: 38.5, ...},      │
│    "product_measurements": {shoulder: 16, chest: 40, ...},        │
│    "fit_report": {                                                 │
│      "shoulder_fit": {status: "Normal", ...},                     │
│      "overall": "Good Fit",                                        │
│      "recommendation": "Recommended: Normal Fit"                   │
│    }                                                               │
│  }                                                                 │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│ STEP 5: Display Results                                            │
│                                                                    │
│  Parse JSON ──▶ Update State ──▶ Render Components                │
│                                                                    │
│  [Overall Status] [Measurements Table] [Buy Button if Good Fit]   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 3. Product Addition Flow (Admin)

```
┌─────────────────────────────────────────────────────────────────┐
│                      ADMIN ADDS PRODUCT                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Form Data Collection                                             │
│                                                                  │
│  name: "Casual Shirt"                                           │
│  shoulder: 17                                                    │
│  chest: 40                                                       │
│  sleeve: 25                                                      │
│  image: [File Object]                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ API Request                                                      │
│                                                                  │
│  POST /admin/add-product?key=MYSECRET&name=...&shoulder=...     │
│  Body: FormData with image file                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Backend Processing                                               │
│                                                                  │
│  1. Verify admin key                                            │
│  2. Generate unique filename (UUID)                             │
│  3. Save image to uploads/                                      │
│  4. Load existing products from JSON                            │
│  5. Generate new product ID                                     │
│  6. Add product to array                                        │
│  7. Save updated JSON                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Response                                                         │
│                                                                  │
│  {                                                               │
│    "id": 4,                                                      │
│    "name": "Casual Shirt",                                      │
│    "shoulder": 17,                                               │
│    "chest": 40,                                                  │
│    "sleeve": 25,                                                 │
│    "image": "uploads/abc123.jpg"                                │
│  }                                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Purchase Flow

```
┌───────────────┐    Click "Buy Now"    ┌───────────────┐
│  ProductList  │ ────────────────────▶ │   BuyModal    │
│  or           │                       │   Opens       │
│  SizeChecker  │                       │               │
└───────────────┘                       └───────┬───────┘
                                                │
                                                ▼
                                        ┌───────────────┐
                                        │  User Fills   │
                                        │  Form Data:   │
                                        │  - Name       │
                                        │  - Email      │
                                        │  - Phone      │
                                        │  - Address    │
                                        │  - Size       │
                                        └───────┬───────┘
                                                │
                                                ▼
                                        ┌───────────────┐
                                        │  Submit Order │
                                        │  (Currently   │
                                        │   simulated)  │
                                        └───────┬───────┘
                                                │
                                                ▼
                                        ┌───────────────┐
                                        │  Success      │
                                        │  Confirmation │
                                        └───────────────┘
```

## Data Structures

### Product Data

```json
{
  "id": 1,
  "name": "Classic White Shirt",
  "shoulder": 17,
  "chest": 40,
  "sleeve": 25,
  "neck": 15.5,
  "length": 28,
  "image": "uploads/uuid.jpg"
}
```

### User Measurement Data

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

### Fit Report Data

```json
{
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
```

## State Management

### Frontend State Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    COMPONENT STATE                              │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ProductList                 SizeChecker                       │
│  ├── products: []            ├── products: []                 │
│  ├── loading: bool           ├── selectedProduct: obj         │
│  ├── error: string           ├── selectedFile: File           │
│  ├── selectedProduct: obj    ├── previewUrl: string          │
│  └── buyModalOpen: bool      ├── loading: bool               │
│                              ├── result: obj                  │
│                              ├── error: string               │
│                              └── buyModalOpen: bool          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                    STATE UPDATES                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Action              │  State Change                          │
│  ────────────────────┼────────────────────────────────────   │
│  Page Load           │  Fetch products, set loading          │
│  API Success         │  Set products, clear loading          │
│  API Error           │  Set error, clear loading             │
│  Select Product      │  Set selectedProduct                  │
│  Upload Photo        │  Set selectedFile, previewUrl         │
│  Analyze             │  Set loading, then result             │
│  Open Buy Modal      │  Set buyModalOpen: true               │
│  Close Buy Modal     │  Set buyModalOpen: false              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       ERROR SCENARIOS                            │
└─────────────────────────────────────────────────────────────────┘

1. Network Error
   API Call ──▶ Network Failure ──▶ Axios catches error
                                         │
                                         ▼
                                  Set error state
                                         │
                                         ▼
                                  Display error message
                                         │
                                         ▼
                                  Show retry button

2. No Pose Detected
   Upload Image ──▶ MediaPipe Analysis ──▶ No landmarks found
                                                  │
                                                  ▼
                                           Return error message:
                                           "Could not detect body pose"
                                                  │
                                                  ▼
                                           Display in UI with
                                           photo guidelines

3. Unauthorized Admin Access
   Access /admin ──▶ Check key param ──▶ Key mismatch
                                              │
                                              ▼
                                        Return 401 Unauthorized
                                              │
                                              ▼
                                        Show access denied page
```

---

Next: [Backend Overview](../backend/README.md)
