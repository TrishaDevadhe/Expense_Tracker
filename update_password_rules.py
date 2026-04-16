import re

# 1. Update Frontend
frontend_file = "src/pages/AuthPage.jsx"
with open(frontend_file, "r", encoding="utf-8") as f:
    content = f.read()

# frontend validation
old_fe_val = """    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }"""

new_fe_val = """    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&._#\\^+-]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return setError('Password must be at least 8 chars, include uppercase, lowercase, number & symbol');
    }"""
content = content.replace(old_fe_val, new_fe_val)

# placeholder
content = content.replace(
    'placeholder="Password (min 6 characters)"',
    'placeholder="Strong Password"'
)

# password strength calculator
old_strength = """                        (formData.password.length >= 6 ? 1 : 0) +"""
new_strength = """                        (formData.password.length >= 8 ? 1 : 0) +"""
content = content.replace(old_strength, new_strength)

with open(frontend_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Frontend Updated.")

# 2. Update Backend
backend_file = "server/controllers/authController.js"
with open(backend_file, "r", encoding="utf-8") as f:
    b_content = f.read()

old_be_val = """  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }"""

new_be_val = """  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&._#\\^+-]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 chars and include uppercase, lowercase, number, and symbol' });
  }"""
b_content = b_content.replace(old_be_val, new_be_val)

with open(backend_file, "w", encoding="utf-8") as f:
    f.write(b_content)

print("Backend Updated.")
