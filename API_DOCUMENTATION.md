# E-Commerce API Documentation

## Cart Module (`/carts`)

### GET `/carts`
Get user's shopping cart
- **Auth**: Required
- **Response**: Cart object with items array

### POST `/carts/add`
Add item to cart
- **Auth**: Required
- **Body**: `{ productId: string, quantity: number }`
- **Response**: Updated cart

### PATCH `/carts/:productId`
Update cart item quantity
- **Auth**: Required
- **Params**: `productId`
- **Body**: `{ quantity: number }`
- **Response**: Updated cart

### DELETE `/carts/:productId`
Remove item from cart
- **Auth**: Required
- **Params**: `productId`
- **Response**: Updated cart

### DELETE `/carts`
Clear entire cart
- **Auth**: Required
- **Response**: Empty cart

---

## Order Module (`/orders`)

### POST `/orders`
Create order from cart
- **Auth**: Required
- **Body**:
  ```json
  {
    "shippingAddressId": "address_id",
    "discountCode": "CODE (optional)",
    "paymentMethod": "cash | card (optional)",
    "notes": "delivery notes (optional)"
  }
  ```
- **Response**: Order object with orderId, status, total

### GET `/orders`
Get user's orders
- **Auth**: Required
- **Response**: Array of orders

### GET `/orders/:orderId`
Get specific order
- **Auth**: Required
- **Params**: `orderId`
- **Response**: Order details

### PATCH `/orders/:orderId/status`
Update order status (Admin)
- **Auth**: Required
- **Params**: `orderId`
- **Body**: `{ orderStatus: "pending | processing | shipped | delivered | cancelled" }`
- **Response**: Updated order

---

## Review & Rating Module (`/reviews`)

### POST `/reviews`
Create product review
- **Auth**: Required
- **Body**:
  ```json
  {
    "productId": "product_id",
    "rating": 1-5,
    "reviewText": "optional review text",
    "isPublished": false
  }
  ```
- **Response**: Review object

### GET `/reviews/product/:productId`
Get published reviews for product
- **Params**: `productId`
- **Response**: Array of reviews (sorted by newest)

### GET `/reviews`
Get user's reviews
- **Auth**: Required
- **Response**: Array of user's reviews

### PATCH `/reviews/:reviewId/publish`
Publish review (makes it visible)
- **Auth**: Required
- **Params**: `reviewId`
- **Response**: Updated review
- **Side Effect**: Updates product ratingAverage and ratingCount

### PATCH `/reviews/:reviewId/unpublish`
Unpublish review (hides it)
- **Auth**: Required
- **Params**: `reviewId`
- **Response**: Updated review
- **Side Effect**: Recalculates product ratings

### PATCH `/reviews/:reviewId/helpful`
Mark review as helpful
- **Params**: `reviewId`
- **Response**: Review with incremented helpfulCount

### DELETE `/reviews/:reviewId`
Delete review
- **Auth**: Required
- **Params**: `reviewId`
- **Response**: Deleted review
- **Side Effect**: Recalculates product ratings if published

---

## Wishlist Module (`/wishlists`)

### GET `/wishlists`
Get user's wishlist
- **Auth**: Required
- **Response**: Wishlist with populated product details

### POST `/wishlists/add`
Add product to wishlist
- **Auth**: Required
- **Body**: `{ productId: string }`
- **Response**: Updated wishlist

### GET `/wishlists/check/:productId`
Check if product in wishlist
- **Auth**: Required
- **Params**: `productId`
- **Response**: `{ isInWishlist: boolean }`

### DELETE `/wishlists/:productId`
Remove product from wishlist
- **Auth**: Required
- **Params**: `productId`
- **Response**: Updated wishlist

### DELETE `/wishlists`
Clear entire wishlist
- **Auth**: Required
- **Response**: Empty wishlist

---

## Address Module (`/addresses`)

### POST `/addresses`
Create new address
- **Auth**: Required
- **Body**:
  ```json
  {
    "street": "street address",
    "city": "city",
    "postalCode": "postal code",
    "country": "country",
    "phoneNumber": "phone (optional)",
    "label": "home | office | other",
    "isDefault": false
  }
  ```
- **Response**: Created address
- **Note**: First address is automatically set as default

### GET `/addresses`
Get all user addresses
- **Auth**: Required
- **Response**: Array of addresses (default first)

### GET `/addresses/:addressId`
Get specific address
- **Auth**: Required
- **Params**: `addressId`
- **Response**: Address details

### PATCH `/addresses/:addressId`
Update address
- **Auth**: Required
- **Params**: `addressId`
- **Body**: Any address fields to update
- **Response**: Updated address

