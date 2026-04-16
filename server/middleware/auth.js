const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Try verifying as Firebase token first (for Google/OTP)
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { googleId: decodedToken.uid },
              { email: decodedToken.email },
              { phone: decodedToken.phone_number }
            ]
          }
        });

        if (user) {
          req.user = user;
          return next();
        }
      } catch (firebaseError) {
        // Not a valid Firebase token, fall through to JWT
      }

      // Try verifying as custom JWT (for Email/Password)
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await prisma.user.findUnique({
          where: { id: decoded.id }
        });

        if (!req.user) {
          return res.status(401).json({ error: 'User not found' });
        }

        return next();
      } catch (jwtError) {
        console.error('JWT Auth Error:', jwtError);
        return res.status(401).json({ error: 'Not authorized, token failed' });
      }
    } catch (outerError) {
      console.error('General Auth Failure:', outerError);
      res.status(401).json({ error: 'Authentication process failed' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};

module.exports = { protect };
