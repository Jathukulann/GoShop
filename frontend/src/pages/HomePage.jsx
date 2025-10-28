import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFeaturedProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { featuredProducts, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getFeaturedProducts());
  }, [dispatch]);

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h1>Welcome to GoShop!</h1>
        <p>Your one-stop shop for quality clothing</p>
        {user ? (
          <div className="user-welcome">
            <p>Hello, {user.name}! Browse our collection and start shopping.</p>
            <Link to="/profile" className="btn btn-primary">View Profile</Link>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        )}
      </div>

      <div className="featured-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products" className="view-all-link">View All Products →</Link>
        </div>

        {isLoading ? (
          <div className="loading">Loading featured products...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      
    </div>
  );
};

export default HomePage;
