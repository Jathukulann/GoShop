import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../redux/slices/authSlice';
import { mergeCart } from '../redux/slices/cartSlice';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  // Initialize error from sessionStorage to persist across page reloads
  const [error, setError] = useState(() => {
    const savedError = sessionStorage.getItem('loginError');
    return savedError || '';
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isSuccess } = useSelector((state) => state.auth);
  const { sessionId } = useSelector((state) => state.cart);

  useEffect(() => {
    if (isSuccess && user) {
      // Merge guest cart with user cart if there's a guest session
      const handleLoginSuccess = async () => {
        if (sessionId) {
          try {
            await dispatch(mergeCart()).unwrap();
          } catch (error) {
            console.error('Cart merge failed:', error);
          }
        }
        navigate('/profile');
      };
      handleLoginSuccess();
    }
  }, [isSuccess, user, sessionId, dispatch, navigate]);

  // Cleanup only on unmount
  useEffect(() => {
    return () => {
      dispatch(reset());
      // Don't clear error on unmount - let it persist via sessionStorage
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) {
      sessionStorage.removeItem('loginError'); // Clear from sessionStorage too
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      return setError('Please fill in all fields');
    }

    // Catch error directly from the promise to avoid useEffect dependency issues
    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (err) {
      // Store error in sessionStorage to persist across page reloads
      const errorMessage = err || 'Login failed. Please try again.';
      sessionStorage.setItem('loginError', errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Login</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Enter password"
              autoComplete="new-password"
            />
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-link">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
