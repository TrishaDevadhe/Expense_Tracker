const express = require('express');
const router = express.Router();
const { getIncome, createIncome, getBudgets, createBudget, getAIInsights } = require('../controllers/dataController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/income', getIncome);
router.post('/income', createIncome);
router.get('/budgets', getBudgets);
router.post('/budgets', createBudget);
router.post('/ai-insights', getAIInsights);

module.exports = router;
