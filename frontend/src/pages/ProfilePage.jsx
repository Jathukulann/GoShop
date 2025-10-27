import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, updatePassword, uploadAvatar, reset } from '../redux/slices/authSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isSuccess, message } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showMessage, setShowMessage] = useState('');

  useEffect(() => {
    if (isSuccess && message) {
      setShowMessage(message);
      setTimeout(() => {
        setShowMessage('');
        dispatch(reset());
      }, 3000);
    }
  }, [isSuccess, message, dispatch]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(profileData));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setShowMessage('Passwords do not match');
      return;
    }

    // Confirmation dialog
    if (window.confirm('Are you sure you want to change your password?')) {
      dispatch(updatePassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }));
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      dispatch(uploadAvatar(formData));
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>My Profile</h2>
        {showMessage && <div className="alert alert-success">{showMessage}</div>}

        <div className="profile-section">
          <h3>Avatar</h3>
          <div className="avatar-section">
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt="Avatar" className="avatar" />
            ) : (
              <div className="avatar-placeholder">{user?.name.charAt(0)}</div>
            )}
            <input type="file" accept="image/*" onChange={handleAvatarUpload} />
          </div>
        </div>

        <div className="profile-section">
          <h3>Profile Information</h3>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        <div className="profile-section">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
