const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const dataRoutes = require('./routes/dataRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

const rateLimit = require('express-rate-limit');

const app = express();
const prisma = new PrismaClient();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased limit for development
});

// Middleware MUST be before limiter for CORS headers to be attached to 429 responses
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/invoices', invoiceRoutes);

// Protected routes test
const { protect } = require('./middleware/auth');
app.get('/api/user/profile', protect, (req, res) => {
  res.json(req.user);
});

// Admin metric bonus
app.get('/api/admin/metrics', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.json({ registeredUsers: userCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, prisma };
