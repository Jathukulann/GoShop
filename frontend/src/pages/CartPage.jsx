import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem, clearCart, reset } from '../redux/slices/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, isLoading, isError, message } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCart());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleUpdateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ itemId, quantity }));
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      dispatch(removeCartItem(itemId));
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Clear entire cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    // TODO: Implement checkout in next phase
    alert('Checkout coming soon!');
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        {cart.items.length > 0 && (
          <button className="clear-cart-btn" onClick={handleClearCart}>
            Clear Cart
          </button>
        )}
      </div>

      {isError && <div className="error-message">{message}</div>}

      {cart.items.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart-item-details">
                  <Link to={`/products/${item.product._id || item.product}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  <div className="cart-item-meta">
                    <span>Size: {item.size}</span>
                    {item.color && <span>Color: {item.color}</span>}
                  </div>
                  <div className="cart-item-price">
                    ${item.price.toFixed(2)} each
                  </div>
                  {item.stock < 10 && item.stock > 0 && (
                    <p className="low-stock">Only {item.stock} left in stock!</p>
                  )}
                  {item.stock === 0 && <p className="out-of-stock">Out of stock</p>}
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button className="remove-btn" onClick={() => handleRemoveItem(item._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items ({cart.totalItems}):</span>
              <span>${cart.subtotal?.toFixed(2) || '0.00'}</span>
            </div>

            <div className="summary-row">
              <span>Shipping:</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-row">
              <span>Tax:</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row summary-total">
              <span>Subtotal:</span>
              <span>${cart.subtotal?.toFixed(2) || '0.00'}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
