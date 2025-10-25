import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);

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
    </div>
  );
};

export default HomePage;
