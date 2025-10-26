const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// Optional auth middleware - allows both logged-in and guest users
const optionalAuth = (req, res, next) => {
  // Try to authenticate, but don't fail if not authenticated
  const token = req.headers.authorization?.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const User = require('../models/User');
      User.findById(decoded.id)
        .select('-password')
        .then((user) => {
          if (user) {
            req.user = user;
          }
          next();
        })
        .catch(() => next());
    } catch (error) {
      next();
    }
  } else {
    next();
  }
};

// Public routes (support both logged-in and guest)
router.post('/', optionalAuth, addToCart);
router.get('/', optionalAuth, getCart);
router.put('/:itemId', optionalAuth, updateCartItem);
router.delete('/:itemId', optionalAuth, removeCartItem);
router.delete('/', optionalAuth, clearCart);

// Protected route (merge guest cart on login)
router.post('/merge', protect, mergeCart);

module.exports = router;
