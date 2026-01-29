# Postman Collections Index

Quick reference for all available Postman collection files in the Nursery Bazar BD API.

## 📦 Module Collections (16)

| # | Collection File | Module | Endpoints | Description |
|---|----------------|---------|-----------|-------------|
| 1 | `Authentication.postman_collection.json` | Auth | 5 | User authentication and authorization |
| 2 | `Users.postman_collection.json` | Users | 4 | User profile management |
| 3 | `Categories.postman_collection.json` | Categories | 5 | Product category management |
| 4 | `Products.postman_collection.json` | Products | 6 | Product catalog management |
| 5 | `Cart.postman_collection.json` | Cart | 5 | Shopping cart operations |
| 6 | `Orders.postman_collection.json` | Orders | 6 | Order management |
| 7 | `Addresses.postman_collection.json` | Addresses | 6 | Delivery addresses |
| 8 | `Coupons.postman_collection.json` | Coupons | 6 | Promotional coupons |
| 9 | `Reviews.postman_collection.json` | Reviews | 6 | Product reviews |
| 10 | `Wishlist.postman_collection.json` | Wishlist | 5 | User wishlist |
| 11 | `Carousels.postman_collection.json` | Carousels | 4 | Homepage carousels |
| 12 | `Flash_Sales.postman_collection.json` | Flash Sales | 5 | Flash sale campaigns |
| 13 | `Contacts.postman_collection.json` | Contacts | 4 | Contact methods |
| 14 | `Payment_Methods.postman_collection.json` | Payment | 5 | Payment methods |
| 15 | `Transactions.postman_collection.json` | Transactions | 6 | Payment transactions |
| 16 | `Tests.postman_collection.json` | Tests | 2 | API health checks |

## 🎯 Special Collections

| Collection File | Purpose |
|----------------|---------|
| `Avatar_Module_Snippet.json` | Avatar management endpoints (new module) |
| `Nursery Bazar BD.postman_collection.json` | Complete combined collection with all modules |

## 🚀 Quick Start

### Option 1: Import Individual Collections

```bash
# Import only the collections you need
- Authentication.postman_collection.json (required for token)
- Products.postman_collection.json
- Cart.postman_collection.json
```

### Option 2: Import All Collections

```bash
# Import all 16 module collections at once
Import all *.postman_collection.json files
```

### Option 3: Use Combined Collection

```bash
# Import the complete collection
Nursery Bazar BD.postman_collection.json
```

## 📊 Collection Stats

- **Total Collections**: 18 files
- **Module Collections**: 16
- **Special Collections**: 2
- **Total Endpoints**: ~80+
- **Public Endpoints**: ~20
- **Protected Endpoints**: ~60
- **Admin Only**: ~30

## 🔑 Authentication Requirements

### Public (No Auth)

- Get All Products
- Get Product by ID
- Get All Categories
- Get Category by ID
- Get All Avatars
- Health Check

### User Auth Required

- Cart operations
- Order creation
- Profile management
- Reviews
- Wishlist
- Addresses

### Admin Only

- Create/Update/Delete Products
- Create/Update/Delete Categories
- Manage Coupons
- Update Order Status
- Manage Carousels
- Manage Flash Sales
- Manage Payment Methods
- Update Transaction Status

## 📁 File Structure

```
postman/collections/
├── README.md                                      # Detailed documentation
├── INDEX.md                                       # This file
├── Nursery Bazar BD.postman_collection.json      # Complete collection
├── Avatar_Module_Snippet.json                    # Avatar module
├── Authentication.postman_collection.json        # Auth endpoints
├── Users.postman_collection.json                 # User management
├── Categories.postman_collection.json            # Categories
├── Products.postman_collection.json              # Products
├── Cart.postman_collection.json                  # Shopping cart
├── Orders.postman_collection.json                # Orders
├── Addresses.postman_collection.json             # Addresses
├── Coupons.postman_collection.json               # Coupons
├── Reviews.postman_collection.json               # Reviews
├── Wishlist.postman_collection.json              # Wishlist
├── Carousels.postman_collection.json             # Carousels
├── Flash_Sales.postman_collection.json           # Flash sales
├── Contacts.postman_collection.json              # Contacts
├── Payment_Methods.postman_collection.json       # Payment methods
├── Transactions.postman_collection.json          # Transactions
└── Tests.postman_collection.json                 # Health checks
```

## 🎨 Environment Variables

Required environment variables for all collections:

```json
{
  "baseUrl": "http://localhost:5000/api/v1",
  "token": "<auto-populated-after-login>"
}
```

Optional variables:

```json
{
  "userId": "<user-id>",
  "productId": "<product-id>",
  "orderId": "<order-id>",
  "categoryId": "<category-id>"
}
```

## 💡 Usage Tips

1. **Start with Authentication**: Always import `Authentication.postman_collection.json` first
2. **Set Environment**: Configure baseUrl before testing
3. **Login First**: Run login endpoint to get authentication token
4. **Token Auto-Save**: Token is automatically saved to environment
5. **Modular Testing**: Import only collections you need for focused testing

## 🔄 Updates

- **January 29, 2026**: Initial separation of collections from main file
- **January 29, 2026**: Added Avatar module snippet
- All collections use Postman Collection v2.1.0 format

---

**Maintained by**: Nursery Bazar BD Development Team  
**For**: Flutter Mobile App Integration
