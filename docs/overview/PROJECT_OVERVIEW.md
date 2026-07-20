# 🎯 Project Overview

## Introduction

The **AI-Based Clothing Size Suggestion** system is a local prototype that helps users find their perfect clothing size by analyzing their body measurements from uploaded photos and comparing them with product specifications.

## Problem Statement

Online clothing shopping often leads to:

- **Size mismatch**: Users order wrong sizes
- **High return rates**: Ill-fitting clothes are returned
- **Customer frustration**: Poor shopping experience
- **Business losses**: Logistics and restocking costs

## Solution

This system provides:

1. **AI-Powered Measurement**: Extract body measurements from photos using MediaPipe
2. **Smart Comparison**: Compare user measurements with product specifications
3. **Fit Recommendations**: Provide clear guidance on size fit
4. **Purchase Confidence**: Encourage purchases when fit is optimal

## Key Features

### For Users

- 📸 Upload upper-body photo for measurement
- 👕 Browse available products with size details
- 📏 Get AI-extracted body measurements
- ✅ Receive fit recommendations (Tight/Normal/Loose)
- 🛒 Easy purchase flow when fit is good

### For Admins

- ➕ Add new products with measurements
- 📷 Upload product images
- 🗑️ Delete existing products
- 📊 View product catalog

## Measurements Extracted

| Measurement  | Description                  | Method                      |
| ------------ | ---------------------------- | --------------------------- |
| **Shoulder** | Width across shoulders       | MediaPipe landmark distance |
| **Chest**    | Chest circumference estimate | Shoulder width × multiplier |
| **Sleeve**   | Shoulder to wrist length     | Landmark path distance      |
| **Length**   | Shoulder to hip distance     | Vertical landmark distance  |
| **Neck**     | Neck circumference estimate  | Face width proportion       |

## Fit Logic

| Difference      | Fit Status | Recommendation        |
| --------------- | ---------- | --------------------- |
| > +2 inches     | Loose      | Consider smaller size |
| -2 to +2 inches | Normal     | Good fit              |
| < -2 inches     | Tight      | Consider larger size  |

## Use Cases

### Use Case 1: First-Time Buyer

1. User visits product page
2. Clicks "Try It" on desired product
3. Uploads upper-body photo
4. Receives fit recommendation
5. Purchases with confidence

### Use Case 2: Direct Purchase

1. User visits product page
2. Clicks "Buy Now" directly
3. Fills in delivery details
4. Places order

### Use Case 3: Admin Product Management

1. Admin accesses admin panel with key
2. Adds new products with measurements
3. Uploads product images
4. Manages product catalog

## System Requirements

### Minimum Requirements

- **OS**: Windows 10, macOS 10.14+, or Linux
- **Python**: 3.9 or higher
- **Node.js**: 18 or higher
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 500MB free space

### Recommended for Best Performance

- **RAM**: 8GB or more
- **GPU**: Optional but improves MediaPipe performance
- **Camera**: For live photo capture (optional)

## Limitations

### Current Version

- Local deployment only (no cloud)
- No user authentication
- Measurement accuracy depends on photo quality
- 2D image analysis only (no depth sensing)
- Chest measurement is estimated (not directly measured)

### Future Improvements

- Cloud deployment
- User accounts and order history
- Improved accuracy with depth sensors
- Full virtual try-on (VTON) integration
- Multiple size recommendations

## Success Metrics

| Metric                 | Target               | Current      |
| ---------------------- | -------------------- | ------------ |
| Measurement Extraction | 80%+ accuracy        | ~70-80%      |
| Fit Recommendation     | 85%+ accuracy        | ~75-85%      |
| User Experience        | < 5 seconds analysis | ~3-5 seconds |
| Photo Compatibility    | 90%+ photos work     | ~85%         |

---

Next: [Quick Start Guide](./QUICK_START.md)
