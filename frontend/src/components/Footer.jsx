import { useState } from 'react';
import { Link } from 'react-router-dom';
import AboutModal from './AboutModal';

const Footer = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>GoShop</h3>
            <p>Your one-stop shop for quality clothing. Fashion for everyone.</p>
          </div>

          <div className="footer-section">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/products?category=Men">Men's Collection</Link></li>
              <li><Link to="/products?category=Women">Women's Collection</Link></li>
              <li><Link to="/products?category=Kids">Kids' Collection</Link></li>
              <li><Link to="/products">All Products</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/profile">My Account</Link></li>
              <li><button onClick={() => setIsAboutModalOpen(true)} className="footer-link-btn">About Us</button></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} GoShop. All rights reserved.</p>
        </div>
      </footer>

      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </>
  );
};

export default Footer;
