# Nursery Bazar BD - E-Commerce Server

Professional REST API server for Nursery Bazar BD e-commerce platform, built with Express, TypeScript, and MongoDB. Designed for seamless integration with Flutter mobile applications.

## 🚀 Features

- **User Management**: Authentication, registration, email verification, password reset
- **Avatar Management**: Admin-managed avatar library for user profiles
- **Product Catalog**: Browse, search, filter plants and gardening products
- **Shopping Cart**: Add/remove items with quantity management
- **Orders & Checkout**: Complete order processing with multiple payment options
- **Payment System**: Admin-managed payment methods with manual transaction verification
- **Transaction History**: Track payment transactions for users and admins
- **Wishlist**: Save favorite products for later
- **Reviews & Ratings**: User-generated product reviews with helpfulness tracking
- **Coupons & Discounts**: Promotional code management with flexible discount types
- **Address Management**: Multiple delivery address support with defaults
- **Category Management**: Organized product categories and flash sales
- **Admin Panel**: Complete order, transaction, and payment method management

## 🛠️ Tech Stack

- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod runtime schema validation
- **Authentication**: JWT Bearer tokens
- **Deployment**: Vercel with GitHub Actions CI/CD
- **File Upload**: Cloudinary integration for product images
- **Email**: Email service for notifications and password recovery

## 📁 Project Structure

```
nursery-bazar-bd/
├── src/
│   ├── app.ts                          # Express app configuration
│   ├── server.ts                       # Server entry point
│   ├── config/                         # Configuration files
│   ├── DB/                             # Database connection
│   ├── constants/                      # Application constants
│   ├── errors/                         # Error handlers
│   ├── interface/                      # TypeScript interfaces
│   ├── middlewares/                    # Express middlewares
│   ├── modules/                        # Feature modules
│   │   ├── address/                    # Address management
│   │   ├── auth/                       # Authentication
│   │   ├── avatar/                     # Avatar management
│   │   ├── carousel/                   # Carousel management
│   │   ├── cart/                       # Shopping cart
│   │   ├── category/                   # Product categories
│   │   ├── coupon/                     # Discounts & coupons
│   │   ├── flash-sale/                 # Flash sale campaigns
│   │   ├── order/                      # Order management
│   │   ├── payment-method/             # Payment methods
│   │   ├── products/                   # Product catalog
│   │   ├── review/                     # Reviews & ratings
│   │   ├── transaction/                # Payment transactions
│   │   ├── users/                      # User management
│   │   └── wishlist/                   # Wishlist functionality
│   ├── public/                         # Static files & email templates
│   ├── routes/                         # API route registry
│   ├── types/                          # Global TypeScript types
│   └── utils/                          # Utility functions
├── documentations/                     # API documentation
├── .github/workflows/                  # CI/CD workflows
├── vercel.json                         # Vercel deployment config
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # Dependencies & scripts
└── README.md                           # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- npm or pnpm package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nursery-shop-server

# Install dependencies
npm install
# or
pnpm install

# Create .env file with your configuration
cp .env.example .env

# Update .env with your database and API keys
```

### Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/nursery-shop

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Service
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASSWORD=your-password

# Server
PORT=5000
NODE_ENV=development
```

### Running the Server

```bash
# Development with hot reload
npm run dev

# Production build
npm run build
npm start

# Run tests
npm test
```

## 📚 API Documentation

Complete API documentation is available in [documentations/API_DOCUMENTATION.md](./documentations/API_DOCUMENTATION.md).

### Quick API Overview

**Base URL**: `https://api.example.com/api/v1`

#### Authentication

```
Header: Authorization: Bearer <jwt_token>
```

#### Main Endpoints

- **Users**: `/users` - Profile, registration, email verification
- **Avatars**: `/avatars` - Avatar management for user profiles
- **Products**: `/products` - Browse and search products
- **Cart**: `/carts` - Shopping cart operations
- **Orders**: `/orders` - Order creation and management
- **Payment Methods**: `/payment-methods` - Admin payment method management
- **Transactions**: `/transactions` - Payment transaction tracking
- **Reviews**: `/reviews` - Product reviews and ratings
- **Wishlist**: `/wishlists` - Save favorite products
- **Addresses**: `/addresses` - Delivery address management
- **Coupons**: `/coupons` - Promotional codes
- **Categories**: `/categories` - Product categories
- **Carousel**: `/carousel` - Marketing carousel items
- **Contacts**: `/contacts` - Admin contact methods (WhatsApp, Imo, etc.)

## 💳 Payment System

The payment system supports manual payment verification without SDK integration:

1. **Admin** creates payment methods (bKash, Nagad, Rocket, etc.)
2. **User** selects a payment method during checkout
3. **User** completes manual payment and submits transaction ID
4. **Admin** verifies the transaction and updates payment status
5. **Order** payment status updates automatically
6. Both users and admins can view transaction history

## 🛒 Selective Product Ordering

Users have full control over their shopping experience:

- **Add to Cart**: Add products with desired quantities
- **Review Cart**: View all items in cart
- **Selective Checkout**: Choose specific products to order (not forced to order all)
- **Remaining Items**: Unselected products stay in cart for future purchase
- **Flexible Shopping**: Users can place multiple partial orders from the same cart
- **Smart Pricing**: Discounts and shipping costs calculated only for selected items

See [API Documentation](./documentations/API_DOCUMENTATION.md) for detailed usage.

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (USER, ADMIN)
- Input validation with Zod schemas
- Error handling with secure messages
- Environment variable protection
- Mongoose data validation
- Unique constraints and indexing

## 📦 Deployment

### Vercel Deployment

The project includes automatic deployment configuration:

```bash
# Push to main branch to trigger deployment
git push origin main
```

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

## 🤝 Integration with Flutter

This server is designed for seamless mobile integration. The Flutter app communicates via REST API with Bearer token authentication.

### Example Flutter Integration

```dart
final response = await http.get(
  Uri.parse('https://api.example.com/api/v1/products'),
  headers: {'Authorization': 'Bearer $token'},
);
```

## 📋 Available Scripts

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📞 Support & Documentation

- **API Documentation**: See [documentations/API_DOCUMENTATION.md](./documentations/API_DOCUMENTATION.md)
- **Deployment Guide**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **Issues**: Submit issues to the repository

## 👥 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔧 Troubleshooting

### Database Connection Issues

- Verify MongoDB URI in `.env`
- Check network access in MongoDB Atlas
- Ensure IP address is whitelisted

### Authentication Errors

- Verify JWT_SECRET is set in `.env`
- Check Bearer token format: `Authorization: Bearer <token>`
- Ensure token hasn't expired

### File Upload Issues

- Verify Cloudinary credentials in `.env`
- Check file size limits
- Ensure file type is supported

For more help, refer to the [API Documentation](./documentations/API_DOCUMENTATION.md) or submit an issue.

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Status**: Production Ready
