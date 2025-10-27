import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, reset } from '../redux/slices/orderSlice';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isSuccess, isError, message, currentOrder } = useSelector((state) => state.order);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Mock');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }

    if (cart.items.length === 0) {
      navigate('/cart');
    }

    if (isSuccess && currentOrder) {
      dispatch(reset());
      navigate(`/order-confirmation/${currentOrder._id}`);
    }
  }, [user, cart, isSuccess, currentOrder, navigate, dispatch]);

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  // Calculate prices
  const itemsPrice = cart.subtotal || 0;
  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const taxPrice = Number((itemsPrice * 0.18).toFixed(2)); // 18% GST
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.phone) {
      alert('Please fill in all shipping address fields');
      return;
    }

    const orderData = {
      orderItems: cart.items.map((item) => ({
        product: item.product._id || item.product,
        name: item.name,
        price: item.price,
        image: item.image,
        size: item.size,
        color: item.color || '',
        quantity: item.quantity,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    };

    dispatch(createOrder(orderData));
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>

        {isError && <div className="alert alert-error">{message}</div>}

        <div className="checkout-content">
          {/* Shipping Form */}
          <div className="checkout-section">
            <h2>Shipping Address</h2>
            <form onSubmit={handleSubmit} className="shipping-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleChange}
                  placeholder="House no., Street name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
              </div>

              <div className="payment-method">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Mock"
                      checked={paymentMethod === 'Mock'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Mock Payment (For Testing)</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block place-order-btn" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <h2>Order Summary</h2>

            <div className="order-items">
              {cart.items.map((item) => (
                <div key={item._id} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    <p>
                      Size: {item.size} {item.color && `| Color: ${item.color}`}
                    </p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="order-item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="order-calculations">
              <div className="calc-row">
                <span>Items ({cart.totalItems}):</span>
                <span>₹{itemsPrice.toFixed(2)}</span>
              </div>
              <div className="calc-row">
                <span>Shipping:</span>
                <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="calc-row">
                <span>Tax (18% GST):</span>
                <span>₹{taxPrice.toFixed(2)}</span>
              </div>
              <div className="calc-divider"></div>
              <div className="calc-row total-row">
                <span>Total:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {shippingPrice === 0 && (
              <div className="free-shipping-message">You get FREE shipping!</div>
            )}
            {shippingPrice > 0 && (
              <div className="shipping-message">
                Add ₹{(1000 - itemsPrice).toFixed(2)} more to get FREE shipping
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
