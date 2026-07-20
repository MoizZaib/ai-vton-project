# 🧩 Components Documentation

## Overview

This document describes the reusable React components in the application.

## Component Directory

```
src/components/
└── BuyModal.jsx    # Purchase modal component
```

---

## BuyModal

A modal component for handling product purchases.

### Purpose

Displays a purchase form when users click "Buy Now" on any product, collecting user details and confirming the order.

### Import

```jsx
import BuyModal from '../components/BuyModal';
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | Yes | Controls modal visibility |
| `onClose` | function | Yes | Callback when modal closes |
| `product` | object | Yes | Product being purchased |

### Usage

```jsx
import { useState } from 'react';
import BuyModal from '../components/BuyModal';

function ProductList() {
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setBuyModalOpen(true);
  };

  return (
    <>
      {/* Products grid */}
      <button onClick={() => handleBuyClick(product)}>Buy Now</button>

      {/* Buy Modal */}
      <BuyModal 
        isOpen={buyModalOpen} 
        onClose={() => setBuyModalOpen(false)} 
        product={selectedProduct} 
      />
    </>
  );
}
```

### Component Structure

```jsx
<Modal Overlay>
  <Modal Container>
    <Close Button />
    
    {!success ? (
      <Purchase Form>
        <Product Name>
        <Full Name Input>
        <Email Input>
        <Phone Input>
        <Address Textarea>
        <Size Selector>
        <Submit Button>
      </Purchase Form>
    ) : (
      <Success Message>
        <Checkmark Icon>
        <Thank You Message>
        <Order Details>
        <Close Button>
      </Success Message>
    )}
  </Modal Container>
</Modal Overlay>
```

### Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full Name | text | Yes | Non-empty |
| Email | email | Yes | Valid email format |
| Phone | tel | Yes | Non-empty |
| Address | textarea | Yes | Non-empty |
| Size | select | Yes | Must select S/M/L/XL/XXL |

### States

1. **Form State** (initial)
   - Display purchase form
   - All fields empty
   - Submit button enabled

2. **Success State**
   - Display confirmation message
   - Show order summary
   - Green checkmark animation
   - Close button to dismiss

### Styling

Uses Tailwind CSS classes:
- Modal overlay with semi-transparent black background
- Centered white modal container
- Responsive design for mobile/desktop
- Green accent for success state
- Blue accent for form elements

### Example Rendered Output

**Form State:**
```
┌──────────────────────────────────────────┐
│                                      [X] │
│          Complete Your Purchase          │
│        "Classic White Shirt"             │
│                                          │
│  Full Name                               │
│  ┌────────────────────────────────────┐ │
│  │ John Doe                           │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Email                                   │
│  ┌────────────────────────────────────┐ │
│  │ john@example.com                   │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Phone                                   │
│  ┌────────────────────────────────────┐ │
│  │ +1-555-0123                        │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Shipping Address                        │
│  ┌────────────────────────────────────┐ │
│  │ 123 Main St                        │ │
│  │ City, ST 12345                     │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Select Size                             │
│  ┌────────────────────────────────────┐ │
│  │ Medium                          ▼  │ │
│  └────────────────────────────────────┘ │
│                                          │
│     ┌────────────────────────────────┐  │
│     │      Confirm Purchase          │  │
│     └────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

**Success State:**
```
┌──────────────────────────────────────────┐
│                                          │
│                  ✓                       │
│                                          │
│         Order Placed Successfully!       │
│                                          │
│      Thank you for your purchase.        │
│   You will receive a confirmation        │
│           email shortly.                 │
│                                          │
│     ┌────────────────────────────────┐  │
│     │           Close                │  │
│     └────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

### Accessibility

- Modal traps focus when open
- Close on Escape key (can be added)
- Close on overlay click (can be added)
- Proper form labels
- Submit button disabled during processing

### Future Enhancements

1. **Payment Integration**
   - Stripe/PayPal integration
   - Credit card form
   - Order total calculation

2. **Form Validation**
   - Real-time validation feedback
   - Phone number formatting
   - Address autocomplete

3. **Order Processing**
   - Backend API integration
   - Order confirmation emails
   - Order tracking

---

## Creating New Components

### Template

```jsx
// src/components/MyComponent.jsx

import { useState } from 'react';

function MyComponent({ prop1, prop2, onAction }) {
  const [state, setState] = useState(initialValue);

  const handleAction = () => {
    // Handle action
    onAction?.();
  };

  return (
    <div className="component-wrapper">
      {/* Component content */}
    </div>
  );
}

export default MyComponent;
```

### Best Practices

1. **Props**
   - Destructure in function signature
   - Use optional chaining for callbacks
   - Document with PropTypes or TypeScript

2. **State**
   - Keep state minimal
   - Lift state up when shared
   - Use meaningful state names

3. **Styling**
   - Use Tailwind utility classes
   - Keep consistent spacing
   - Follow design system colors

4. **Structure**
   - One component per file
   - Export as default
   - Keep under 200 lines

---

Next: [Pages](./PAGES.md)