### PATCH `/addresses/:addressId/set-default`
Set address as default shipping address
- **Auth**: Required
- **Params**: `addressId`
- **Response**: Updated address
- **Side Effect**: Unsets previous default

### DELETE `/addresses/:addressId`
Delete address
- **Auth**: Required
- **Params**: `addressId`
- **Response**: Deleted address
- **Side Effect**: Sets another address as default if deleted was default

---

## Coupon/Discount Module (`/coupons`)

### POST `/coupons`
Create discount coupon (Admin)
- **Body**:
  ```json
  {
    "code": "SAVE20",
    "discountType": "percentage | fixed",
    "discountValue": 20,
    "validFrom": "2024-01-20T00:00:00Z",
    "validUntil": "2024-12-31T23:59:59Z",
    "maxUses": 100,
    "minOrderAmount": 5000,
    "isActive": true,
    "description": "New Year Sale"
  }
  ```
- **Response**: Created coupon

### GET `/coupons`
Get all coupons
- **Query**: `?isActive=true|false`
- **Response**: Array of coupons

### GET `/coupons/:code`
Get coupon by code
- **Params**: `code`
- **Response**: Coupon details

### POST `/coupons/validate`
Validate coupon for order
- **Body**:
  ```json
  {
    "code": "SAVE20",
    "orderTotal": 10000
  }
  ```
- **Response**:
  ```json
  {
    "coupon": { ...coupon details },
    "discountAmount": 2000,
    "finalTotal": 8000
  }
  ```

### POST `/coupons/apply`
Apply coupon (increments usage)
- **Body**: `{ code: string }`
- **Response**: Updated coupon with incremented currentUses

### PATCH `/coupons/:couponId`
Update coupon (Admin)
- **Params**: `couponId`
- **Body**: Partial coupon fields
- **Response**: Updated coupon

### DELETE `/coupons/:couponId`
Delete coupon (Admin)
- **Params**: `couponId`
- **Response**: Deleted coupon

---

## Data Models Summary

### Cart
```typescript
{
  userId: string (unique)
  items: [
    {
      productId: string
      quantity: number
      price: number
      total: number
    }
  ]
  subtotal: number
  total: number
  createdAt: Date
  updatedAt: Date
}
```

### Order
```typescript
{
  orderId: string (unique, e.g., "ORD-1704196800000-a1b2c3d4")
  userId: string
  items: [
    {
      productId: string
      name: string
      price: number
      quantity: number
      total: number
    }
  ]
  shippingAddress: { street, city, postalCode, country, phoneNumber }
  billingAddress: { street, city, postalCode, country, phoneNumber }
  subtotal: number
  tax: number (5%)
  shippingCost: number (free if subtotal > 5000, else 100)
  discountCode: string (optional)
  discountAmount: number
  total: number
  paymentMethod: string
  paymentStatus: "pending" | "completed" | "failed"
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  updatedAt: Date
}
```

### Review
```typescript
{
  userId: string
  productId: string
  rating: 1-5
  reviewText: string (optional)
  isPublished: boolean
  helpfulCount: number
  createdAt: Date
  updatedAt: Date
  // Composite unique index on (userId, productId)
}
```

### Wishlist
```typescript
{
  userId: string (unique)
  productIds: [string]
  createdAt: Date
  updatedAt: Date
}
```

### Address
```typescript
{
  userId: string
  street: string
  city: string
  postalCode: string
  country: string
  phoneNumber: string (optional)
  label: "home" | "office" | "other"
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Coupon
```typescript
{
  code: string (unique, uppercase)
  discountType: "percentage" | "fixed"
  discountValue: number
  validFrom: Date
  validUntil: Date
  maxUses: number
  currentUses: number (auto-incremented)
  minOrderAmount: number
  isActive: boolean
  description: string (optional)
  createdAt: Date
  updatedAt: Date
}
```

---

## Important Business Logic

1. **Cart → Order**: Cart items are snapshotted to order (prices won't change if product price updates)
2. **Order Totals**: 
   - Tax: 5% of subtotal
   - Shipping: Free if subtotal > 5000, else 100
   - Discount: Applied after tax and shipping
3. **Reviews & Ratings**: Product ratingAverage and ratingCount update when reviews are published/unpublished
4. **Coupons**: 
   - Must be within validFrom/validUntil date range
   - Must not exceed maxUses
   - Order must meet minOrderAmount
5. **Addresses**: Automatically makes first address default; can only have one default at a time
6. **Quantity Checks**: Cart/Order operations check product availability

---

## Error Handling

All endpoints return standard error responses:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description"
}
```

Common status codes:
- **400**: Bad request (validation error, insufficient quantity, etc.)
- **404**: Resource not found
- **401**: Unauthorized (auth required)
- **500**: Server error
