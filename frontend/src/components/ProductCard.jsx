import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-card-link">
        <div className="product-image">
          {product.images && product.images.length > 0 ? (
            <img src={product.images[0].url} alt={product.name} />
          ) : (
            <div className="no-image">No Image</div>
          )}
          {hasDiscount && (
            <span className="discount-badge">
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
            </span>
          )}
          {product.stock === 0 && <span className="out-of-stock-badge">Out of Stock</span>}
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">
            {product.category} - {product.subcategory}
          </p>
          <div className="product-price">
            <span className="current-price">${displayPrice.toFixed(2)}</span>
            {hasDiscount && <span className="original-price">${product.price.toFixed(2)}</span>}
          </div>
          <div className="product-rating">
            <span className="stars">{'★'.repeat(Math.round(product.ratings))}</span>
            <span className="rating-text">
              {product.ratings.toFixed(1)} ({product.numOfReviews} reviews)
            </span>
          </div>
          {product.stock > 0 && product.stock < 10 && (
            <p className="low-stock">Only {product.stock} left!</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
