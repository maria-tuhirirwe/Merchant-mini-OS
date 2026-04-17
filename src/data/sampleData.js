// SenteFlow — sample data for Ugandan users (UGX)

export const sampleUser = {
  id:            'user-1',
  name:          'Amara Nakato',
  email:         'amara@example.com',
  accountType:   'Personal',
  preferredView: 'weekly',
  joinedDate:    '2024-01-15',
};

// ─── Categories ──────────────────────────────────────────────────────────────
// Primary 5 + bonus categories
export const defaultCategories = [
  { id: 'cat-1',  name: 'Food',      type: 'out',  icon: '🍛', color: '#f59e0b' },
  { id: 'cat-2',  name: 'Transport', type: 'out',  icon: '🛵', color: '#3b82f6' },
  { id: 'cat-3',  name: 'Airtime',   type: 'out',  icon: '📶', color: '#8b5cf6' },
  { id: 'cat-4',  name: 'Bills',     type: 'out',  icon: '💡', color: '#f97316' },
  { id: 'cat-5',  name: 'Business',  type: 'both', icon: '💼', color: '#06b6d4' },
  { id: 'cat-6',  name: 'Savings',   type: 'both', icon: '🏦', color: '#10b981' },
  { id: 'cat-7',  name: 'Sales',     type: 'in',   icon: '🛍️', color: '#16a34a' },
  { id: 'cat-8',  name: 'Salary',    type: 'in',   icon: '💰', color: '#22c55e' },
  { id: 'cat-9',  name: 'Freelance', type: 'in',   icon: '💻', color: '#6366f1' },
  { id: 'cat-10', name: 'Other',     type: 'both', icon: '📝', color: '#94a3b8' },
];

// ─── Transactions (last 30 days, Ugandan context) ───────────────────────────
const today = new Date();
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

export const sampleTransactions = [
  // Today
  { id: 't-1',  type: 'in',  amount: 120000,  category: 'Sales',     date: daysAgo(0),  note: 'Market sales — morning' },
  { id: 't-2',  type: 'out', amount: 8000,    category: 'Food',      date: daysAgo(0),  note: 'Rolex and juice' },
  { id: 't-3',  type: 'out', amount: 3000,    category: 'Transport', date: daysAgo(0),  note: 'Boda boda to market' },

  // Yesterday
  { id: 't-4',  type: 'in',  amount: 65000,   category: 'Freelance', date: daysAgo(1),  note: 'Logo design — client payment' },
  { id: 't-5',  type: 'out', amount: 15000,   category: 'Airtime',   date: daysAgo(1),  note: 'MTN data bundle — 30 days' },
  { id: 't-6',  type: 'out', amount: 10000,   category: 'Food',      date: daysAgo(1),  note: 'Dinner and posho' },

  // 2 days ago
  { id: 't-7',  type: 'out', amount: 75000,   category: 'Business',  date: daysAgo(2),  note: 'Restock — fabric rolls' },
  { id: 't-8',  type: 'in',  amount: 150000,  category: 'Sales',     date: daysAgo(2),  note: 'Afternoon sales — bulk order' },

  // 3 days ago
  { id: 't-9',  type: 'out', amount: 5000,    category: 'Transport', date: daysAgo(3),  note: 'Special hire to meeting' },
  { id: 't-10', type: 'in',  amount: 40000,   category: 'Freelance', date: daysAgo(3),  note: 'Social media content fee' },

  // 4 days ago
  { id: 't-11', type: 'out', amount: 20000,   category: 'Food',      date: daysAgo(4),  note: 'Weekly groceries' },
  { id: 't-12', type: 'in',  amount: 250000,  category: 'Sales',     date: daysAgo(4),  note: 'Wholesale order — bulk supply' },

  // 5 days ago
  { id: 't-13', type: 'out', amount: 30000,   category: 'Bills',     date: daysAgo(5),  note: 'YAKA electricity tokens' },
  { id: 't-14', type: 'out', amount: 100000,  category: 'Savings',   date: daysAgo(5),  note: 'Weekly savings deposit' },

  // 6 days ago
  { id: 't-15', type: 'in',  amount: 95000,   category: 'Sales',     date: daysAgo(6),  note: 'End-of-week market sales' },
  { id: 't-16', type: 'out', amount: 12000,   category: 'Transport', date: daysAgo(6),  note: 'Fuel for motorbike' },

  // Last week
  { id: 't-17', type: 'in',  amount: 700000,  category: 'Salary',    date: daysAgo(8),  note: 'Monthly salary' },
  { id: 't-18', type: 'out', amount: 300000,  category: 'Bills',     date: daysAgo(9),  note: 'Monthly rent — single room' },
  { id: 't-19', type: 'out', amount: 35000,   category: 'Business',  date: daysAgo(10), note: 'Packaging materials' },
  { id: 't-20', type: 'in',  amount: 80000,   category: 'Freelance', date: daysAgo(11), note: 'Web banner design' },
  { id: 't-21', type: 'out', amount: 8000,    category: 'Airtime',   date: daysAgo(12), note: 'Airtel top-up' },
  { id: 't-22', type: 'in',  amount: 130000,  category: 'Sales',     date: daysAgo(13), note: 'Market day — Saturday' },
  { id: 't-23', type: 'out', amount: 25000,   category: 'Food',      date: daysAgo(14), note: 'Family dinner — Nandos' },

  // Older
  { id: 't-24', type: 'in',  amount: 280000,  category: 'Sales',     date: daysAgo(15), note: 'Bulk supply order' },
  { id: 't-25', type: 'out', amount: 40000,   category: 'Business',  date: daysAgo(16), note: 'Stationery & supplies' },
  { id: 't-26', type: 'out', amount: 150000,  category: 'Savings',   date: daysAgo(18), note: 'Monthly savings' },
  { id: 't-27', type: 'in',  amount: 60000,   category: 'Freelance', date: daysAgo(20), note: 'Print design — receipt book' },
  { id: 't-28', type: 'out', amount: 18000,   category: 'Food',      date: daysAgo(22), note: 'Lunch for the week' },
  { id: 't-29', type: 'in',  amount: 190000,  category: 'Sales',     date: daysAgo(25), note: 'Weekend market — Owino' },
  { id: 't-30', type: 'out', amount: 45000,   category: 'Transport', date: daysAgo(28), note: 'Boda boda — monthly fuel' },
];

