import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Lock, User, LogIn, ArrowRight, ArrowLeft, Shield, CheckCircle2, KeyRound } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { signInWithGoogle } from '../utils/firebaseAuth';
import axios from 'axios';

const API = '/api/auth';

const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {Array.from({ length: totalSteps }, (_, i) => (
      <motion.div
        key={i}
        className={`h-1.5 rounded-full transition-all duration-300 ${
          i <= currentStep ? 'bg-blue-500' : 'bg-white/10'
        }`}
        animate={{ width: i === currentStep ? 32 : 12 }}
        transition={{ duration: 0.3 }}
      />
    ))}
  </div>
);

const OtpInput = ({ value, onChange, disabled }) => {
  return (
    <div className="flex justify-center">
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={value}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
          onChange(val);
        }}
        disabled={disabled}
        placeholder="000000"
        autoFocus
        className="w-[240px] h-[56px] text-3xl tracking-[12px] text-center font-bold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all caret-blue-500" 
      />
    </div>
  );
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [signupStep, setSignupStep] = useState(0); // 0: enter identifier, 1: verify OTP, 2: set password
  const [identifierType, setIdentifierType] = useState('email'); // 'email' or 'phone'
  const [formData, setFormData] = useState({
    identifier: '',
    otp: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [resolvedIdentifier, setResolvedIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Clear messages when switching modes
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [isLogin, signupStep, identifierType, isReset]);

  // ─── SIGN UP: Step 1 — Send OTP ──────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const { identifier } = formData;

    if (!identifier.trim()) {
      return setError(identifierType === 'email' ? 'Please enter your email address' : 'Please enter your phone number');
    }
    if (identifierType === 'email' && !/\S+@\S+\.\S+/.test(identifier)) {
      return setError('Please enter a valid email address');
    }
    if (identifierType === 'phone' && !/^(\+?\d{10,15}|\d{10})$/.test(identifier.replace(/\s/g, ''))) {
      return setError('Please enter a valid phone number');
    }

    setIsLoading(true);
    setError('');

    try {
      const endpoint = isReset ? 'send-reset-otp' : 'send-otp';
      const response = await axios.post(`${API}/${endpoint}`, {
        identifier: identifier.trim(),
      });
      setResolvedIdentifier(response.data.identifier);
      setSuccess(`Verification code sent to ${response.data.identifier}`);
      setSignupStep(1);
    } catch (err) {
      const errorData = err.response?.data;
      setError(typeof errorData === 'string' ? errorData : (errorData?.error || errorData?.message || 'Failed to send verification code'));
    } finally {
      setIsLoading(false);
    }
  };

  // ─── SIGN UP: Step 2 — Verify OTP ────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (formData.otp.length !== 6) {
      return setError('Please enter the 6-digit code');
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post(`${API}/verify-otp`, {
        identifier: resolvedIdentifier,
        otp: formData.otp,
      });
      setSuccess('Verified! Now set up your password.');
      setSignupStep(2);
    } catch (err) {
      const errorData = err.response?.data;
      setError(typeof errorData === 'string' ? errorData : (errorData?.error || errorData?.message || 'Invalid verification code'));
    } finally {
      setIsLoading(false);
    }
  };

  // ─── SIGN UP: Step 3 — Set password & complete registration ──────────
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    const { password, confirmPassword, name } = formData;

    if (!isReset && !name.trim()) {
      return setError('Please enter your name');
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._#\^+-]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return setError('Password must be at least 8 chars, include uppercase, lowercase, number & symbol');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);
    setError('');

    try {
      if (isReset) {
        await axios.post(`${API}/reset-password`, {
          identifier: resolvedIdentifier,
          password,
        });
        setSuccess('Password updated! Redirecting to login...');
        setTimeout(() => {
          setIsReset(false);
          setIsLogin(true);
          setSignupStep(0);
        }, 1500);
      } else {
        const response = await axios.post(`${API}/complete-registration`, {
          identifier: resolvedIdentifier,
          password,
          name: name.trim(),
        });
        localStorage.setItem('token', response.data.token);
        window.location.href = '/dashboard';
      }
    } catch (err) {
      const errorData = err.response?.data;
      setError(typeof errorData === 'string' ? errorData : (errorData?.error || errorData?.message || (isReset ? 'Reset failed. Please try again.' : 'Registration failed. Please try again.')));
    } finally {
      setIsLoading(false);
    }
  };

  // ─── SIGN IN: email/phone + password ──────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    const { identifier, password } = formData;

    if (!identifier.trim()) {
      return setError('Please enter your email or phone number');
    }
    if (!password) {
      return setError('Please enter your password');
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/login`, {
        identifier: identifier.trim(),
        password,
      });
      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error detail:', err.response?.data);
      const errorData = err.response?.data;
      const errorMessage = typeof errorData === 'string' 
        ? errorData 
        : (errorData?.error || errorData?.message || 'Login failed. Please check your credentials and environment variables.');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Google Sign In ───────────────────────────────────────────────────
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signInWithGoogle();
      const firebaseUser = result.user;

      // Sync with our backend to get a JWT
      const response = await axios.post(`${API}/google`, {
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        googleId: firebaseUser.uid,
      });

      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Google Auth Error:', err);
      setError(err.response?.data?.error || 'Google Sign-In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Guest Demo Login ──────────────────────────────────────────────────
  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API}/guest`);
      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'Guest Sign-In failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Reset to beginning of signup ─────────────────────────────────────
  const resetSignup = () => {
    setSignupStep(0);
    setFormData({ identifier: '', otp: '', password: '', confirmPassword: '', name: '' });
    setResolvedIdentifier('');
    setError('');
    setSuccess('');
  };

  // ─── Switch between Login / Sign Up ───────────────────────────────────
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsReset(false);
    resetSignup();
  };

  // ─── Animation variants ───────────────────────────────────────────────
  const slideVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gradient-to-br dark:from-[#0c0c14] dark:to-[#1a1a2e] overflow-hidden relative transition-colors duration-300">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-indigo-500/5 blur-[100px] rounded-full" />

      <GlassCard className="w-full max-w-md p-8 relative z-10" hover={false}>
        {/* Logo */}
        <div className="text-center mb-6">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
          >
            ExpenseIQ
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Personal AI Expense Tracker</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-gray-200/50 dark:bg-[#ffffff05] border border-gray-200 dark:border-transparent rounded-xl p-1 mb-6">
          {['Sign In', 'Sign Up'].map((label, i) => (
            <button
              key={label}
              onClick={() => {
                if (i === 0 && !isLogin) toggleMode();
                if (i === 1 && isLogin) toggleMode();
              }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                (i === 0 && isLogin) || (i === 1 && !isLogin)
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Error & Success Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium"
            >
              {error}
            </motion.div>
          )}
          {success && !error && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-medium flex items-center gap-2"
            >
              <CheckCircle2 size={14} />
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════════════════════════════
              SIGN IN
          ═══════════════════════════════════════════════════════════════ */}
          {isLogin && !isReset && (
            <motion.form
              key="login"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Email or Phone Number"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
              <div className="flex justify-end mt-1 mb-2">
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setIsReset(true); setSignupStep(0); setError(''); setSuccess(''); setResolvedIdentifier(''); setFormData({...formData, identifier: ''}); }}
                  className="text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
                {!isLoading && <LogIn size={18} />}
              </button>

              {/* Divider */}
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-white/10" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-[#121221] px-3 text-gray-500 dark:text-gray-400">or</span></div>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-3.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50 mt-4"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              {/* Guest Login */}
              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="w-full py-3.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50 mt-4"
              >
                <User size={18} />
                Continue as Guest
              </button>
            </motion.form>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              SIGN UP — Step 0: Enter email or phone
          ═══════════════════════════════════════════════════════════════ */}
          {!isLogin && signupStep === 0 && (
            <motion.form
              key="signup-step-0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              onSubmit={handleSendOtp}
              className="space-y-4"
            >
              <StepIndicator currentStep={0} totalSteps={3} />

              <p className="text-gray-600 dark:text-gray-400 text-sm text-center mb-2">
                {isReset ? "Enter your email or phone to receive a reset code" : "We'll send a verification code to confirm your identity"}
              </p>

              {/* Email / Phone toggle */}
              <div className="flex bg-[#ffffff05] rounded-lg p-0.5 mb-2">
                {[
                  { key: 'email', icon: Mail, label: 'Email' },
                  { key: 'phone', icon: Phone, label: 'Phone' },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setIdentifierType(key);
                      setFormData({ ...formData, identifier: '' });
                      setError('');
                    }}
                    className={`flex-1 py-2 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
                      identifierType === key
                        ? 'bg-white dark:bg-white/10 text-gray-800 dark:text-white shadow-sm dark:shadow-none'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>

              <div className="relative">
                {identifierType === 'email' ? (
                  <Mail size={18} className="absolute left-3 top-3.5 text-gray-500" />
                ) : (
                  <Phone size={18} className="absolute left-3 top-3.5 text-gray-500" />
                )}
                <input
                  type={identifierType === 'email' ? 'email' : 'tel'}
                  placeholder={identifierType === 'email' ? 'you@example.com' : '+91 XXXXXXXXXX'}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
                {!isLoading && <ArrowRight size={18} />}
              </button>

              {/* Divider */}
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-white/10" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-[#121221] px-3 text-gray-500 dark:text-gray-400">or</span></div>
              </div>

              {/* Google Sign Up */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-3.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50 mt-4"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </button>

              {/* Guest Login */}
              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="w-full py-3.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50 mt-4"
              >
                <User size={18} />
                Continue as Guest
              </button>
            </motion.form>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              SIGN UP — Step 1: Enter OTP
          ═══════════════════════════════════════════════════════════════ */}
          {!isLogin && signupStep === 1 && (
            <motion.form
              key="signup-step-1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              onSubmit={handleVerifyOtp}
              className="space-y-5"
            >
              <StepIndicator currentStep={1} totalSteps={3} />

              <div className="text-center">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Shield size={28} className="text-blue-400" />
                </div>
                <p className="text-gray-800 dark:text-white font-medium text-sm">Enter verification code</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  Sent to <span className="text-gray-900 dark:text-gray-300 font-semibold">{resolvedIdentifier}</span>
                </p>
              </div>

              <OtpInput
                value={formData.otp}
                onChange={(val) => setFormData({ ...formData, otp: val })}
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading || formData.otp.length !== 6}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
                {!isLoading && <ArrowRight size={18} />}
              </button>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setSignupStep(0); setError(''); setSuccess(''); }}
                  className="text-gray-500 hover:text-white transition-colors text-xs flex items-center gap-1"
                >
                  <ArrowLeft size={14} />
                  Change {identifierType}
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="text-blue-400 hover:text-blue-300 transition-colors text-xs disabled:opacity-50"
                >
                  Resend code
                </button>
              </div>
            </motion.form>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              SIGN UP — Step 2: Set name + password
          ═══════════════════════════════════════════════════════════════ */}
          {!isLogin && signupStep === 2 && (
            <motion.form
              key="signup-step-2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              onSubmit={handleCompleteRegistration}
              className="space-y-4"
            >
              <StepIndicator currentStep={2} totalSteps={3} />

              <div className="text-center mb-2">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <KeyRound size={28} className="text-emerald-400" />
                </div>
                <p className="text-gray-800 dark:text-white font-medium text-sm">{isReset ? "Reset your password" : "Create your account"}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{isReset ? "Enter a new secure password" : "Set your name and a secure password"}</p>
              </div>

              {!isReset && (
                <div className="relative">
                  <User size={18} className="absolute left-3 top-3.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              )}
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="password"
                  placeholder="Strong Password"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>

              {/* Password strength indicator */}
              {formData.password && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => {
                      const strength =
                        (formData.password.length >= 8 ? 1 : 0) +
                        (/[A-Z]/.test(formData.password) ? 1 : 0) +
                        (/[0-9]/.test(formData.password) ? 1 : 0) +
                        (/[^A-Za-z0-9]/.test(formData.password) ? 1 : 0);
                      return (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            level <= strength
                              ? strength <= 1 ? 'bg-red-500' : strength <= 2 ? 'bg-yellow-500' : strength <= 3 ? 'bg-blue-500' : 'bg-emerald-500'
                              : 'bg-white/10'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-gray-500">Use uppercase, numbers & symbols for a stronger password</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
              >
                {isLoading ? (isReset ? 'Saving...' : 'Creating Account...') : (isReset ? 'Save New Password' : 'Create Account')}
                {!isLoading && <CheckCircle2 size={18} />}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Toggle Sign In / Sign Up */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default AuthPage;
