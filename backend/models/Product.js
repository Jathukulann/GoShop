const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add product name'],
      trim: true,
      maxLength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add product description'],
      maxLength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add product price'],
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, 'Please select product category'],
      enum: {
        values: ['Men', 'Women', 'Kids'],
        message: 'Please select correct category',
      },
    },
    subcategory: {
      type: String,
      required: [true, 'Please add subcategory'],
      enum: {
        values: [
          'T-Shirts',
          'Shirts',
          'Jeans',
          'Trousers',
          'Jackets',
          'Sweaters',
          'Dresses',
          'Skirts',
          'Tops',
          'Shorts',
          'Activewear',
          'Accessories',
        ],
        message: 'Please select correct subcategory',
      },
    },
    sizes: [
      {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
    ],
    colors: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      required: [true, 'Please add product stock'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for search
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