// ─── Insight templates ───────────────────────────────────────────────────────
// Used to generate AI-like messages dynamically
export const insightTemplates = {
  spendingHigh:     (cat, pct) => `You spent ${pct}% more on ${cat} this week than last week.`,
  spendingLow:      (cat, pct) => `Great — ${cat} spending is down ${pct}% this week!`,
  balanceLow:       (days)     => `At this rate, your balance may last about ${days} more days. Consider saving.`,
  incomeGood:       (amt)      => `Strong week! You earned ${amt} in income.`,
  streakMessage:    (n)        => `${n}-day streak! You've recorded transactions for ${n} days in a row.`,
  savingsReminder:  ()         => `You haven't set aside savings this week. Even a small amount helps!`,
  topCategory:      (cat)      => `${cat} is your biggest expense this week.`,
  noExpenses:       ()         => 'No expenses recorded today. Keep it up!',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function computeSummary(transactions) {
  const totalIn  = transactions.filter(t => t.type === 'in').reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'out').reduce((s, t) => s + t.amount, 0);
  return { totalIn, totalOut, balance: totalIn - totalOut };
}

export function getRecentTransactions(transactions, days = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return transactions.filter(t => new Date(t.date) >= cutoff);
}

export function getDailyChartData(transactions, days = 7) {
  const map = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key   = d.toISOString().split('T')[0];
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

export function getCategoryBreakdown(transactions, type = 'out') {
  const map = {};
  transactions.filter(t => t.type === type).forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

// Compute consecutive-day streak (days with at least one transaction)
export function computeStreak(transactions) {
  const dates  = new Set(transactions.map(t => t.date));
  const todayStr = new Date().toISOString().split('T')[0];
  // If today has no transaction yet, start counting from yesterday
  const startOffset = dates.has(todayStr) ? 0 : 1;
  let streak = 0;
  for (let i = startOffset; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if (dates.has(key)) streak++;
    else break;
  }
  return streak;
}

// Generate dynamic insight messages from real data
export function generateInsights(transactions, categories) {
  const now     = new Date();
  const thisWeekStart = new Date(now); thisWeekStart.setDate(now.getDate() - 7);
  const lastWeekStart = new Date(now); lastWeekStart.setDate(now.getDate() - 14);

  const thisWeek = transactions.filter(t => new Date(t.date) >= thisWeekStart);
  const lastWeek = transactions.filter(
    t => new Date(t.date) >= lastWeekStart && new Date(t.date) < thisWeekStart
  );

  const messages = [];

  // Week-over-week income
  const thisIncome = thisWeek.filter(t => t.type === 'in').reduce((s, t) => s + t.amount, 0);
  const lastIncome = lastWeek.filter(t => t.type === 'in').reduce((s, t) => s + t.amount, 0);
  if (lastIncome > 0) {
    const pct = Math.round(((thisIncome - lastIncome) / lastIncome) * 100);
    if (pct > 0)  messages.push({ type: 'positive', text: `Your income is up ${pct}% compared to last week!` });
    if (pct < -10) messages.push({ type: 'warning', text: `Income dropped ${Math.abs(pct)}% vs last week. Stay focused.` });
  }

  // Top spending category
  const thisOut = thisWeek.filter(t => t.type === 'out');
  if (thisOut.length) {
    const catMap = {};
    thisOut.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
    const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
    if (topCat) messages.push({ type: 'info', text: `${topCat[0]} is your biggest spend this week.` });
  }

  // Week-over-week transport
  const thisTransport = thisOut.filter(t => t.category === 'Transport').reduce((s, t) => s + t.amount, 0);
  const lastTransport = lastWeek.filter(t => t.type === 'out' && t.category === 'Transport').reduce((s, t) => s + t.amount, 0);
  if (lastTransport > 0 && thisTransport > 0) {
    const pct = Math.round(((thisTransport - lastTransport) / lastTransport) * 100);
    if (pct >= 30) messages.push({ type: 'warning', text: `You spent ${pct}% more on Transport this week.` });
  }

  // Balance runway
  const { balance, totalOut } = computeSummary(thisWeek);
  const dailyBurn = totalOut / 7;
  if (balance > 0 && dailyBurn > 0) {
    const days = Math.round(balance / dailyBurn);
    if (days < 10) messages.push({ type: 'danger', text: `At this rate, your balance may last ${days} more days.` });
  }

  // No savings this week
  const hasSavings = thisWeek.some(t => t.category === 'Savings');
  if (!hasSavings) messages.push({ type: 'tip', text: `No savings recorded this week. Even USh5k a day adds up!` });

  // Fallback
  if (!messages.length) {
    messages.push({ type: 'positive', text: `Your finances look healthy this week. Keep tracking!` });
  }

  return messages;
}
