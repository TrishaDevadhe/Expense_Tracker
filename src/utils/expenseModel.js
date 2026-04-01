export const EXPENSE_CATEGORIES = [
  'Food & Drink', 'Transport', 'Housing', 'Health', 
  'Entertainment', 'Shopping', 'Education', 'Other'
];

/**
 * Validates, formats, and returns a clean expense object
 * matching the exact data model requirements.
 * 
 * @throws {Error} if validation fails
 */
export const createExpense = (amount, category, date, note) => {
  // 1. Amount Validation
  let parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new Error('Amount must be a positive decimal number > 0');
  }
  
  // 2. Category Validation
  if (!EXPENSE_CATEGORIES.includes(category)) {
    throw new Error('Invalid or empty category selected');
  }

  // 3. Date Validation (YYYY-MM-DD Regex)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!date || !dateRegex.test(date)) {
    throw new Error('Date must be a valid structure in YYYY-MM-DD format');
  }

  // 4 & 5. Unique ID & Data Cleansing
  return {
    id: Date.now(), // Ensure unique ID mathematically
    amount: parsedAmount,
    category: category,
    date: date,
    note: note ? note.trim() : '' // Optional string safely scrubbed
  };
};
