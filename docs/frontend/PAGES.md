# 📄 Pages Documentation

## Overview

This document describes the page components that make up the application's main views.

## Page Directory

```
src/pages/
├── Home.jsx         # Landing page
├── ProductList.jsx  # Product catalog
├── SizeChecker.jsx  # AI size analysis
└── AdminPanel.jsx   # Product management
```

---

## Home.jsx

### Purpose
Landing page introducing the application and its features.

### Route
```
/
```

### Features
- Hero section with main value proposition
- Feature highlights (AI measurement, size suggestions)
- Call-to-action buttons
- Navigation to main sections

### Component Structure
```jsx
<HomePage>
  <Hero Section>
    <Title>
    <Description>
    <CTA Buttons>
  </Hero Section>
  
  <Features Section>
    <Feature Card: AI Body Measurement>
    <Feature Card: Size Suggestions>
    <Feature Card: Easy Shopping>
  </Features Section>
  
  <How It Works Section>
    <Step 1: Browse Products>
    <Step 2: Upload Photo>
    <Step 3: Get Recommendations>
  </How It Works Section>
</HomePage>
```

### Key Elements

| Element | Purpose |
|---------|---------|
| Hero Title | "AI-Powered Size Suggestions" |
| Feature Cards | Highlight key capabilities |
| CTA Buttons | Navigate to Products/Size Checker |

---

## ProductList.jsx

### Purpose
Display product catalog with purchase and try-on options.

### Route
```
/products
```

### Features
- Fetch products from API
- Grid layout display
- Product images
- "Buy Now" button (opens BuyModal)
- "Try It" button (navigates to SizeChecker)

### State

| State | Type | Description |
|-------|------|-------------|
| `products` | array | List of products from API |
| `loading` | boolean | Loading state |
| `error` | string | Error message |
| `selectedProduct` | object | Product for modal |
| `buyModalOpen` | boolean | Modal visibility |

### Component Structure
```jsx
<ProductListPage>
  <Page Title>
  
  {loading && <Loading Spinner>}
  {error && <Error Message>}
  
  <Products Grid>
    {products.map(product => (
      <Product Card>
        <Product Image>
        <Product Name>
        <Measurements Info>
        <Button: "Buy Now" onClick={openModal}>
        <Button: "Try It" onClick={navigateToSizeChecker}>
      </Product Card>
    ))}
  </Products Grid>
  
  <BuyModal 
    isOpen={buyModalOpen}
    onClose={closeModal}
    product={selectedProduct}
  />
</ProductListPage>
```

### Data Flow
```
Mount → Fetch /products → Set products state → Render grid
                ↓
         Error? → Show error message
```

---

## SizeChecker.jsx

### Purpose
AI-powered body measurement and size recommendation.

### Route
```
/size-checker
```

### Features
- Product selection dropdown
- Photo upload with preview
- AI analysis trigger
- Results display with fit report
- Purchase encouragement for good fits

### State

| State | Type | Description |
|-------|------|-------------|
| `products` | array | Products for selection |
| `selectedProduct` | string | Selected product ID |
| `selectedFile` | File | Uploaded image file |
| `previewUrl` | string | Image preview URL |
| `loading` | boolean | Analysis in progress |
| `result` | object | Analysis results |
| `error` | string | Error message |
| `buyModalOpen` | boolean | Modal visibility |

### Component Structure
```jsx
<SizeCheckerPage>
  <Page Title & Instructions>
  
  <Product Selector>
    <Select dropdown with all products>
  </Product Selector>
  
  <Photo Upload Section>
    <File Input>
    <Image Preview>
    <Photo Guidelines>
  </Photo Upload Section>
  
  <Analyze Button>
  
  {loading && <Loading Indicator>}
  
  {result && (
    <Results Section>
      <Overall Fit Status (with color coding)>
      
      <Measurements Comparison Table>
        | Measurement | You | Product | Fit |
        |-------------|-----|---------|-----|
        | Shoulder    | 17.2| 17      | ✓   |
        
      <Recommendation Text>
      
      {goodFit && (
        <Purchase Encouragement>
          <"This fits you perfectly!">
          <Buy Now Button>
        </Purchase Encouragement>
      )}
    </Results Section>
  )}
  
  <BuyModal />
</SizeCheckerPage>
```

### Analysis Flow
```
Select Product → Upload Photo → Click Analyze
                                     ↓
                              POST /analyze
                                     ↓
                              Display Results
                                     ↓
                       Good Fit? → Show Buy Button
```

### Photo Guidelines
- Stand straight, facing camera
- Full body visible (head to at least hips)
- Arms slightly away from body
- Good lighting
- Plain background preferred

---

## AdminPanel.jsx

### Purpose
Product management for administrators.

### Route
```
/admin?key=MYSECRET
```

### Features
- Key-based authentication
- Product addition form
- All measurement fields
- Image upload
- Success/error feedback

### State

| State | Type | Description |
|-------|------|-------------|
| `isAuthorized` | boolean | Auth status |
| `formData` | object | Form field values |
| `imageFile` | File | Product image |
| `loading` | boolean | Submission in progress |
| `message` | object | Success/error message |

### Component Structure
```jsx
<AdminPanelPage>
  {!isAuthorized ? (
    <Unauthorized Message>
      <Lock Icon>
      <Access Denied Text>
      <Instructions>
    </Unauthorized Message>
  ) : (
    <Admin Content>
      <Page Title>
      
      <Add Product Form>
        <Product Name Input>
        <Shoulder Width Input>
        <Chest Size Input>
        <Sleeve Length Input>
        <Neck Size Input (optional)>
        <Length Input (optional)>
        <Image Upload Input>
        <Submit Button>
      </Add Product Form>
      
      {message && (
        <Status Message (success/error)>
      )}
    </Admin Content>
  )}
</AdminPanelPage>
```

### Authentication Flow
```
Page Load → Check URL for ?key=MYSECRET
               ↓
        Key matches? → Show admin form
               ↓
        Key missing/wrong? → Show unauthorized
```

### Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | text | Yes | Non-empty |
| shoulder | number | Yes | > 0 |
| chest | number | Yes | > 0 |
| sleeve | number | Yes | > 0 |
| neck | number | No | > 0 if provided |
| length | number | No | > 0 if provided |
| image | file | Yes | Image file |

---

## Page Routing

Configured in `App.jsx`:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/size-checker" element={<SizeChecker />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Common Patterns

### API Fetching
```jsx
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.getProducts();
      setProducts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### Loading State
```jsx
{loading && (
  <div className="flex justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
)}
```

### Error Display
```jsx
{error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    {error}
  </div>
)}
```

---

Next: [BuyModal Component](./components/BuyModal.md)
