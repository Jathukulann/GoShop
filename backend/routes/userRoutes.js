const express = require('express');
const {
  getUserProfile,
  updateProfile,
  updatePassword,
  uploadAvatar,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// All routes are protected
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.put('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
