export const CURRENCIES = {
  'INR': { symbol: '₹', rate: 1 },
  'USD': { symbol: '$', rate: 83 },
  'EUR': { symbol: '€', rate: 90 },
  'GBP': { symbol: '£', rate: 105 }
};

export const convertToBase = (amount, currency) => amount * (CURRENCIES[currency]?.rate || 1);
export const convertFromBase = (amountInBase, targetCurrency) => amountInBase / (CURRENCIES[targetCurrency]?.rate || 1);
