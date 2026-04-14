// Sample data for Merchant Mini-OS MVP demo

export const sampleUser = {
  id: 'user-1',
  name: 'Amara Osei',
  email: 'amara.osei@example.com',
  accountType: 'Personal',
  preferredView: 'weekly',
  joinedDate: '2024-01-15',
};

export const defaultCategories = [
  { id: 'cat-1',  name: 'Food',        type: 'both',  icon: '🍽️',  color: '#f59e0b' },
  { id: 'cat-2',  name: 'Transport',   type: 'out',   icon: '🚗',  color: '#3b82f6' },
  { id: 'cat-3',  name: 'Rent',        type: 'out',   icon: '🏠',  color: '#8b5cf6' },
  { id: 'cat-4',  name: 'Shopping',    type: 'out',   icon: '🛍️',  color: '#ec4899' },
  { id: 'cat-5',  name: 'Stock',       type: 'both',  icon: '📦',  color: '#06b6d4' },
  { id: 'cat-6',  name: 'Airtime',     type: 'out',   icon: '📱',  color: '#64748b' },
  { id: 'cat-7',  name: 'Savings',     type: 'both',  icon: '🏦',  color: '#10b981' },
  { id: 'cat-8',  name: 'Salary',      type: 'in',    icon: '💼',  color: '#22c55e' },
  { id: 'cat-9',  name: 'Sales',       type: 'in',    icon: '💰',  color: '#16a34a' },
  { id: 'cat-10', name: 'Allowance',   type: 'in',    icon: '🎓',  color: '#0d9488' },
  { id: 'cat-11', name: 'Freelance',   type: 'in',    icon: '💻',  color: '#6366f1' },
  { id: 'cat-12', name: 'Other',       type: 'both',  icon: '📝',  color: '#94a3b8' },
];

// Transactions covering the last 30 days
const today = new Date();
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

export const sampleTransactions = [
  // Today
  { id: 't-1',  type: 'in',  amount: 85000,   category: 'Sales',      date: daysAgo(0),  note: 'Market sales - morning shift' },
  { id: 't-2',  type: 'out', amount: 12000,   category: 'Food',        date: daysAgo(0),  note: 'Lunch and groceries' },
  { id: 't-3',  type: 'out', amount: 3000,    category: 'Transport',   date: daysAgo(0),  note: 'Boda boda to market' },

  // Yesterday
  { id: 't-4',  type: 'in',  amount: 50000,   category: 'Freelance',  date: daysAgo(1),  note: 'Logo design - client payment' },
  { id: 't-5',  type: 'out', amount: 15000,   category: 'Airtime',    date: daysAgo(1),  note: 'Monthly data bundle' },
  { id: 't-6',  type: 'out', amount: 8000,    category: 'Food',       date: daysAgo(1),  note: 'Dinner' },

  // 2 days ago
  { id: 't-7',  type: 'out', amount: 60000,   category: 'Stock',      date: daysAgo(2),  note: 'Restock — fabric rolls' },
  { id: 't-8',  type: 'in',  amount: 120000,  category: 'Sales',      date: daysAgo(2),  note: 'Afternoon sales' },

  // 3 days ago
  { id: 't-9',  type: 'out', amount: 45000,   category: 'Shopping',   date: daysAgo(3),  note: 'New work bag' },
  { id: 't-10', type: 'in',  amount: 30000,   category: 'Allowance',  date: daysAgo(3),  note: 'Monthly family allowance' },

  // 4 days ago
  { id: 't-11', type: 'out', amount: 5000,    category: 'Transport',  date: daysAgo(4),  note: 'Special hire to meeting' },
  { id: 't-12', type: 'in',  amount: 200000,  category: 'Sales',      date: daysAgo(4),  note: 'Wholesale order — bulk' },

  // 5 days ago
  { id: 't-13', type: 'out', amount: 25000,   category: 'Food',       date: daysAgo(5),  note: 'Weekend groceries' },
  { id: 't-14', type: 'out', amount: 100000,  category: 'Savings',    date: daysAgo(5),  note: 'Weekly savings deposit' },

  // 6 days ago
  { id: 't-15', type: 'in',  amount: 95000,   category: 'Sales',      date: daysAgo(6),  note: 'End-of-week sales' },
  { id: 't-16', type: 'out', amount: 10000,   category: 'Transport',  date: daysAgo(6),  note: 'Fuel for motorbike' },

  // Last week
  { id: 't-17', type: 'in',  amount: 600000,  category: 'Salary',     date: daysAgo(8),  note: 'Monthly salary — part-time' },
  { id: 't-18', type: 'out', amount: 250000,  category: 'Rent',       date: daysAgo(9),  note: 'Monthly room rent' },
  { id: 't-19', type: 'out', amount: 30000,   category: 'Stock',      date: daysAgo(10), note: 'Packaging materials' },
  { id: 't-20', type: 'in',  amount: 75000,   category: 'Freelance',  date: daysAgo(11), note: 'Social media content' },
  { id: 't-21', type: 'out', amount: 10000,   category: 'Airtime',    date: daysAgo(12), note: 'Phone top-up' },
  { id: 't-22', type: 'in',  amount: 110000,  category: 'Sales',      date: daysAgo(13), note: 'Market day sales' },
  { id: 't-23', type: 'out', amount: 20000,   category: 'Food',       date: daysAgo(14), note: 'Family dinner out' },

  // Older
  { id: 't-24', type: 'in',  amount: 230000,  category: 'Sales',      date: daysAgo(15), note: 'Bulk supply order' },
  { id: 't-25', type: 'out', amount: 35000,   category: 'Shopping',   date: daysAgo(16), note: 'Stationery & supplies' },
  { id: 't-26', type: 'out', amount: 150000,  category: 'Savings',    date: daysAgo(18), note: 'Monthly savings' },
  { id: 't-27', type: 'in',  amount: 50000,   category: 'Allowance',  date: daysAgo(20), note: 'Sibling support' },
  { id: 't-28', type: 'out', amount: 18000,   category: 'Food',       date: daysAgo(22), note: 'Lunch for the week' },
  { id: 't-29', type: 'in',  amount: 160000,  category: 'Sales',      date: daysAgo(25), note: 'Weekend market' },
  { id: 't-30', type: 'out', amount: 40000,   category: 'Transport',  date: daysAgo(28), note: 'Car service' },
];

// Insight messages shown on dashboard
export const insightMessages = [
  'Your balance improved compared to last week.',
  'You spent more on Food this week than usual.',
  'Great job saving this month! Keep it up.',
  'Transport costs are higher than average this week.',
  'Your Sales income was strong today.',
];

// Helper: compute summary from a list of transactions
export function computeSummary(transactions) {
  const totalIn  = transactions.filter(t => t.type === 'in').reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'out').reduce((s, t) => s + t.amount, 0);
  return { totalIn, totalOut, balance: totalIn - totalOut };
}

// Helper: get transactions for the last N days
export function getRecentTransactions(transactions, days = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return transactions.filter(t => new Date(t.date) >= cutoff);
}

// Helper: group by day for chart
export function getDailyChartData(transactions, days = 7) {
  const map = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en', { weekday: 'short' });
    map[key] = { date: key, label, income: 0, expense: 0 };
  }
  transactions.forEach(t => {
    if (map[t.date]) {
      if (t.type === 'in')  map[t.date].income  += t.amount;
      if (t.type === 'out') map[t.date].expense += t.amount;
    }
  });
  return Object.values(map);
}

// Helper: category breakdown
export function getCategoryBreakdown(transactions, type = 'out') {
  const map = {};
  transactions.filter(t => t.type === type).forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}
