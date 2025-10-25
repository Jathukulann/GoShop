# GoShop Backend - Authentication System

## Overview
Complete authentication and user profile management system built with Node.js, Express, MongoDB, JWT, Cloudinary, and Nodemailer.

## Features Implemented

### Authentication
- ✅ User Registration with email verification
- ✅ User Login with JWT token
- ✅ Logout functionality
- ✅ Forgot Password with email reset link
- ✅ Reset Password with token validation
- ✅ Secure password hashing with bcrypt
- ✅ JWT-based authentication

### User Profile Management
- ✅ Get user profile (protected)
- ✅ Update user profile (name, email)
- ✅ Update password with old password verification
- ✅ Upload/Update avatar to Cloudinary

### Email Notifications
- ✅ Welcome email on registration
- ✅ Password reset email with link
- ✅ Password reset confirmation email

## Project Structure

```
backend/
├── config/
│   ├── db.js                  # MongoDB connection
│   ├── cloudinary.js          # Cloudinary configuration
│   └── nodemailer.js          # Email configuration
├── models/
│   └── User.js                # User schema with methods
├── controllers/
│   ├── authController.js      # Authentication logic
│   └── userController.js      # User profile management
├── routes/
│   ├── authRoutes.js          # Auth endpoints
│   └── userRoutes.js          # User endpoints
├── middleware/
│   ├── auth.js                # JWT verification & admin check
│   ├── errorHandler.js        # Global error handling
│   └── upload.js              # Multer file upload
├── utils/
│   ├── sendEmail.js           # Email utility & templates
│   └── generateToken.js       # JWT token generation
├── .env                       # Environment variables
├── .env.example               # Environment template
├── server.js                  # Express server setup
└── package.json               # Dependencies
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| POST | `/logout` | Logout user | Private |
| POST | `/forgot-password` | Request password reset | Public |
| PUT | `/reset-password/:resetToken` | Reset password | Public |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/profile` | Get user profile | Private |
| PUT | `/profile` | Update user profile | Private |
| PUT | `/password` | Update password | Private |
| PUT | `/avatar` | Upload/update avatar | Private |

### Health Check

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/health` | Server health check | Public |

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/goshop

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend URL
CLIENT_URL=http://localhost:5173
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup MongoDB:**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGO_URI` in `.env`

3. **Setup Cloudinary:**
   - Create account at https://cloudinary.com
   - Get your credentials from dashboard
   - Update Cloudinary variables in `.env`

4. **Setup Email (Gmail):**
   - Enable 2-Factor Authentication on Gmail
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Update `SMTP_USER` and `SMTP_PASS` in `.env`

5. **Generate JWT Secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Update `JWT_SECRET` in `.env`

6. **Start the server:**
   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

## Testing the API

### 1. Register a New User

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": {
      "public_id": null,
      "url": null
    }
  }
}
```

### 2. Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Get Profile (Protected)

```bash
GET http://localhost:5000/api/users/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

### 4. Update Profile

```bash
PUT http://localhost:5000/api/users/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

### 5. Update Password

```bash
PUT http://localhost:5000/api/users/password
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

### 6. Upload Avatar

```bash
PUT http://localhost:5000/api/users/avatar
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

avatar: [image file]
```

### 7. Forgot Password

```bash
POST http://localhost:5000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### 8. Reset Password

```bash
PUT http://localhost:5000/api/auth/reset-password/RESET_TOKEN_FROM_EMAIL
Content-Type: application/json

{
  "password": "newpassword123"
}
```

## Security Features

1. **Password Hashing**: Using bcryptjs with salt rounds
2. **JWT Authentication**: Secure token-based authentication
3. **HTTP-Only Cookies**: Tokens stored in HTTP-only cookies
4. **CORS Protection**: Configured for specific origins
5. **Input Validation**: Server-side validation for all inputs
6. **Error Handling**: Comprehensive error handling middleware
7. **Token Expiration**: Reset tokens expire in 10 minutes
8. **Role-Based Access**: Admin middleware for future admin routes

## User Model Schema

```javascript
{
  name: String (required, max 50 chars),
  email: String (required, unique, validated),
  password: String (required, min 6 chars, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  avatar: {
    public_id: String,
    url: String
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  timestamps: true (createdAt, updatedAt)
}
```

## Error Handling

All errors return in this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

## Next Steps

### Phase 2: Product Management
- [ ] Create Product model
- [ ] Implement product CRUD operations
- [ ] Add search and filtering
- [ ] Implement pagination
- [ ] Add product image upload

### Phase 3: Shopping Cart
- [ ] Create Cart model
- [ ] Implement cart operations
- [ ] Guest cart functionality
- [ ] Merge guest cart on login

### Phase 4: Orders & Payment
- [ ] Create Order model
- [ ] Implement checkout flow
- [ ] Razorpay integration
- [ ] Order confirmation emails

### Phase 5: Admin Dashboard
- [ ] Admin statistics
- [ ] User management
- [ ] Order management
- [ ] Product management

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email sending
- **Cloudinary** - Image storage
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## Author

Built following MERN stack best practices for GoShop E-Commerce Application.

## License

ISC
