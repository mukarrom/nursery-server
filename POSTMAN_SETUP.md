# Postman Collection Update Guide

Add these folder sections to your Postman collection under the `nursary-shop-server` environment:

## 1. CARTS Folder

### Create/Add to Cart
- **POST** `{{base_url}}/carts/add`
- Headers: `Authorization: Bearer {{token}}`
- Body (form-data or JSON):
  ```json
  {
    "productId": "67xxxxx",
    "quantity": 2
  }
  ```

### Get Cart
- **GET** `{{base_url}}/carts`
- Headers: `Authorization: Bearer {{token}}`

### Update Cart Item
- **PATCH** `{{base_url}}/carts/:productId`
- Headers: `Authorization: Bearer {{token}}`
- Body:
  ```json
  {
    "quantity": 3
  }
  ```

### Remove from Cart
- **DELETE** `{{base_url}}/carts/:productId`
- Headers: `Authorization: Bearer {{token}}`

### Clear Cart
- **DELETE** `{{base_url}}/carts`
- Headers: `Authorization: Bearer {{token}}`

---

## 2. ORDERS Folder

### Create Order
- **POST** `{{base_url}}/orders`
- Headers: `Authorization: Bearer {{token}}`
- Body:
  ```json
  {
    "shippingAddressId": "67xxxxx",
    "discountCode": "SAVE20",
    "paymentMethod": "cash",
    "notes": "Please deliver after 2pm"
  }
  ```

### Get User's Orders
- **GET** `{{base_url}}/orders`
- Headers: `Authorization: Bearer {{token}}`

### Get Order Details
- **GET** `{{base_url}}/orders/:orderId`
- Headers: `Authorization: Bearer {{token}}`

### Update Order Status
- **PATCH** `{{base_url}}/orders/:orderId/status`
- Headers: `Authorization: Bearer {{token}}`
- Body:
  ```json
  {
    "orderStatus": "processing"
  }
  ```

---

## 3. ADDRESSES Folder

### Create Address
- **POST** `{{base_url}}/addresses`
- Headers: `Authorization: Bearer {{token}}`
- Body:
  ```json
  {
    "street": "123 Main Street",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA",
    "phoneNumber": "+1-555-0123",
    "label": "home",
    "isDefault": false
  }
  ```

### Get All Addresses
- **GET** `{{base_url}}/addresses`
- Headers: `Authorization: Bearer {{token}}`

### Get Address
- **GET** `{{base_url}}/addresses/:addressId`
- Headers: `Authorization: Bearer {{token}}`

### Update Address
- **PATCH** `{{base_url}}/addresses/:addressId`
- Headers: `Authorization: Bearer {{token}}`
- Body: Any fields to update

### Set Default Address
- **PATCH** `{{base_url}}/addresses/:addressId/set-default`
- Headers: `Authorization: Bearer {{token}}`

### Delete Address
- **DELETE** `{{base_url}}/addresses/:addressId`
- Headers: `Authorization: Bearer {{token}}`

---

## 4. REVIEWS Folder

### Create Review
- **POST** `{{base_url}}/reviews`
- Headers: `Authorization: Bearer {{token}}`
- Body:
  ```json
  {
    "productId": "67xxxxx",
    "rating": 5,
    "reviewText": "Great product! Highly recommend.",
    "isPublished": false
  }
  ```

### Get Product Reviews
- **GET** `{{base_url}}/reviews/product/:productId`
- No auth required

### Get My Reviews
- **GET** `{{base_url}}/reviews`
- Headers: `Authorization: Bearer {{token}}`

### Publish Review
- **PATCH** `{{base_url}}/reviews/:reviewId/publish`
- Headers: `Authorization: Bearer {{token}}`

### Unpublish Review
- **PATCH** `{{base_url}}/reviews/:reviewId/unpublish`
- Headers: `Authorization: Bearer {{token}}`

### Mark as Helpful
- **PATCH** `{{base_url}}/reviews/:reviewId/helpful`
- No auth required

### Delete Review
- **DELETE** `{{base_url}}/reviews/:reviewId`
- Headers: `Authorization: Bearer {{token}}`

---

## 5. WISHLISTS Folder

### Get Wishlist
- **GET** `{{base_url}}/wishlists`
- Headers: `Authorization: Bearer {{token}}`

### Add to Wishlist
- **POST** `{{base_url}}/wishlists/add`
- Headers: `Authorization: Bearer {{token}}`
- Body:
  ```json
  {
    "productId": "67xxxxx"
  }
  ```

### Check if in Wishlist
- **GET** `{{base_url}}/wishlists/check/:productId`
- Headers: `Authorization: Bearer {{token}}`

### Remove from Wishlist
- **DELETE** `{{base_url}}/wishlists/:productId`
- Headers: `Authorization: Bearer {{token}}`

### Clear Wishlist
- **DELETE** `{{base_url}}/wishlists`
- Headers: `Authorization: Bearer {{token}}`

---

## 6. COUPONS Folder

### Create Coupon (Admin)
- **POST** `{{base_url}}/coupons`
- Headers: `Authorization: Bearer {{admin_token}}`
- Body:
  ```json
  {
    "code": "SAVE20",
    "discountType": "percentage",
    "discountValue": 20,
    "validFrom": "2024-01-20T00:00:00Z",
    "validUntil": "2024-12-31T23:59:59Z",
    "maxUses": 100,
    "minOrderAmount": 5000,
    "isActive": true,
    "description": "20% off on all products"
  }
  ```

### Get All Coupons
- **GET** `{{base_url}}/coupons`
- Query params: `?isActive=true`

### Get Coupon by Code
- **GET** `{{base_url}}/coupons/:code`

### Validate Coupon
- **POST** `{{base_url}}/coupons/validate`
- Body:
  ```json
  {
    "code": "SAVE20",
    "orderTotal": 10000
  }
  ```

### Apply Coupon
- **POST** `{{base_url}}/coupons/apply`
- Body:
  ```json
  {
    "code": "SAVE20"
  }
  ```

### Update Coupon (Admin)
- **PATCH** `{{base_url}}/coupons/:couponId`
- Headers: `Authorization: Bearer {{admin_token}}`
- Body: Fields to update

### Delete Coupon (Admin)
- **DELETE** `{{base_url}}/coupons/:couponId`
- Headers: `Authorization: Bearer {{admin_token}}`

---

## Postman Environment Variables

Make sure your Postman environment has these variables:

```json
{
  "base_url": "http://localhost:5000/api",
  "token": "your_jwt_token_here",
  "admin_token": "admin_jwt_token_here"
}
```

---

## Testing Flow

### Complete Purchase Flow:
1. Add products to cart (POST /carts/add)
2. View cart (GET /carts)
3. Create address if needed (POST /addresses)
4. Create order (POST /orders with addressId and optional coupon)
5. View order (GET /orders/:orderId)

### Review Flow:
1. Create review (POST /reviews)
2. Publish review (PATCH /reviews/:reviewId/publish)
3. View product reviews (GET /reviews/product/:productId)

### Wishlist Flow:
1. Add to wishlist (POST /wishlists/add)
2. View wishlist (GET /wishlists)
3. Remove from wishlist (DELETE /wishlists/:productId)
