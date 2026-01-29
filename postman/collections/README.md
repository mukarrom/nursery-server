# Postman Collections

This directory contains separate Postman collection files for each module of the Nursery Bazar BD API.

## Collections Overview

### 1. Authentication.postman_collection.json

User authentication and authorization endpoints

- Sign Up
- Login
- Forgot Password
- Reset Password
- Change Password

### 2. Users.postman_collection.json

User profile management endpoints

- Get Profile
- Update Profile
- Get All Users (Admin)
- Update User Role (Admin)

### 3. Categories.postman_collection.json

Product category management

- Get All Categories
- Get Category by ID
- Create Category (Admin)
- Update Category (Admin)
- Delete Category (Admin)

### 4. Products.postman_collection.json

Product catalog management

- Get All Products
- Get Product by ID
- Create Product (Admin)
- Update Product (Admin)
- Delete Product (Admin)
- Get Products by Tags

### 5. Cart.postman_collection.json

Shopping cart operations

- Get My Cart
- Add to Cart
- Update Cart Item Quantity
- Remove from Cart
- Clear Cart

### 6. Orders.postman_collection.json

Order management and processing

- Create Order
- Get My Orders
- Get Order by ID
- Get All Orders (Admin)
- Update Order Status (Admin)
- Cancel Order

### 7. Addresses.postman_collection.json

Delivery address management

- Get My Addresses
- Create Address
- Get Address by ID
- Update Address
- Delete Address
- Set Default Address

### 8. Coupons.postman_collection.json

Promotional coupon management

- Get All Coupons
- Get Coupon by Code
- Create Coupon (Admin)
- Update Coupon (Admin)
- Delete Coupon (Admin)
- Validate Coupon

### 9. Reviews.postman_collection.json

Product review and rating system

- Create Review
- Get Product Reviews
- Get My Reviews
- Update Review
- Delete Review
- Publish/Unpublish Review

### 10. Wishlist.postman_collection.json

User wishlist functionality

- Get My Wishlist
- Add to Wishlist
- Remove from Wishlist
- Clear Wishlist
- Check if Product in Wishlist

### 11. Carousels.postman_collection.json

Homepage carousel management

- Get All Carousels
- Create Carousel (Admin)
- Update Carousel (Admin)
- Delete Carousel (Admin)

### 12. Flash_Sales.postman_collection.json

Flash sale campaign management

- Get Active Flash Sales
- Get All Flash Sales
- Create Flash Sale (Admin)
- Update Flash Sale (Admin)
- Delete Flash Sale (Admin)

### 13. Contacts.postman_collection.json

Contact method management (WhatsApp, Imo, etc.)

- Get All Contacts
- Create Contact (Admin)
- Update Contact (Admin)
- Delete Contact (Admin)

### 14. Payment_Methods.postman_collection.json

Payment method configuration

- Get All Payment Methods
- Get Payment Method by ID
- Create Payment Method (Admin)
- Update Payment Method (Admin)
- Delete Payment Method (Admin)

### 15. Transactions.postman_collection.json

Payment transaction tracking

- Create Transaction
- Get My Transactions
- Get All Transactions (Admin)
- Get Transaction by ID
- Update Transaction Status (Admin)
- Get Transaction by Order ID

### 16. Tests.postman_collection.json

API health checks and testing endpoints

- Health Check
- Database Connection Test

## Additional Files

### Avatar_Module_Snippet.json

Avatar management endpoints (to be integrated)

- Create Avatar (Admin)
- Get All Avatars
- Get Avatar by ID
- Update Avatar (Admin)
- Delete Avatar (Admin)

### Nursery Bazar BD.postman_collection.json

Complete combined collection with all modules

## How to Use

### Import Individual Collection

1. Open Postman
2. Click **Import**
3. Select the desired collection file (e.g., `Products.postman_collection.json`)
4. Click **Import**

### Import All Collections

1. Open Postman
2. Click **Import**
3. Select all `.postman_collection.json` files
4. Click **Import**

### Environment Setup

Make sure to set up your Postman environment with these variables:

- `baseUrl` - API base URL (e.g., `http://localhost:5000/api/v1`)
- `token` - JWT authentication token (automatically set after login)

## Collection Organization

Each collection is:

- ✅ Self-contained with all module endpoints
- ✅ Properly formatted JSON (Postman Collection v2.1.0)
- ✅ Includes request examples and response samples
- ✅ Contains authentication configuration where needed
- ✅ Has unique collection ID for tracking

## Benefits of Separate Collections

1. **Focused Testing**: Test specific modules without clutter
2. **Team Collaboration**: Share only relevant collections with team members
3. **Easier Maintenance**: Update individual modules independently
4. **Better Organization**: Cleaner workspace in Postman
5. **Selective Import**: Import only the collections you need

## Testing Workflow

### Basic Flow

1. Import `Authentication.postman_collection.json`
2. Run **Login** request to get token
3. Token automatically saved to environment
4. Import other collections as needed
5. Test endpoints with authenticated token

### Admin Flow

1. Login as Admin
2. Test admin-only endpoints in:
   - Categories
   - Products
   - Coupons
   - Orders (status updates)
   - Carousels
   - Flash Sales
   - Contacts
   - Payment Methods
   - Transactions

### User Flow

1. Login as User
2. Test user endpoints:
   - Products (browse)
   - Cart
   - Orders (create/view)
   - Reviews
   - Wishlist
   - Addresses

## Notes

- All admin endpoints require authentication with Admin or Super Admin role
- User endpoints require valid JWT token
- Some endpoints are public (no authentication required)
- File uploads use multipart/form-data
- Query parameters support pagination, filtering, and sorting

---

**Last Updated**: January 29, 2026  
**Total Collections**: 17 (16 modules + 1 combined)  
**Postman Version**: v2.1.0
