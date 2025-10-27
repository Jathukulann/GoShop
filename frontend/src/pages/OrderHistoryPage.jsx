import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getMyOrders, reset } from '../redux/slices/orderSlice';

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, isLoading, isError, message } = useSelector((state) => state.order);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(getMyOrders());

    return () => dispatch(reset());
  }, [user, dispatch, navigate]);

  if (isLoading) {
    return <div className="loading">Loading your orders...</div>;
  }

  return (
    <div className="order-history-page">
      <div className="container">
        <h1>My Orders</h1>

        {isError && <div className="error-message">{message}</div>}

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h2>No orders yet</h2>
            <p>Looks like you haven't placed any orders yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-id-date">
                    <h3>Order #{order._id}</h3>
                    <p className="order-date">
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="order-badges">
                    <span className={`order-status-badge status-${order.orderStatus.toLowerCase()}`}>
                      {order.orderStatus}
                    </span>
                    <span className={`payment-status-badge status-${order.paymentStatus.toLowerCase()}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-items-preview">
                    {order.orderItems.slice(0, 3).map((item, index) => (
                      <div key={index} className="order-item-preview">
                        <img src={item.image} alt={item.name} />
                        <div className="item-preview-details">
                          <p className="item-name">{item.name}</p>
                          <p className="item-meta">
                            Size: {item.size} | Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="item-price">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <p className="more-items">+{order.orderItems.length - 3} more items</p>
                    )}
                  </div>

                  <div className="order-summary-preview">
                    <div className="summary-item">
                      <span>Total Amount:</span>
                      <span className="total-amount">₹{order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                      <span>Payment Method:</span>
                      <span>{order.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="order-card-footer">
                  <Link to={`/order-confirmation/${order._id}`} className="btn btn-secondary">
                    View Details
                  </Link>
                  {order.orderStatus === 'Processing' && (
                    <button className="btn btn-outline" onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this order?')) {
                        // Will implement cancel functionality
                        alert('Cancel order feature coming soon!');
                      }
                    }}>
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
