// SenteFlow Smart Input Parser
// Converts natural language like "I spent 10k on lunch" into structured data.

const EXPENSE_KEYWORDS = [
  'spent', 'bought', 'paid', 'cost', 'used', 'gave', 'send', 'sent',
  'expense', 'withdrew', 'buy', 'purchase', 'purchased', 'spend', 'pay', 'use', 'give', 'send', 'withdraw',
];
const INCOME_KEYWORDS = [
  'received', 'got', 'earned', 'income', 'salary', 'sold', 'collected',
  'deposited', 'receive', 'get', 'earn', 'sell', 'collect', 'deposit',
];
const SAVING_KEYWORDS = [
  'saved', 'save', 'saving', 'savings', 'set aside', 'put aside',
];

const CATEGORY_MAP = {
  Savings:   ['savings', 'save', 'saved', 'saving', 'set aside', 'put aside',
              'deposit', 'stash', 'reserve'],
  Food:      ['food', 'lunch', 'dinner', 'breakfast', 'eat', 'eating', 'restaurant',
              'groceries', 'supper', 'posho', 'matooke', 'meat', 'rolex', 'kafunda',
              'snack', 'juice', 'drinks', 'bread', 'rice', 'beans'],
  Transport: ['transport', 'boda', 'taxi', 'fare', 'fuel', 'bus', 'matatu', 'uber',
              'stage', 'ride', 'driving', 'petrol', 'special hire', 'taxis'],
  Airtime:   ['airtime', 'data', 'bundles', 'internet', 'mtn', 'airtel', 'credit',
              'top up', 'topup', 'recharge', 'bundle'],
  Bills:     ['bills', 'electricity', 'water', 'rent', 'yaka', 'utilities', 'umeme',
              'nwsc', 'bill', 'ura', 'tax', 'school fees', 'fees', 'insurance'],
  Business:  ['business', 'stock', 'inventory', 'client', 'sales', 'profit', 'goods',
              'supply', 'wholesale', 'product', 'shop', 'stall', 'market', 'salary',
              'worker', 'staff', 'delivery'],
};

function parseAmount(text) {
  const patterns = [
    { regex: /(\d+(?:\.\d+)?)\s*(?:million|m)\b/i, mult: 1_000_000 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:thousand|k)\b/i, mult: 1_000 },
    { regex: /(\d{1,3}(?:,\d{3})+)/,               mult: 1 },
    { regex: /(\d{4,})/,                            mult: 1 },
    { regex: /(\d+)/,                               mult: 1 },
  ];
  for (const { regex, mult } of patterns) {
    const match = text.match(regex);
    if (match) {
      const val = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(val) && val > 0) return Math.round(val * mult);
    }
  }
  return null;
}

function parseType(text) {
  const lower = text.toLowerCase();
  const isSaving  = SAVING_KEYWORDS.some(w => lower.includes(w));
  const isExpense = EXPENSE_KEYWORDS.some(w => lower.includes(w));
  const isIncome  = INCOME_KEYWORDS.some(w => lower.includes(w));
  // Savings takes priority — always treated as money going out
  if (isSaving)              return 'out';
  if (isExpense && !isIncome) return 'out';
  if (isIncome  && !isExpense) return 'in';
  return null;
}

function parseCategory(text) {
  const lower = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some(k => lower.includes(k))) return category;
  }
  return null;
}

export function parseSmartInput(text) {
  if (!text || !text.trim()) return null;
  return {
    amount:   parseAmount(text),
    type:     parseType(text),
    category: parseCategory(text),
    raw:      text.trim(),
  };
}

// Returns 0–100 confidence score
export function getParseConfidence(parsed) {
  if (!parsed) return 0;
  let score = 0;
  if (parsed.amount)   score += 40;
  if (parsed.type)     score += 35;
  if (parsed.category) score += 25;
  return score;
}
