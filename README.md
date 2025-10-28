# GoShop - Clothing Brand E-Commerce Application

A full-stack e-commerce web application for a clothing brand built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User authentication (Register, Login, JWT-based auth)
- Product catalog with search, filtering, and pagination
- Shopping cart (works for both guests and logged-in users)
- Checkout process with mock payment
- Order management and history
- Email notifications for order confirmation
- User profile management with avatar upload

## Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email notifications
- **Cloudinary** - Image hosting
- **Multer** - File uploads

### Frontend
- **React** (via Vite) - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - HTTP client

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Gmail account** (for email notifications)
- **Cloudinary account** (for image uploads)

## Installation & Setup

### 1. Clone the Repository

```bash
cd GoShop
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Note for Gmail:** You need to generate an "App Password" from your Google Account settings (Security > 2-Step Verification > App Passwords).

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5001
```

### 4. Seed Database (Optional)

To populate the database with sample products:

```bash
cd backend
node seedProducts.js
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on: `http://localhost:5001`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password

### Products
- `GET /api/products` - Get all products (with filters & pagination)
- `GET /api/products/:id` - Get single product

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/merge` - Merge guest cart with user cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

### Users (Protected Routes)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Update password
- `PUT /api/users/avatar` - Upload avatar

## Project Structure

```
GoShop/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── redux/       # Redux store & slices
│   │   ├── services/    # API services
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── index.html
└── README.md
```

## Default Test Credentials

After seeding, you can register a new account or use:
- **Email:** Any valid email
- **Password:** Minimum 6 characters

## Features Implemented

✅ User registration and authentication with JWT
✅ Password hashing with bcrypt
✅ Product catalog with 20+ items
✅ Search by name/description
✅ Filter by category (Men/Women/Kids), size, and price range
✅ Multiple filters working together
✅ Pagination (?page=1&limit=10)
✅ Add to cart with size selection
✅ Guest cart functionality
✅ Cart management (add, update, remove items)
✅ Mock checkout process
✅ Order creation and storage in MongoDB
✅ Order confirmation email with Nodemailer
✅ Order history and details
✅ Order cancellation with stock restoration
✅ User profile management
✅ Avatar upload with Cloudinary

## Notes

- Frontend uses **Vite** as the build tool (modern alternative to Create React App)
- Mock payment system - orders are automatically approved
- Email notifications require valid Gmail credentials
- Images are hosted on Cloudinary
- Cart persists for guests using session ID
- Shipping fee: ₹40 (free for orders above ₹500)
- Tax: 18% GST applied to all orders

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or check your MongoDB Atlas connection string
- Verify the `MONGO_URI` in `.env` is correct

### Email Not Sending
- Verify Gmail credentials in `.env`
- Make sure you're using an "App Password", not your regular Gmail password
- Check if 2-Step Verification is enabled on your Google account

### Port Already in Use
- Backend: Change `PORT` in backend `.env`
- Frontend: Vite will automatically suggest an alternative port

## Contact

For any questions or issues, please contact me.

---

**Built with ❤️ as part of Backend Developer Role Assessment**
