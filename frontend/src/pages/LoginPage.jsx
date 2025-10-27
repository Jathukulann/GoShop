import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../redux/slices/authSlice';
import { mergeCart } from '../redux/slices/cartSlice';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  const { sessionId } = useSelector((state) => state.cart);

  useEffect(() => {
    if (isError) setError(message);
    if (isSuccess && user) {
      // Merge guest cart with user cart if there's a guest session
      const handleLoginSuccess = async () => {
        if (sessionId) {
          try {
            console.log('Merging cart with sessionId:', sessionId);
            await dispatch(mergeCart()).unwrap();
            console.log('Cart merge completed successfully');
          } catch (error) {
            console.error('Cart merge failed:', error);
          }
        } else {
          console.log('No guest cart to merge');
        }
        navigate('/profile');
      };
      handleLoginSuccess();
    }
    return () => dispatch(reset());
  }, [isSuccess, user, navigate, dispatch, sessionId, isError, message]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      return setError('Please fill in all fields');
    }

    dispatch(login({ email, password }));
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Login</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
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
