# ❓ Frequently Asked Questions

## General Questions

### Q: What is this application?

**A:** This is an AI-powered clothing size suggestion system that:
- Analyzes your body proportions from a photo
- Compares your measurements to clothing products
- Recommends whether items will fit you well

### Q: How accurate is the AI measurement?

**A:** The AI provides estimates based on visible body proportions. Typical accuracy:
- **Shoulder width:** ±1-2 inches
- **Chest size:** ±2-3 inches
- **Sleeve length:** ±1-2 inches

Accuracy improves with:
- Good quality photos
- Proper pose and lighting
- Fitted clothing

### Q: Is my photo saved?

**A:** No. Photos are:
- Temporarily processed in memory
- Deleted immediately after analysis
- Never stored permanently

### Q: What products are supported?

**A:** Currently designed for upper-body garments:
- Shirts
- T-shirts
- Jackets
- Blazers
- Sweaters

---

## Usage Questions

### Q: What kind of photo should I use?

**A:** Best results with:
- ✅ Full body visible (head to hips)
- ✅ Standing straight, facing camera
- ✅ Arms slightly away from body
- ✅ Good, even lighting
- ✅ Plain background
- ✅ Fitted clothing

Avoid:
- ❌ Partial body shots
- ❌ Baggy clothing
- ❌ Poor lighting
- ❌ Arms at sides

### Q: Can I try multiple products?

**A:** Yes! After uploading your photo:
1. Use the product selector dropdown
2. Choose different products
3. Click "Analyze" again
4. Compare results

### Q: What do the fit statuses mean?

| Status | Meaning |
|--------|---------|
| **Normal** | Comfortable fit, recommended |
| **Tight** | May be restrictive, consider sizing up |
| **Loose** | May be baggy, consider sizing down |

### Q: What is "Good Fit" vs other results?

| Result | Meaning |
|--------|---------|
| **Good Fit** | All measurements normal |
| **Some adjustments needed** | 1-2 measurements off |
| **May not fit well** | 3+ measurements off |

---

## Technical Questions

### Q: What technologies are used?

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Axios

**Backend:**
- FastAPI (Python)
- MediaPipe Pose Landmarker
- OpenCV
- Pydantic

### Q: Where is data stored?

- **Products:** `product_db.json` (local JSON file)
- **Images:** `uploads/` folder
- **User photos:** Not stored (temporary processing only)

### Q: Can I run this on my server?

**A:** Yes! Steps:
1. Clone the repository
2. Set up Python and Node.js environments
3. Configure CORS for your domain
4. Use production servers (Gunicorn, Nginx)

### Q: What are the system requirements?

| Component | Minimum |
|-----------|---------|
| Python | 3.9+ |
| Node.js | 18+ |
| RAM | 2 GB (4 GB recommended) |
| Storage | 500 MB |

---

## Admin Questions

### Q: How do I access the admin panel?

**A:** Navigate to:
```
http://localhost:5173/admin?key=MYSECRET
```

The default key is `MYSECRET`.

### Q: How do I change the admin key?

**A:** Edit `main.py`:
```python
ADMIN_KEY = "your-new-secret-key"
```

For production, use environment variables:
```python
ADMIN_KEY = os.environ.get("ADMIN_KEY", "default-key")
```

### Q: How do I add products?

1. Go to admin panel with key
2. Fill in product details
3. Upload product image
4. Click "Add Product"

Or use API:
```bash
curl -X POST "http://localhost:8000/admin/add-product?key=MYSECRET&name=Shirt&shoulder=17&chest=40&sleeve=25" \
  -F "image=@product.jpg"
```

### Q: How do I delete products?

Currently, edit `product_db.json` directly:
1. Open the file
2. Remove the product from the array
3. Save the file
4. Delete image from `uploads/`

---

## Troubleshooting Questions

### Q: Why can't the AI detect my pose?

**Common causes:**
1. Full body not visible
2. Arms too close to body
3. Poor image quality
4. Complex background

**Solutions:**
- Use a clear, well-lit photo
- Stand with arms slightly out
- Ensure full torso is visible
- Use plain background

### Q: Why is the analysis slow?

**A:** MediaPipe processing takes 2-5 seconds. This is normal.

To speed up:
- Use smaller images
- Enable GPU if available
- Use the lite model instead of heavy

### Q: The frontend won't connect to backend

**Check:**
1. Backend running on port 8000
2. CORS configured correctly
3. No firewall blocking
4. Correct API URL in frontend

### Q: Products show broken images

**Check:**
1. `uploads/` directory exists
2. Images are in `uploads/`
3. Paths in `product_db.json` are correct
4. Static files mounted in FastAPI

---

## Feature Questions

### Q: Will you add payment integration?

**A:** The current version simulates purchases. For production:
- Stripe integration is recommended
- PayPal is also supported
- Modify `BuyModal` component

### Q: Can I use this for pants/shoes?

**A:** The current model focuses on upper body. For full body:
- Lower body landmarks are available in MediaPipe
- Would need additional measurement logic
- Could extend `measurement_service.py`

### Q: Is there a mobile app?

**A:** Currently web-only. For mobile:
- The web app is responsive
- Works in mobile browsers
- Native app would require React Native or similar

### Q: Can multiple users use this simultaneously?

**A:** Yes, the FastAPI backend handles concurrent requests. For high traffic:
- Use production server (Gunicorn)
- Add caching (Redis)
- Use cloud storage for images

---

## Privacy Questions

### Q: Is my data collected?

**A:** No personal data is collected. 
- Photos are processed temporarily
- No analytics or tracking
- All processing is local

### Q: Is my photo sent to external servers?

**A:** No. All processing happens:
- On your own backend server
- Using local MediaPipe model
- No cloud AI services

### Q: Can I use this commercially?

**A:** Yes, with considerations:
- MediaPipe is Apache 2.0 licensed
- FastAPI is MIT licensed
- React is MIT licensed
- Ensure GDPR compliance for user data

---

## Still Have Questions?

1. Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Review [Developer Guide](../guides/DEVELOPMENT_GUIDE.md)
3. Check API documentation at `/docs`

---

Next: [Environment Setup](./ENVIRONMENT.md)
