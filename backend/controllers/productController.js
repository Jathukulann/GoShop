const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// @desc    Get all products with search, filter, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query object
    const queryObj = { isActive: true };

    // Search by name or description
    if (req.query.search) {
      queryObj.$text = { $search: req.query.search };
    }

    // Filter by category
    if (req.query.category) {
      queryObj.category = req.query.category;
    }

    // Filter by subcategory
    if (req.query.subcategory) {
      queryObj.subcategory = req.query.subcategory;
    }

    // Filter by size
    if (req.query.size) {
      queryObj.sizes = { $in: [req.query.size] };
    }

    // Filter by color
    if (req.query.color) {
      queryObj.colors = { $in: [req.query.color] };
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.price = {};
      if (req.query.minPrice) {
        queryObj.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        queryObj.price.$lte = parseFloat(req.query.maxPrice);
      }
    }

    // Filter by rating
    if (req.query.rating) {
      queryObj.ratings = { $gte: parseFloat(req.query.rating) };
    }

    // Filter featured products
    if (req.query.featured === 'true') {
      queryObj.isFeatured = true;
    }

    // Sort options
    let sortOption = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sortOption = { price: 1 };
          break;
        case 'price_desc':
          sortOption = { price: -1 };
          break;
        case 'rating':
          sortOption = { ratings: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    } else {
      sortOption = { createdAt: -1 };
    }

    // Execute query
    const products = await Product.find(queryObj)
      .sort(sortOption)
      .limit(limit)
      .skip(skip)
      .select('-reviews'); // Exclude reviews from list view for performance

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(queryObj);

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name avatar')
      .populate('createdBy', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      subcategory,
      sizes,
      colors,
      stock,
      isFeatured,
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !subcategory) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Handle image uploads (expecting array of images)
    let images = [];
    if (req.body.images && req.body.images.length > 0) {
      for (let image of req.body.images) {
        const result = await cloudinary.uploader.upload(image, {
          folder: 'goshop/products',
          width: 800,
          crop: 'scale',
        });

        images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      images,
      category,
      subcategory,
      sizes,
      colors,
      stock,
      isFeatured,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Handle image updates if provided
    if (req.body.images && req.body.images.length > 0) {
      // Delete old images from cloudinary
      for (let image of product.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }

      // Upload new images
      let images = [];
      for (let image of req.body.images) {
        const result = await cloudinary.uploader.upload(image, {
          folder: 'goshop/products',
          width: 800,
          crop: 'scale',
        });

        images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      req.body.images = images;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete images from cloudinary
    for (let image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create/Update product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating and comment',
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    // Add review
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;

    // Calculate average rating
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .limit(8)
      .sort({ createdAt: -1 })
      .select('-reviews');

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getFeaturedProducts,
};
