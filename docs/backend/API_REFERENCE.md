# 📚 API Reference

## Base URL

```
http://localhost:8000
```

## Interactive Documentation

FastAPI provides automatic interactive documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Endpoints

### GET /products

Retrieve all products from the catalog.

**Request**

```http
GET /products HTTP/1.1
Host: localhost:8000
```

**Response** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Classic White Shirt",
    "shoulder": 17,
    "chest": 40,
    "sleeve": 25,
    "neck": 15.5,
    "length": 28,
    "image": "uploads/shirt1.jpg"
  },
  {
    "id": 2,
    "name": "Slim Fit Blue Shirt",
    "shoulder": 16,
    "chest": 38,
    "sleeve": 24,
    "neck": 15,
    "length": 27,
    "image": "uploads/shirt2.jpg"
  }
]
```

**cURL Example**

```bash
curl -X GET http://localhost:8000/products
```

---

### GET /products/{product_id}

Retrieve a single product by ID.

**Parameters**
| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| product_id | integer | path | Yes | Product ID |

**Request**

```http
GET /products/1 HTTP/1.1
Host: localhost:8000
```

**Response** `200 OK`

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

**Error Response** `404 Not Found`

```json
{
  "detail": "Product not found"
}
```

---

### POST /admin/add-product

Add a new product to the catalog. **Requires admin key.**

**Parameters**
| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| key | string | query | Yes | Admin secret key |
| name | string | query | Yes | Product name |
| shoulder | float | query | Yes | Shoulder width (inches) |
| chest | float | query | Yes | Chest width (inches) |
| sleeve | float | query | Yes | Sleeve length (inches) |
| neck | float | query | No | Neck size (inches) |
| length | float | query | No | Body length (inches) |

**Body**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| image | file | Yes | Product image (JPEG/PNG) |

**Request**

```http
POST /admin/add-product?key=MYSECRET&name=New%20Shirt&shoulder=17&chest=40&sleeve=25 HTTP/1.1
Host: localhost:8000
Content-Type: multipart/form-data

[image file data]
```

**Response** `200 OK`

```json
{
  "id": 4,
  "name": "New Shirt",
  "shoulder": 17.0,
  "chest": 40.0,
  "sleeve": 25.0,
  "neck": null,
  "length": null,
  "image": "uploads/a1b2c3d4.jpg"
}
```

**Error Response** `401 Unauthorized`

```json
{
  "detail": "Invalid admin key"
}
```

**cURL Example**

```bash
curl -X POST "http://localhost:8000/admin/add-product?key=MYSECRET&name=New%20Shirt&shoulder=17&chest=40&sleeve=25" \
  -F "image=@/path/to/image.jpg"
```

---

### POST /measure

Extract body measurements from an uploaded photo.

**Body**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| file | file | Yes | Full-body photo (JPEG/PNG) |

**Request**

```http
POST /measure HTTP/1.1
Host: localhost:8000
Content-Type: multipart/form-data

[image file data]
```

**Response** `200 OK`

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

**Error Response** `400 Bad Request`

```json
{
  "detail": "Could not detect body pose in the image. Please ensure full body is visible."
}
```

**cURL Example**

```bash
curl -X POST http://localhost:8000/measure \
  -F "file=@/path/to/fullbody.jpg"
```

---

### POST /compare

Compare user measurements against a product.

**Body** (JSON)

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

**Response** `200 OK`

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

**cURL Example**

```bash
curl -X POST http://localhost:8000/compare \
  -H "Content-Type: application/json" \
  -d '{
    "user_measurements": {
      "shoulder": 17.2,
      "chest": 38.5,
      "sleeve": 24.0
    },
    "product_id": 1
  }'
```

---

### POST /analyze

Complete analysis: upload photo and compare with product.

**Parameters**
| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| product_id | integer | query | Yes | Product ID to compare |

**Body**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| file | file | Yes | Full-body photo (JPEG/PNG) |

**Request**

```http
POST /analyze?product_id=1 HTTP/1.1
Host: localhost:8000
Content-Type: multipart/form-data

[image file data]
```

**Response** `200 OK`

```json
{
  "user_measurements": {
    "shoulder": 17.2,
    "chest": 38.5,
    "sleeve": 24.0,
    "neck": 15.0,
    "length": 26.5,
    "confidence": 80.0,
    "message": "Measurements extracted with 80.0% confidence"
  },
  "product_measurements": {
    "shoulder": 17,
    "chest": 40,
    "sleeve": 25,
    "neck": 15.5,
    "length": 28
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

**cURL Example**

```bash
curl -X POST "http://localhost:8000/analyze?product_id=1" \
  -F "file=@/path/to/fullbody.jpg"
```

---

## Static Files

### GET /uploads/{filename}

Serve product images.

**Request**

```http
GET /uploads/shirt1.jpg HTTP/1.1
Host: localhost:8000
```

**Response** `200 OK`

```
[Binary image data]
Content-Type: image/jpeg
```

---

## Error Codes

| Code | Status                | Description                       |
| ---- | --------------------- | --------------------------------- |
| 200  | OK                    | Request successful                |
| 400  | Bad Request           | Invalid input or processing error |
| 401  | Unauthorized          | Invalid or missing admin key      |
| 404  | Not Found             | Resource not found                |
| 422  | Unprocessable Entity  | Validation error                  |
| 500  | Internal Server Error | Server error                      |

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:

- Request throttling
- IP-based limits
- API key authentication

---

Next: [Models & Schemas](./MODELS.md)
