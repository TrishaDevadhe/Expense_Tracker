import re

file_path = "src/pages/AuthPage.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. State addition
content = content.replace(
    'const [isLogin, setIsLogin] = useState(true);',
    'const [isLogin, setIsLogin] = useState(true);\n  const [isReset, setIsReset] = useState(false);'
)

content = content.replace(
    '}, [isLogin, signupStep, identifierType]);',
    '}, [isLogin, signupStep, identifierType, isReset]);'
)

# 2. handleSendOtp Update
content = content.replace(
    "const response = await axios.post(`${API}/send-otp`, {",
    "const endpoint = isReset ? 'send-reset-otp' : 'send-otp';\n      const response = await axios.post(`${API}/${endpoint}`, {"
)

# 3. toggleMode
content = content.replace(
    'const toggleMode = () => {\n    setIsLogin(!isLogin);\n    resetSignup();\n  };',
    'const toggleMode = () => {\n    setIsLogin(!isLogin);\n    setIsReset(false);\n    resetSignup();\n  };'
)

# 4. handleCompleteRegistration update
old_hcr = """  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    const { password, confirmPassword, name } = formData;

    if (!name.trim()) {
      return setError('Please enter your name');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/complete-registration`, {
        identifier: resolvedIdentifier,
        password,
        name: name.trim(),
      });
      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };"""

new_hcr = """  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    const { password, confirmPassword, name } = formData;

    if (!isReset && !name.trim()) {
      return setError('Please enter your name');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
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
      setError(err.response?.data?.error || (isReset ? 'Reset failed. Please try again.' : 'Registration failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };"""

content = content.replace(old_hcr, new_hcr)

# 5. JSX - Forgot Password Link
old_login_input = """                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}"""

new_login_input = """                  autoComplete="current-password"
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
                disabled={isLoading}"""
content = content.replace(old_login_input, new_login_input)

# 6. Step 0 Heading
content = content.replace(
    """We'll send a verification code to confirm your identity""",
    """{isReset ? "Enter your email or phone to receive a reset code" : "We'll send a verification code to confirm your identity"}"""
)

# 7. Login Wrapper
content = content.replace(
    '          {isLogin && (',
    '          {isLogin && !isReset && ('
)

# 8. Step 2 Conditional Name
old_name = """              <div className="relative">
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
              </div>"""

new_name = """              {!isReset && (
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
              )}"""
content = content.replace(old_name, new_name)

# 9. Step 2 Headings
content = content.replace(
    '<p className="text-gray-800 dark:text-white font-medium text-sm">Create your account</p>',
    '<p className="text-gray-800 dark:text-white font-medium text-sm">{isReset ? "Reset your password" : "Create your account"}</p>'
)
content = content.replace(
    '<p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Set your name and a secure password</p>',
    '<p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{isReset ? "Enter a new secure password" : "Set your name and a secure password"}</p>'
)

# 10. Step 2 Button Text
content = content.replace(
    "{isLoading ? 'Creating Account...' : 'Create Account'}",
    "{isLoading ? (isReset ? 'Saving...' : 'Creating Account...') : (isReset ? 'Save New Password' : 'Create Account')}"
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Frontend updated for reset password.")
