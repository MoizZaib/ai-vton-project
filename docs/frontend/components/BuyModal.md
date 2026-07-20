# 🛒 BuyModal Component

## Overview

The `BuyModal` component provides a purchase interface for users to complete their clothing orders.

## File Location

```
frontend-react/src/components/BuyModal.jsx
```

## Purpose

When a user clicks "Buy Now" on any product (from ProductList or SizeChecker), this modal opens to collect shipping details and confirm the purchase.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | boolean | Yes | - | Controls modal visibility |
| `onClose` | function | Yes | - | Callback when modal should close |
| `product` | object | Yes | - | The product being purchased |

### Product Object Shape

```javascript
{
  id: 1,
  name: "Classic White Shirt",
  shoulder: 17,
  chest: 40,
  sleeve: 25,
  image: "uploads/shirt1.jpg"
}
```

## Usage Examples

### Basic Usage

```jsx
import { useState } from 'react';
import BuyModal from '../components/BuyModal';

function ProductPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const product = { id: 1, name: "Classic Shirt" };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        Buy Now
      </button>
      
      <BuyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
}
```

### With Conditional Rendering

```jsx
{selectedProduct && (
  <BuyModal 
    isOpen={buyModalOpen}
    onClose={handleModalClose}
    product={selectedProduct}
  />
)}
```

## Internal State

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `formData` | object | {} | Form field values |
| `success` | boolean | false | Purchase completed |
| `loading` | boolean | false | Form submitting |

### formData Structure

```javascript
{
  name: "",      // Full name
  email: "",     // Email address
  phone: "",     // Phone number
  address: "",   // Shipping address
  size: ""       // Selected size (S/M/L/XL/XXL)
}
```

## Component Behavior

### Opening
1. Parent sets `isOpen` to `true`
2. Modal overlay appears with fade-in
3. Form resets to initial state
4. Focus moves to first input

### Form Submission
1. User fills all required fields
2. Clicks "Confirm Purchase"
3. `loading` state set to `true`
4. Simulate order processing (setTimeout)
5. `success` state set to `true`
6. Display success message

### Closing
1. User clicks X button, overlay, or Close button
2. `onClose` callback invoked
3. Parent sets `isOpen` to `false`
4. Modal fades out

## Form Validation

### Required Fields
All fields are required before submission:

```jsx
const isFormValid = 
  formData.name && 
  formData.email && 
  formData.phone && 
  formData.address && 
  formData.size;
```

### Email Validation
```jsx
<input 
  type="email"
  required
  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
/>
```

## Styling

### Modal Overlay
```jsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
```

### Modal Container
```jsx
<div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
```

### Form Elements
```jsx
// Input fields
<input className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

// Submit button
<button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
```

### Success State
```jsx
<div className="text-center">
  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
    <svg className="w-8 h-8 text-green-500">✓</svg>
  </div>
</div>
```

## Size Options

```jsx
<select>
  <option value="">Select Size</option>
  <option value="S">Small (S)</option>
  <option value="M">Medium (M)</option>
  <option value="L">Large (L)</option>
  <option value="XL">Extra Large (XL)</option>
  <option value="XXL">Double XL (XXL)</option>
</select>
```

## Visual States

### Form View
```
┌─────────────────────────────────┐
│ Complete Your Purchase      [X] │
│ "Product Name"                  │
├─────────────────────────────────┤
│ Full Name                       │
│ [________________________]      │
│                                 │
│ Email                           │
│ [________________________]      │
│                                 │
│ Phone                           │
│ [________________________]      │
│                                 │
│ Shipping Address                │
│ [________________________]      │
│ [________________________]      │
│                                 │
│ Select Size                     │
│ [Medium                    ▼]   │
│                                 │
│ [    Confirm Purchase      ]    │
└─────────────────────────────────┘
```

### Success View
```
┌─────────────────────────────────┐
│                                 │
│            ✓                    │
│                                 │
│   Order Placed Successfully!    │
│                                 │
│  Thank you for your purchase.   │
│  You will receive a             │
│  confirmation email shortly.    │
│                                 │
│         [  Close  ]             │
└─────────────────────────────────┘
```

## Event Handlers

### handleInputChange
```jsx
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
```

### handleSubmit
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  setSuccess(true);
  setLoading(false);
};
```

### handleClose
```jsx
const handleClose = () => {
  setFormData({});
  setSuccess(false);
  onClose();
};
```

## Accessibility

### Keyboard Navigation
- Tab through form fields
- Enter to submit form
- Escape to close (can be added)

### Screen Readers
```jsx
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Complete Your Purchase</h2>
</div>
```

### Labels
```jsx
<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
  Full Name
</label>
<input id="name" name="name" />
```

## Future Enhancements

### 1. Real Payment Integration
```jsx
// Stripe integration
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const handlePayment = async () => {
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: elements.getElement(CardElement),
  });
};
```

### 2. Address Autocomplete
```jsx
// Google Places integration
import usePlacesAutocomplete from 'use-places-autocomplete';
```

### 3. Order API Integration
```jsx
const submitOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};
```

### 4. Email Confirmation
- Send confirmation email on success
- Include order details and tracking

---

Back to: [Components](../COMPONENTS.md)
