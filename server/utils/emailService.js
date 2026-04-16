const nodemailer = require('nodemailer');

let transporter = null;

// Only create the transporter if email credentials are configured
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password (not your regular password)
    },
  });
}

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"ExpenseIQ" <${process.env.EMAIL_USER || 'noreply@expenseiq.app'}>`,
    to: email,
    subject: 'Your ExpenseIQ Verification Code',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: linear-gradient(135deg, #0c0c14 0%, #1a1a2e 100%); border-radius: 16px; color: #ffffff;">
        <h1 style="color: #818cf8; text-align: center; margin-bottom: 4px; font-size: 28px;">ExpenseIQ</h1>
        <p style="color: #9ca3af; text-align: center; margin-bottom: 28px; font-size: 14px;">Personal AI Expense Tracker</p>
        <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 28px; text-align: center;">
          <p style="color: #d1d5db; margin-bottom: 16px; font-size: 15px;">Your verification code is:</p>
          <div style="font-size: 40px; font-weight: 700; letter-spacing: 10px; color: #ffffff; padding: 12px 0;">${otp}</div>
        </div>
        <p style="color: #6b7280; text-align: center; margin-top: 20px; font-size: 12px;">This code expires in 10 minutes.<br/>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  if (transporter) {
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] OTP sent to ${email}`);
  } else {
    // Fallback: log to console so development still works without SMTP
    console.log(`\n╔══════════════════════════════════════════╗`);
    console.log(`║  EMAIL OTP (SMTP not configured)         ║`);
    console.log(`║  To: ${email.padEnd(34)}║`);
    console.log(`║  Code: ${otp}                              ║`);
    console.log(`╚══════════════════════════════════════════╝\n`);
  }
};

module.exports = { sendOTPEmail };
