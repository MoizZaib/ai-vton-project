# 🔐 Admin Guide

## Overview

This guide covers administrative functions for managing the product catalog.

## Accessing the Admin Panel

### URL Format
```
http://localhost:5173/admin?key=MYSECRET
```

### Authentication

The admin panel uses URL-based key authentication:

| Parameter | Value | Required |
|-----------|-------|----------|
| `key` | MYSECRET | Yes |

### Access Denied

If you access `/admin` without the correct key:
- You'll see an "Access Denied" message
- No admin functions will be available
- Add `?key=MYSECRET` to the URL

## Admin Functions

### Adding Products

1. **Navigate** to `/admin?key=MYSECRET`
2. **Fill out** the product form:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Product Name | Text | Yes | Display name for the product |
| Shoulder Width | Number | Yes | Shoulder measurement (inches) |
| Chest Size | Number | Yes | Chest measurement (inches) |
| Sleeve Length | Number | Yes | Sleeve measurement (inches) |
| Neck Size | Number | No | Neck circumference (inches) |
| Body Length | Number | No | Torso length (inches) |
| Product Image | File | Yes | JPEG or PNG image |

3. **Upload** product image
4. **Click** "Add Product"
5. **Verify** success message

### Form Example

```
┌─────────────────────────────────────────────┐
│           Add New Product                    │
├─────────────────────────────────────────────┤
│                                             │
│  Product Name                               │
│  ┌────────────────────────────────────┐    │
│  │ Classic White Shirt                │    │
│  └────────────────────────────────────┘    │
│                                             │
│  Shoulder Width (inches)                    │
│  ┌────────────────────────────────────┐    │
│  │ 17                                 │    │
│  └────────────────────────────────────┘    │
│                                             │
│  Chest Size (inches)                        │
│  ┌────────────────────────────────────┐    │
│  │ 40                                 │    │
│  └────────────────────────────────────┘    │
│                                             │
│  Sleeve Length (inches)                     │
│  ┌────────────────────────────────────┐    │
│  │ 25                                 │    │
│  └────────────────────────────────────┘    │
│                                             │
│  Neck Size (inches) - Optional              │
│  ┌────────────────────────────────────┐    │
│  │ 15.5                               │    │
│  └────────────────────────────────────┘    │
│                                             │
│  Body Length (inches) - Optional            │
│  ┌────────────────────────────────────┐    │
│  │ 28                                 │    │
│  └────────────────────────────────────┘    │
│                                             │
│  Product Image                              │
│  ┌────────────────────────────────────┐    │
│  │ 📁 Choose File  │ shirt.jpg       │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │         Add Product                │    │
│  └────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

## Measurement Guidelines

### Standard Shirt Sizes

| Size | Shoulder | Chest | Sleeve | Neck | Length |
|------|----------|-------|--------|------|--------|
| S | 15-16" | 34-36" | 22-23" | 14-14.5" | 25-26" |
| M | 16-17" | 38-40" | 24-25" | 15-15.5" | 27-28" |
| L | 17-18" | 42-44" | 25-26" | 16-16.5" | 29-30" |
| XL | 18-19" | 46-48" | 26-27" | 17-17.5" | 30-31" |
| XXL | 19-20" | 50-52" | 27-28" | 18-18.5" | 31-32" |

### How to Measure Products

1. **Shoulder Width**
   - Lay shirt flat
   - Measure from shoulder seam to shoulder seam

2. **Chest Size**
   - Measure across chest, 1" below armholes
   - Double for full circumference

3. **Sleeve Length**
   - From shoulder seam to cuff edge

4. **Neck Size**
   - Around the collar band
   - Add 0.5" for comfort

5. **Body Length**
   - From base of collar to bottom hem

## Image Requirements

### Recommended Specifications

| Property | Requirement |
|----------|-------------|
| Format | JPEG or PNG |
| Min Resolution | 500x500 pixels |
| Max File Size | 5 MB |
| Aspect Ratio | 1:1 or 3:4 preferred |
| Background | Plain white or light color |

### Image Tips

✅ **DO:**
- Use professional product photos
- Ensure even lighting
- Show full garment clearly
- Use consistent style

❌ **DON'T:**
- Use blurry images
- Include watermarks
- Use complex backgrounds
- Show partial product

## API Usage

### Direct API Access

You can also add products via API:

```bash
curl -X POST "http://localhost:8000/admin/add-product?key=MYSECRET&name=New%20Shirt&shoulder=17&chest=40&sleeve=25" \
  -F "image=@/path/to/image.jpg"
```

### Required Parameters

| Parameter | Type | Location |
|-----------|------|----------|
| key | string | Query |
| name | string | Query |
| shoulder | float | Query |
| chest | float | Query |
| sleeve | float | Query |
| image | file | Body |

### Optional Parameters

| Parameter | Type | Location |
|-----------|------|----------|
| neck | float | Query |
| length | float | Query |

## Data Storage

Products are stored in `backend-fastapi/product_db.json`:

```json
{
  "products": [
    {
      "id": 1,
      "name": "Classic White Shirt",
      "shoulder": 17,
      "chest": 40,
      "sleeve": 25,
      "neck": 15.5,
      "length": 28,
      "image": "uploads/uuid-filename.jpg"
    }
  ]
}
```

### Image Storage

Images are saved to `backend-fastapi/uploads/` with UUID-based filenames to prevent conflicts.

## Troubleshooting

### "Invalid admin key" Error

**Cause:** Wrong or missing key in URL

**Solution:**
1. Check URL has `?key=MYSECRET`
2. Verify key matches server configuration
3. Key is case-sensitive

### "Failed to add product" Error

**Possible Causes:**
- Missing required fields
- Invalid image file
- Server error

**Solutions:**
1. Check all required fields are filled
2. Ensure image is JPEG/PNG
3. Check server logs for details

### Image Not Showing

**Cause:** Static files not served correctly

**Solution:**
1. Verify `uploads/` directory exists
2. Check file permissions
3. Confirm FastAPI static mount is configured

## Security Best Practices

### For Development
- Default key `MYSECRET` is acceptable

### For Production

1. **Change Admin Key**
   ```python
   # In main.py
   ADMIN_KEY = os.environ.get("ADMIN_KEY", "your-secure-key-here")
   ```

2. **Use Environment Variables**
   ```bash
   export ADMIN_KEY="super-secret-production-key"
   ```

3. **Implement Proper Auth**
   - Consider JWT tokens
   - Add user login system
   - Use HTTPS

4. **Restrict Access**
   - Whitelist admin IPs
   - Add rate limiting
   - Log admin actions

---

Next: [Development Guide](./DEVELOPMENT_GUIDE.md)
