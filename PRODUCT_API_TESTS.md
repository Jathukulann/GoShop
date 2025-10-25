# Product API Tests

## Setup
Base URL: `http://localhost:5001/api`

Admin credentials (created by seeder):
- Email: admin@goshop.com
- Password: admin123

---

## 1. Get All Products (Public)
```bash
curl http://localhost:5001/api/products
```

## 2. Get Products with Pagination
```bash
curl "http://localhost:5001/api/products?page=1&limit=5"
```

## 3. Search Products
```bash
curl "http://localhost:5001/api/products?search=shirt"
```

## 4. Filter by Category
```bash
curl "http://localhost:5001/api/products?category=Men"
```

## 5. Filter by Subcategory
```bash
curl "http://localhost:5001/api/products?category=Women&subcategory=Dresses"
```

## 6. Filter by Size
```bash
curl "http://localhost:5001/api/products?size=M"
```

## 7. Filter by Price Range
```bash
curl "http://localhost:5001/api/products?minPrice=50&maxPrice=100"
```

## 8. Sort by Price (Ascending)
```bash
curl "http://localhost:5001/api/products?sort=price_asc"
```

## 9. Sort by Price (Descending)
```bash
curl "http://localhost:5001/api/products?sort=price_desc"
```

## 10. Get Featured Products
```bash
curl http://localhost:5001/api/products/featured
```

## 11. Combined Filters (Category + Size + Price Range)
```bash
curl "http://localhost:5001/api/products?category=Men&size=L&minPrice=30&maxPrice=80"
```

## 12. Get Single Product by ID
First, get a product ID from the list, then:
```bash
curl http://localhost:5001/api/products/{PRODUCT_ID}
```

---

## Admin-Only Tests (Requires Authentication)

### Step 1: Login as Admin
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@goshop.com",
    "password": "admin123"
  }'
```
Save the token from the response.

### Step 2: Create New Product (Admin)
```bash
curl -X POST http://localhost:5001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test Product",
    "description": "This is a test product created via API",
    "price": 49.99,
    "category": "Men",
    "subcategory": "T-Shirts",
    "sizes": ["S", "M", "L"],
    "colors": ["Red", "Blue"],
    "stock": 50,
    "isFeatured": false,
    "images": []
  }'
```

### Step 3: Update Product (Admin)
```bash
curl -X PUT http://localhost:5001/api/products/{PRODUCT_ID} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Updated Product Name",
    "price": 59.99
  }'
```

### Step 4: Delete Product (Admin)
```bash
curl -X DELETE http://localhost:5001/api/products/{PRODUCT_ID} \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## User Tests (Requires Authentication)

### Step 1: Register a Regular User
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Step 2: Login and Get Token
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }'
```

### Step 3: Create Product Review
```bash
curl -X POST http://localhost:5001/api/products/{PRODUCT_ID}/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_USER_TOKEN_HERE" \
  -d '{
    "rating": 5,
    "comment": "Great product! Highly recommended."
  }'
```

---

## Expected Results Summary

✅ **GET /api/products** - Returns all active products with pagination
✅ **GET /api/products?search=** - Returns products matching search term
✅ **GET /api/products?category=** - Returns filtered products
✅ **GET /api/products?size=** - Returns products with specified size
✅ **GET /api/products?minPrice=&maxPrice=** - Returns products in price range
✅ **GET /api/products?sort=** - Returns sorted products
✅ **GET /api/products/featured** - Returns featured products only
✅ **GET /api/products/:id** - Returns single product with reviews
✅ **POST /api/products** (Admin) - Creates new product
✅ **PUT /api/products/:id** (Admin) - Updates product
✅ **DELETE /api/products/:id** (Admin) - Deletes product
✅ **POST /api/products/:id/reviews** (User) - Adds review to product

---

## Notes

1. **Database Seeded**: 23 products imported successfully
2. **Admin Account**: admin@goshop.com / admin123
3. **Categories**: Men, Women, Kids
4. **Subcategories**: T-Shirts, Shirts, Jeans, Jackets, Dresses, Tops, Sweaters
5. **Sizes**: XS, S, M, L, XL, XXL
