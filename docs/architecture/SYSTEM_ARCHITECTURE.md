# 🏗️ System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   React Frontend                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │   │
│  │  │   Home   │  │ Products │  │  Size    │  │  Admin   │ │   │
│  │  │   Page   │  │   List   │  │ Checker  │  │  Panel   │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │   │
│  │                      │                                     │   │
│  │              ┌───────┴───────┐                            │   │
│  │              │   BuyModal    │                            │   │
│  │              │   Component   │                            │   │
│  │              └───────────────┘                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                        Axios HTTP                                │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                          HTTP/REST
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                         API LAYER                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   FastAPI Backend                         │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │                    main.py                           │ │   │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │ │   │
│  │  │  │ Product  │ │ Measure  │ │ Compare  │ │ Analyze │ │ │   │
│  │  │  │  APIs    │ │   API    │ │   API    │ │   API   │ │ │   │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └─────────┘ │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                      SERVICE LAYER                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              MeasurementService                           │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │                                                       │ │   │
│  │  │  ┌──────────────┐    ┌──────────────┐               │ │   │
│  │  │  │  MediaPipe   │───▶│   OpenCV     │               │ │   │
│  │  │  │   Pose       │    │   Image      │               │ │   │
│  │  │  │  Landmarker  │    │  Processing  │               │ │   │
│  │  │  └──────────────┘    └──────────────┘               │ │   │
│  │  │         │                    │                       │ │   │
│  │  │         ▼                    ▼                       │ │   │
│  │  │  ┌──────────────┐    ┌──────────────┐               │ │   │
│  │  │  │  Extract     │───▶│  Generate    │               │ │   │
│  │  │  │ Measurements │    │  Fit Report  │               │ │   │
│  │  │  └──────────────┘    └──────────────┘               │ │   │
│  │  │                                                       │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                       DATA LAYER                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ┌──────────────────┐    ┌──────────────────┐           │   │
│  │  │  product_db.json │    │     uploads/     │           │   │
│  │  │   (Products)     │    │  (Images)        │           │   │
│  │  └──────────────────┘    └──────────────────┘           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Component Interaction Diagram

```
User Photo Upload Flow:
=======================

[User]
   │
   ▼
[React SizeChecker]
   │
   │ POST /analyze?product_id={id}
   │ (multipart/form-data: image)
   ▼
[FastAPI main.py]
   │
   │ Save temp image
   ▼
[MeasurementService]
   │
   ├──▶ [OpenCV: Read Image]
   │
   ├──▶ [MediaPipe: Detect Pose]
   │         │
   │         ▼
   │    [33 Pose Landmarks]
   │
   ├──▶ [Calculate Distances]
   │         │
   │         ▼
   │    [Pixel Measurements]
   │
   ├──▶ [Convert to Inches]
   │         │
   │         ▼
   │    [User Measurements]
   │
   └──▶ [Generate Fit Report]
             │
             ▼
        [Fit Analysis]
             │
             ▼
[JSON Response to Frontend]
   │
   ▼
[Display Results + Buy Prompt]
```

## Request/Response Flow

### Product Listing

```
GET /products
     │
     ▼
┌─────────────────┐
│  Load JSON DB   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Return Products │
│     Array       │
└─────────────────┘
```

### Size Analysis

```
POST /analyze?product_id=1
     │
     ▼
┌─────────────────────┐
│  Receive Image      │
│  Save Temporarily   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  MediaPipe Analysis │
│  - Detect landmarks │
│  - Calculate sizes  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Load Product from  │
│  Database           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Compare & Generate │
│  Fit Report         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Return JSON with   │
│  measurements &     │
│  recommendations    │
└─────────────────────┘
```

## Module Dependencies

```
main.py
   │
   ├── models/schemas.py
   │      └── Pydantic models
   │
   ├── services/measurement_service.py
   │      ├── mediapipe
   │      ├── opencv-python
   │      └── numpy
   │
   └── External
          ├── fastapi
          ├── uvicorn
          └── python-multipart
```

## Security Architecture

```
┌────────────────────────────────────────┐
│            SECURITY LAYERS             │
├────────────────────────────────────────┤
│                                        │
│  [Admin Routes]                        │
│       │                                │
│       ▼                                │
│  ┌──────────────────┐                 │
│  │ Query Param Auth │                 │
│  │   ?key=MYSECRET  │                 │
│  └──────────────────┘                 │
│                                        │
│  [CORS Protection]                     │
│       │                                │
│       ▼                                │
│  ┌──────────────────┐                 │
│  │ Allowed Origins: │                 │
│  │ - localhost:3000 │                 │
│  │ - localhost:5173 │                 │
│  └──────────────────┘                 │
│                                        │
│  [File Upload]                         │
│       │                                │
│       ▼                                │
│  ┌──────────────────┐                 │
│  │ - File type      │                 │
│  │   validation     │                 │
│  │ - Temp file      │                 │
│  │   cleanup        │                 │
│  └──────────────────┘                 │
│                                        │
└────────────────────────────────────────┘
```

## Scalability Considerations

### Current (Local Deployment)

- Single server instance
- JSON file database
- Local file storage
- Synchronous processing

### Future (Cloud Deployment)

```
                    ┌─────────────────┐
                    │   Load Balancer │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
   │  API Server │   │  API Server │   │  API Server │
   │    Pod 1    │   │    Pod 2    │   │    Pod 3    │
   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
   │  PostgreSQL │   │    Redis    │   │     S3      │
   │   Database  │   │    Cache    │   │   Storage   │
   └─────────────┘   └─────────────┘   └─────────────┘
```

---

Next: [Tech Stack](./TECH_STACK.md)
