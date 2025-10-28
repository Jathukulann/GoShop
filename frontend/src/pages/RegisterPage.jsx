import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../redux/slices/authSlice';
import { mergeCart } from '../redux/slices/cartSlice';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  // Initialize error from sessionStorage to persist across page reloads
  const [error, setError] = useState(() => {
    const savedError = sessionStorage.getItem('registerError');
    return savedError || '';
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isSuccess } = useSelector((state) => state.auth);
  const { sessionId } = useSelector((state) => state.cart);

  useEffect(() => {
    if (isSuccess || user) {
      // Merge guest cart with user cart if there's a guest session
      const handleRegisterSuccess = async () => {
        if (sessionId) {
          try {
            await dispatch(mergeCart()).unwrap();
          } catch (error) {
            console.error('Cart merge failed:', error);
          }
        }
        navigate('/profile');
      };
      handleRegisterSuccess();
    }
    return () => dispatch(reset());
  }, [user, isSuccess, navigate, dispatch, sessionId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) {
      sessionStorage.removeItem('registerError'); // Clear from sessionStorage too
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      return setError('Please fill in all fields');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    // Catch error directly from the promise to avoid useEffect dependency issues
    try {
      await dispatch(register({ name, email, password })).unwrap();
    } catch (err) {
      // Store error in sessionStorage to persist across page reloads
      const errorMessage = err || 'Registration failed. Please try again.';
      sessionStorage.setItem('registerError', errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Create Account</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
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
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
