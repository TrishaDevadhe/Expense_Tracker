// In-memory OTP store (for production, use Redis or a database table)
const otpStore = new Map();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const storeOTP = (identifier, otp) => {
  otpStore.set(identifier.toLowerCase(), {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    verified: false,
  });
};

const verifyOTP = (identifier, otp) => {
  const key = identifier.toLowerCase();
  const stored = otpStore.get(key);

  if (!stored) {
    return { valid: false, message: 'OTP not found. Please request a new one.' };
  }
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(key);
    return { valid: false, message: 'OTP has expired. Please request a new one.' };
  }
  if (stored.otp !== otp) {
    return { valid: false, message: 'Invalid OTP. Please try again.' };
  }

  // Mark as verified but keep it (needed for the set-password step)
  stored.verified = true;
  return { valid: true };
};

const isVerified = (identifier) => {
  const stored = otpStore.get(identifier.toLowerCase());
  return stored?.verified === true && Date.now() <= stored.expiresAt;
};

const clearOTP = (identifier) => {
  otpStore.delete(identifier.toLowerCase());
};

module.exports = { generateOTP, storeOTP, verifyOTP, isVerified, clearOTP };
