import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrderById, reset } from '../redux/slices/orderSlice';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { currentOrder, isLoading, isError, message } = useSelector((state) => state.order);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (id) {
      dispatch(getOrderById(id));
    }

    return () => dispatch(reset());
  }, [id, user, dispatch, navigate]);

  if (isLoading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (isError) {
    return (
      <div className="order-confirmation-page">
        <div className="container">
          <div className="error-message">{message}</div>
          <Link to="/orders" className="btn btn-primary">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        <div className="success-header">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for your order. We've sent a confirmation email to {user.email}</p>
        </div>

        <div className="order-details-card">
          <div className="order-header">
            <h2>Order Details</h2>
            <div className="order-status-badge status-processing">
              {currentOrder.orderStatus}
            </div>
          </div>

          <div className="order-info-grid">
            <div className="info-item">
              <span className="info-label">Order ID:</span>
              <span className="info-value">#{currentOrder._id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Order Date:</span>
              <span className="info-value">
                {new Date(currentOrder.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Payment Method:</span>
              <span className="info-value">{currentOrder.paymentMethod}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Payment Status:</span>
              <span className={`payment-status status-${currentOrder.paymentStatus.toLowerCase()}`}>
                {currentOrder.paymentStatus}
              </span>
            </div>
          </div>

          <div className="order-section">
            <h3>Shipping Address</h3>
            <div className="address-box">
              <p><strong>{currentOrder.shippingAddress.fullName}</strong></p>
              <p>{currentOrder.shippingAddress.address}</p>
              <p>
                {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.postalCode}
              </p>
              <p>{currentOrder.shippingAddress.country}</p>
              <p>Phone: {currentOrder.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="order-section">
            <h3>Order Items</h3>
            <div className="order-items-list">
              {currentOrder.orderItems.map((item, index) => (
                <div key={index} className="order-item">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-specs">
                      Size: {item.size} {item.color && `| Color: ${item.color}`}
                    </p>
                    <p className="item-quantity">Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    <p>₹{item.price.toFixed(2)} × {item.quantity}</p>
                    <p className="item-total">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-section">
            <h3>Order Summary</h3>
            <div className="summary-calculations">
              <div className="summary-row">
                <span>Items Total:</span>
                <span>₹{currentOrder.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>
                  {currentOrder.shippingPrice === 0
                    ? 'FREE'
                    : `₹${currentOrder.shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="summary-row">
                <span>Tax (GST):</span>
                <span>₹{currentOrder.taxPrice.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row summary-total">
                <span>Total Paid:</span>
                <span>₹{currentOrder.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/orders" className="btn btn-primary">
            View All Orders
          </Link>
          <Link to="/" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
