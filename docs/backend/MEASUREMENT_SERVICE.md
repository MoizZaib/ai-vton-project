# 🤖 Measurement Service

## Overview

The `MeasurementService` is the core AI component that uses **MediaPipe Pose Landmarker** to extract body measurements from photos.

## File Location

```
backend-fastapi/services/measurement_service.py
```

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    MeasurementService                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   OpenCV        │───▶│   MediaPipe     │───▶│  Calculate   │ │
│  │   Load Image    │    │   Pose Detect   │    │  Distances   │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
│                                                       │          │
│                                                       ▼          │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   Return        │◀───│   Fit Report    │◀───│  Convert to  │ │
│  │   Results       │    │   Generation    │    │   Inches     │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## MediaPipe Pose Landmarks

The service uses these key landmarks from MediaPipe's 33-point pose model:

```
        [0] NOSE
           |
    [11]---+---[12]     LEFT_SHOULDER --- RIGHT_SHOULDER
     |           |
    [13]       [14]     LEFT_ELBOW --- RIGHT_ELBOW
     |           |
    [15]       [16]     LEFT_WRIST --- RIGHT_WRIST
     |           |
    [23]---+---[24]     LEFT_HIP --- RIGHT_HIP
     |           |
    [25]       [26]     LEFT_KNEE --- RIGHT_KNEE
     |           |
    [27]       [28]     LEFT_ANKLE --- RIGHT_ANKLE
```

### Landmark Indices Used

| Index | Landmark       | Use                    |
| ----- | -------------- | ---------------------- |
| 0     | Nose           | Face reference         |
| 7     | Left Ear       | Face width calculation |
| 8     | Right Ear      | Face width calculation |
| 11    | Left Shoulder  | Shoulder width         |
| 12    | Right Shoulder | Shoulder width         |
| 13    | Left Elbow     | Arm measurement        |
| 15    | Left Wrist     | Sleeve length          |
| 23    | Left Hip       | Torso length           |
| 24    | Right Hip      | Torso length           |

## Key Methods

### `__init__()`

Initializes the MediaPipe Pose Landmarker with auto-download of model file.

```python
def __init__(self):
    self.model_path = "pose_landmarker_heavy.task"

    # Auto-download if not present
    if not os.path.exists(self.model_path):
        self._download_model()
```

### `extract_measurements(image_path: str)`

Main method to extract body measurements from an image.

**Process:**

1. Load image with OpenCV
2. Convert BGR to RGB
3. Detect pose landmarks
4. Calculate pixel distances
5. Convert to real-world measurements

**Returns:**

```python
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

### `_calculate_distance(p1, p2, image_shape)`

Calculates Euclidean distance between two landmarks in pixels.

```python
def _calculate_distance(self, p1, p2, image_shape):
    x1, y1 = p1.x * image_shape[1], p1.y * image_shape[0]
    x2, y2 = p2.x * image_shape[1], p2.y * image_shape[0]
    return math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
```

### `_pixels_to_inches(pixels, face_width_pixels)`

Converts pixel measurements to inches using face width as reference.

**Assumption:** Average face width ≈ 5.5 inches

```python
def _pixels_to_inches(self, pixels, face_width_pixels):
    AVERAGE_FACE_WIDTH_INCHES = 5.5
    return (pixels / face_width_pixels) * AVERAGE_FACE_WIDTH_INCHES
```

### `generate_fit_report(user, product)`

Compares user measurements against product and generates fit analysis.

**Fit Classification:**

```python
if abs(diff) <= 2:
    status = "Normal"
elif diff < -2:
    status = "Tight"
else:
    status = "Loose"
```

## Measurement Calculations

### Shoulder Width

```python
shoulder_px = self._calculate_distance(
    landmarks[11],  # Left shoulder
    landmarks[12],  # Right shoulder
    image_shape
)
```

### Chest (Estimated)

```python
# Chest = shoulder width * 2.35 (approximation)
chest_px = shoulder_px * 2.35
```

### Sleeve Length

```python
sleeve_px = (
    self._calculate_distance(landmarks[11], landmarks[13], shape) +  # Shoulder to elbow
    self._calculate_distance(landmarks[13], landmarks[15], shape)    # Elbow to wrist
)
```

### Neck (Estimated)

```python
# Neck = face width * 2.8 (approximation)
neck = face_width_inches * 2.8
```

### Body Length

```python
length_px = self._calculate_distance(
    landmarks[11],  # Shoulder
    landmarks[23],  # Hip
    image_shape
)
```

## Confidence Score

The confidence score is derived from MediaPipe's landmark visibility:

```python
# Average visibility of key landmarks
visibility_scores = [
    landmarks[11].visibility,
    landmarks[12].visibility,
    landmarks[13].visibility,
    landmarks[23].visibility,
    landmarks[24].visibility
]
confidence = (sum(visibility_scores) / len(visibility_scores)) * 100
```

## Error Handling

### No Pose Detected

```python
if not detection_result.pose_landmarks:
    return {
        "error": True,
        "message": "Could not detect body pose in the image"
    }
```

### Low Confidence

```python
if confidence < 50:
    return {
        "warning": True,
        "message": "Low confidence detection. Results may be inaccurate."
    }
```

## Best Practices for Input Images

For accurate measurements, users should:

1. **Stand straight** facing the camera
2. **Arms slightly away** from the body
3. **Full body visible** from head to at least hips
4. **Good lighting** without harsh shadows
5. **Plain background** preferred
6. **Fitted clothing** for better landmark detection

## Model Details

### Pose Landmarker Heavy

- **Model**: `pose_landmarker_heavy.task`
- **Size**: ~30 MB
- **Accuracy**: High (best for static images)
- **Speed**: Slower than lite/full models
- **Source**: [MediaPipe Models](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker)

### Auto-Download

The model is automatically downloaded on first use:

```python
MODEL_URL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task"
```

## Performance Optimization

### Current Implementation

- Synchronous processing
- Single image at a time
- Model loaded per request (can be cached)

### Suggested Improvements

```python
# Singleton pattern for model caching
class MeasurementService:
    _instance = None
    _landmarker = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._landmarker = cls._load_model()
        return cls._instance
```

## Testing

### Manual Testing

```python
# Test with sample image
service = MeasurementService()
result = service.extract_measurements("test_photo.jpg")
print(result)
```

### Unit Test Example

```python
def test_measurement_extraction():
    service = MeasurementService()
    result = service.extract_measurements("fixtures/test_person.jpg")

    assert "shoulder" in result
    assert "chest" in result
    assert result["confidence"] > 50
```

---

Next: [Frontend Documentation](../frontend/README.md)
