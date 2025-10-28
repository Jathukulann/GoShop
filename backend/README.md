# GoShop Backend API

This is the backend server for the GoShop e-commerce application. Built with Node.js, Express, and MongoDB.

## What's Inside

The backend handles everything from user authentication to product management, shopping cart, and orders. It's a REST API that the React frontend talks to.

## Tech Stack

- **Node.js & Express** - Server and routing
- **MongoDB & Mongoose** - Database
- **JWT** - For authentication tokens
- **bcrypt** - Password hashing
- **Cloudinary** - Image hosting for product images and user avatars
- **Nodemailer** - Sending order confirmation emails
- **Multer** - Handling file uploads

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the backend folder with these variables:

```
PORT=5001
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

**Important Notes:**
- For Gmail, you need to generate an "App Password" from your Google Account settings
- For Cloudinary, sign up at cloudinary.com and get your credentials from the dashboard
- You can use MongoDB Atlas (free) or run MongoDB locally

### 3. Seed the Database

Optional but recommended - adds 20+ sample products:

```bash
node seedProducts.js
```

### 4. Start the Server

```bash
npm run dev
```

Server will run on http://localhost:5001

## API Routes

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset email
- `PUT /api/auth/reset-password/:token` - Reset password with token

### Users (Protected)
- `GET /api/users/profile` - Get your profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password
- `PUT /api/users/avatar` - Upload profile picture

### Products
- `GET /api/products` - Get all products (supports filtering, search, pagination)
- `GET /api/products/:id` - Get single product details

### Cart
- `GET /api/cart` - Get your cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart
- `POST /api/cart/merge` - Merge guest cart with user cart (happens automatically on login)

### Orders (Protected)
- `POST /api/orders` - Create new order (place order)
- `GET /api/orders/my-orders` - Get all your orders
- `GET /api/orders/:id` - Get specific order details
- `PUT /api/orders/:id/cancel` - Cancel an order

## Project Structure

```
backend/
├── config/          - Database, Cloudinary, Email configs
├── controllers/     - Business logic for each route
├── middleware/      - Auth, file upload, error handling
├── models/          - MongoDB schemas (User, Product, Cart, Order)
├── routes/          - API endpoints
├── utils/           - Helper functions (email, token generation)
├── seedProducts.js  - Script to populate database with sample products
└── server.js        - Main entry point
```

## Features Implemented

- User registration and login with JWT
- Password reset via email
- Product catalog with search and filters
- Multiple filters can work together (category + size + price)
- Pagination support
- Guest cart (you can add items without logging in)
- Cart merges automatically when you login
- Checkout and order placement
- Order confirmation emails
- Order history
- Cancel orders (stock gets restored)
- Profile management with avatar upload

## How Some Things Work

### Guest Cart
When you're not logged in, a session ID is generated and your cart is saved with that session. When you log in, the guest cart automatically merges with your user cart.

### Filters & Search
You can filter products by:
- Category (Men/Women/Kids)
- Size (S/M/L/XL)
- Price range (min and max)
- Search text (searches in name and description)

All filters work together, and pagination is maintained.

### Stock Management
When you place an order, product stock decreases. If you cancel an order, stock is restored. This keeps inventory accurate.

### Emails
Two types of emails are sent:
1. Welcome email when you register (non-blocking, happens in background)
2. Order confirmation with full order details when you place an order

## Common Issues

**MongoDB Connection Failed**
- Make sure MongoDB is running locally, or check your MongoDB Atlas connection string

**Email Not Sending**
- Verify you're using a Gmail "App Password" not your regular password
- Make sure 2-Step Verification is enabled on your Google account

**Cloudinary Upload Failed**
- Check your Cloudinary credentials are correct
- Make sure you're using the right cloud name, API key, and secret

**Port Already in Use**
- Change the PORT in your .env file to something else like 5002

## Testing the API

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- curl commands
- Or just use the React frontend (recommended)

## Notes

- Passwords are hashed with bcrypt before storing
- JWT tokens expire after 7 days
- Reset password tokens expire after 10 minutes
- Mock payment system (orders auto-approve, no real payment gateway)
- Images are hosted on Cloudinary CDN
- Shipping: ₹40 (free for orders above ₹500)
- Tax: 18% GST applied to all orders

## Development

The code follows MVC pattern with clear separation:
- Models handle database structure
- Controllers handle business logic
- Routes define endpoints
- Middleware handles auth and validation

Error handling is centralized using an error handler middleware.
