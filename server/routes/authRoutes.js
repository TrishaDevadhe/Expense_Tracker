const express = require('express');
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  completeRegistration,
  loginUser,
  googleSignIn,
  sendResetOtp,
  resetPassword,
  guestLogin,
} = require('../controllers/authController');

// Sign-up flow (3 steps)
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/complete-registration', completeRegistration);

// Login
router.post('/login', loginUser);

// Google sign-in
router.post('/google', googleSignIn);

router.post('/send-reset-otp', sendResetOtp);
router.post('/reset-password', resetPassword);

// Guest sign-in
router.post('/guest', guestLogin);

module.exports = router;
