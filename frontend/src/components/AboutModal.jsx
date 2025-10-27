const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="modal-body">
          <h2>About GoShop</h2>

          <div className="about-section">
            <h3>Our Story</h3>
            <p>
              GoShop was founded with a simple mission: to provide high-quality, stylish clothing
              for everyone. We believe that fashion should be accessible, affordable, and sustainable.
            </p>
          </div>

          <div className="about-section">
            <h3>What We Offer</h3>
            <p>
              From trendy casual wear to elegant formal attire, we curate collections for men,
              women, and kids. Our diverse range ensures that every member of your family can
              find something they love.
            </p>
          </div>

          <div className="about-section">
            <h3>Our Values</h3>
            <ul>
              <li><strong>Quality First:</strong> Every product is carefully selected to meet our high standards.</li>
              <li><strong>Customer Satisfaction:</strong> Your happiness is our priority.</li>
              <li><strong>Sustainability:</strong> We're committed to eco-friendly practices.</li>
              <li><strong>Innovation:</strong> Constantly updating our collections with the latest trends.</li>
            </ul>
          </div>

          <div className="about-section">
            <h3>Why Choose Us?</h3>
            <ul>
              <li>Curated collections from top brands</li>
              <li>Secure online shopping experience</li>
              <li>Easy returns and exchanges</li>
              <li>Fast and reliable shipping</li>
              <li>24/7 customer support</li>
            </ul>
          </div>

          <div className="about-section">
            <h3>Contact Information</h3>
            <p>
              <strong>Email:</strong> support@goshop.com<br />
              <strong>Phone:</strong> 1-800-GOSHOP<br />
              <strong>Address:</strong> 123 Fashion Street, Style City, SC 12345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
