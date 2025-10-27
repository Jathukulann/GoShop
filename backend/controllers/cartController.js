const Cart = require('../models/Cart');
const Product = require('../models/Product');
const crypto = require('crypto');

// Generate unique session ID
const generateSessionId = () => {
  return crypto.randomBytes(16).toString('hex');
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Public (supports both logged-in and guest users)
const addToCart = async (req, res) => {
  try {
    const { productId, size, color, quantity = 1 } = req.body;

    // Validate input
    if (!productId || !size) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and size are required',
      });
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if size is available
    if (!product.sizes.includes(size)) {
      return res.status(400).json({
        success: false,
        message: 'Selected size is not available',
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    // Determine if user is logged in or guest
    const userId = req.user ? req.user._id : null;
    let sessionId = req.cookies.sessionId || req.body.sessionId;

    // Create session ID for guest if doesn't exist
    if (!userId && !sessionId) {
      sessionId = generateSessionId();
    }

    // Find or create cart
    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      cart = new Cart({
        user: userId,
        sessionId: userId ? null : sessionId,
        items: [],
      });
    }

    // Prepare cart item
    const cartItem = {
      product: product._id,
      name: product.name,
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      image: product.images[0]?.url || '',
      size,
      color: color || '',
      quantity,
      stock: product.stock,
    };

    // Check if item already exists in cart (same product, size, color)
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === (color || '')
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: 'Cannot add more items than available in stock',
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push(cartItem);
    }

    await cart.save();

    // Set session cookie for guest users
    if (!userId) {
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get cart
// @route   GET /api/cart
// @access  Public
const getCart = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const sessionId = req.cookies.sessionId || req.query.sessionId;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId }).populate('items.product', 'name stock');
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId }).populate('items.product', 'name stock');
    }

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          items: [],
          subtotal: 0,
          totalItems: 0,
        },
      });
    }

    // Check stock availability for each item
    const updatedItems = cart.items.map((item) => {
      if (item.product && item.quantity > item.product.stock) {
        item.quantity = item.product.stock;
      }
      return item;
    });

    cart.items = updatedItems;
    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Public
const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const userId = req.user ? req.user._id : null;
    const sessionId = req.cookies.sessionId || req.body.sessionId;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    // Get product to check stock
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Public
const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const userId = req.user ? req.user._id : null;
    const sessionId = req.cookies.sessionId || req.query.sessionId;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // Remove item using pull
    cart.items.pull(itemId);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Public
const clearCart = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const sessionId = req.cookies.sessionId || req.query.sessionId;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Merge guest cart with user cart on login
// @route   POST /api/cart/merge
// @access  Private
const mergeCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID required',
      });
    }

    // Find guest cart
    const guestCart = await Cart.findOne({ sessionId });
    if (!guestCart || guestCart.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No guest cart to merge',
      });
    }

    // Find or create user cart
    let userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      userCart = new Cart({ user: userId, items: [] });
    }

    // Merge items
    for (const guestItem of guestCart.items) {
      const existingItemIndex = userCart.items.findIndex(
        (item) =>
          item.product.toString() === guestItem.product.toString() &&
          item.size === guestItem.size &&
          item.color === guestItem.color
      );

      if (existingItemIndex > -1) {
        // Update quantity
        userCart.items[existingItemIndex].quantity += guestItem.quantity;
      } else {
        // Add new item - create a plain object without _id to let Mongoose generate a new one
        userCart.items.push({
          product: guestItem.product,
          name: guestItem.name,
          price: guestItem.price,
          image: guestItem.image,
          size: guestItem.size,
          color: guestItem.color,
          quantity: guestItem.quantity,
          stock: guestItem.stock,
        });
      }
    }

    await userCart.save();

    // Delete guest cart
    await Cart.deleteOne({ sessionId });

    // Clear session cookie
    res.clearCookie('sessionId');

    res.status(200).json({
      success: true,
      message: 'Cart merged successfully',
      cart: userCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
};
