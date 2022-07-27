const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  verifyEmail,
} = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authentication');

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.delete('/logout', authenticateUser, logout);

module.exports = router;
