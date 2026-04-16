import re

file_path = "src/pages/AuthPage.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. OtpInput
old_otp = """        style={{
          width: '240px',
          height: '56px',
          fontSize: '32px',
          letterSpacing: '12px',
          textAlign: 'center',
          fontWeight: 'bold',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          color: '#ffffff',
          outline: 'none',
          caretColor: '#3b82f6',
        }}
        onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; }}
        onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}"""

new_otp = """        className="w-[240px] h-[56px] text-3xl tracking-[12px] text-center font-bold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all caret-blue-500" """
content = content.replace(old_otp, new_otp)

# 2. Main Wrapper
old_wrapper = """<div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0c0c14] to-[#1a1a2e] overflow-hidden relative">"""
new_wrapper = """<div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gradient-to-br dark:from-[#0c0c14] dark:to-[#1a1a2e] overflow-hidden relative transition-colors duration-300">"""
content = content.replace(old_wrapper, new_wrapper)

# 3. Logo text
content = content.replace(
    'className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"',
    'className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"'
)
content = content.replace('<p className="text-gray-400 mt-1 text-sm">Personal AI Expense Tracker</p>', '<p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Personal AI Expense Tracker</p>')

# 4. Mode toggle
old_toggle = """<div className="flex bg-[#ffffff05] rounded-xl p-1 mb-6">"""
new_toggle = """<div className="flex bg-gray-200/50 dark:bg-[#ffffff05] border border-gray-200 dark:border-transparent rounded-xl p-1 mb-6">"""
content = content.replace(old_toggle, new_toggle)
content = content.replace("'text-gray-400 hover:text-white'", "'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'")

# 5. Inputs
old_input_class = 'w-full bg-[#ffffff08] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
new_input_class = 'w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
content = content.replace(old_input_class, new_input_class)

# 6. Button
content = content.replace('bg-[#121221] px-3 text-gray-500', 'bg-white dark:bg-[#121221] px-3 text-gray-500 dark:text-gray-400')
content = content.replace('border-t border-white/10', 'border-t border-gray-300 dark:border-white/10')

# Google buttons replace
old_google = """              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-3.5 bg-white/5 border border-white/10 text-white font-medium rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all disabled:opacity-50"
              >"""
new_google = """              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-3.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50 mt-4"
              >"""
content = content.replace(old_google, new_google)

# Google Sign Up is missing from Step 0 since we reverted previously, wait, no, the user said "Add a Continue with Google button below the OR divider".
# In signup step 0, it actually already has a Google Sign Up button! Let's check. Yes, it has "Sign up with Google". We just replaced its styling.

# Other texts
content = content.replace('<p className="text-gray-400 text-sm text-center mb-2">', '<p className="text-gray-600 dark:text-gray-400 text-sm text-center mb-2">')
content = content.replace('bg-white/10 text-white', 'bg-white dark:bg-white/10 text-gray-800 dark:text-white shadow-sm dark:shadow-none')
content = content.replace('text-gray-500 hover:text-gray-300', 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300')
content = content.replace('<p className="text-white font-medium text-sm">', '<p className="text-gray-800 dark:text-white font-medium text-sm">')
content = content.replace('<p className="text-gray-500 text-xs mt-1">', '<p className="text-gray-500 dark:text-gray-400 text-xs mt-1">')

# Let's write the file back
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
