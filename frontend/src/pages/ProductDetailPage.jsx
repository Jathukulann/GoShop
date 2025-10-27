import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById, createProductReview, reset, clearProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, isLoading, isError, message } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { isLoading: cartLoading } = useSelector((state) => state.cart);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    dispatch(getProductById(id));

    return () => {
      dispatch(clearProduct());
      dispatch(reset());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    if (quantity > product.stock) {
      alert('Cannot add more than available stock');
      return;
    }

    try {
      await dispatch(
        addToCart({
          productId: product._id,
          size: selectedSize,
          color: selectedColor,
          quantity,
        })
      ).unwrap();

      alert('Added to cart successfully!');
      // Optionally navigate to cart
      // navigate('/cart');
    } catch (error) {
      alert(error || 'Failed to add to cart');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review');
      navigate('/login');
      return;
    }
    dispatch(createProductReview({ productId: id, reviewData }));
    setShowReviewForm(false);
    setReviewData({ rating: 5, comment: '' });
    // Refresh product data to show new review
    setTimeout(() => {
      dispatch(getProductById(id));
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container">
        <div className="error-message">{message}</div>
        <button onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="error-message">Product not found</div>
        <button onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;

  return (
    <div className="container">
      <div className="product-detail">
        <button className="back-btn" onClick={() => navigate('/products')}>
          ← Back to Products
        </button>

        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0].url} alt={product.name} className="main-image" />
            ) : (
              <div className="no-image">No Image Available</div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-details">
            <h1>{product.name}</h1>
            <p className="category">
              {product.category} / {product.subcategory}
            </p>

            <div className="rating">
              <span className="stars">{'★'.repeat(Math.round(product.ratings))}</span>
              <span className="rating-text">
                {product.ratings.toFixed(1)} ({product.numOfReviews} reviews)
              </span>
            </div>

            <div className="price-section">
              <span className="current-price">${displayPrice.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="original-price">${product.price.toFixed(2)}</span>
                  <span className="discount-badge">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="description">{product.description}</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="selection-group">
                <label>Size:</label>
                <div className="size-options">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={selectedSize === size ? 'active' : ''}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="selection-group">
                <label>Color:</label>
                <div className="color-options">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={selectedColor === color ? 'active' : ''}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="selection-group">
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
              <span className="stock-info">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Add to Cart Button */}
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || cartLoading}
            >
              {cartLoading ? 'Adding...' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <div className="reviews-header">
            <h2>Customer Reviews</h2>
            {user && (
              <button className="write-review-btn" onClick={() => setShowReviewForm(!showReviewForm)}>
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Rating:</label>
                <select
                  value={reviewData.rating}
                  onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                  required
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>
              <div className="form-group">
                <label>Comment:</label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  required
                  rows="4"
                  placeholder="Share your experience with this product..."
                />
              </div>
              <button type="submit">Submit Review</button>
            </form>
          )}

          {/* Reviews List */}
          <div className="reviews-list">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <strong>{review.name}</strong>
                    <span className="review-rating">{'★'.repeat(review.rating)}</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <p className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
