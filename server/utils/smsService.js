const twilio = require('twilio');

let client;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC') && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const sendSMSOTP = async (phoneNumber, otp) => {
  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    console.warn(`[TWILIO NOT CONFIGURED] Ignored sending SMS to ${phoneNumber}. OTP: ${otp}`);
    return;
  }

  try {
    const message = await client.messages.create({
      body: `Your ExpenseIQ verification code is: ${otp}. It will expire in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    console.log(`[TWILIO] OTP sent to ${phoneNumber}. Message SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error(`[TWILIO ERROR] Failed to send SMS to ${phoneNumber}:`, error.message);
    throw new Error('Failed to send SMS. Please ensure your Twilio integration is properly configured.');
  }
};

module.exports = {
  sendSMSOTP
};
