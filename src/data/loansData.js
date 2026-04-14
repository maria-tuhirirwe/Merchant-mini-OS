// Loans data model
// direction: 'lent'     = I gave money to someone (they owe me)
//            'borrowed' = I received money from someone (I owe them)

const today = new Date();
const daysAgo  = (n) => { const d = new Date(today); d.setDate(d.getDate() - n); return d.toISOString().split('T')[0]; };
const daysAhead = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return d.toISOString().split('T')[0]; };

export const sampleLoans = [
  // --- LENT (I gave money) ---
  {
    id: 'loan-1',
    direction: 'lent',
    personName: 'Brian Mukasa',
    amount: 150000,
    date: daysAgo(20),
    dueDate: daysAhead(10),
    notes: 'For school fees — to be paid back end of month',
    status: 'partial',
    payments: [
      { id: 'pay-1', amount: 50000, date: daysAgo(5), note: 'First instalment' },
    ],
  },
  {
    id: 'loan-2',
    direction: 'lent',
    personName: 'Sandra Nambi',
    amount: 80000,
    date: daysAgo(35),
    dueDate: daysAgo(5),
    notes: 'Stock purchase advance',
    status: 'settled',
    payments: [
      { id: 'pay-2', amount: 50000, date: daysAgo(15), note: 'Partial' },
      { id: 'pay-3', amount: 30000, date: daysAgo(5),  note: 'Final payment' },
    ],
  },
  {
    id: 'loan-3',
    direction: 'lent',
    personName: 'Peter Okello',
    amount: 200000,
    date: daysAgo(7),
    dueDate: daysAhead(23),
    notes: 'Business capital — motorbike repair',
    status: 'pending',
    payments: [],
  },

  // --- BORROWED (I owe someone) ---
  {
    id: 'loan-4',
    direction: 'borrowed',
    personName: 'Auntie Grace',
    amount: 300000,
    date: daysAgo(14),
    dueDate: daysAhead(16),
    notes: 'Emergency rent money',
    status: 'partial',
    payments: [
      { id: 'pay-4', amount: 100000, date: daysAgo(3), note: 'First repayment' },
    ],
  },
  {
    id: 'loan-5',
    direction: 'borrowed',
    personName: 'James Wafula',
    amount: 50000,
    date: daysAgo(40),
    dueDate: daysAgo(10),
    notes: 'Quick loan for supplies',
    status: 'settled',
    payments: [
      { id: 'pay-5', amount: 50000, date: daysAgo(10), note: 'Full repayment' },
    ],
  },
];

// Helpers
export function getLoanBalance(loan) {
  const paid = loan.payments.reduce((s, p) => s + p.amount, 0);
  return loan.amount - paid;
}

export function getLoanProgress(loan) {
  const paid = loan.payments.reduce((s, p) => s + p.amount, 0);
  return loan.amount > 0 ? Math.min(100, Math.round((paid / loan.amount) * 100)) : 0;
}

export function isOverdue(loan) {
  if (!loan.dueDate || loan.status === 'settled') return false;
  return new Date(loan.dueDate) < new Date();
}

export function computeLoanSummary(loans) {
  const lent     = loans.filter(l => l.direction === 'lent');
  const borrowed = loans.filter(l => l.direction === 'borrowed');

  const totalLent       = lent.reduce((s, l) => s + l.amount, 0);
  const totalBorrowed   = borrowed.reduce((s, l) => s + l.amount, 0);
  const outstandingLent = lent
    .filter(l => l.status !== 'settled')
    .reduce((s, l) => s + getLoanBalance(l), 0);
  const outstandingOwed = borrowed
    .filter(l => l.status !== 'settled')
    .reduce((s, l) => s + getLoanBalance(l), 0);

  return { totalLent, totalBorrowed, outstandingLent, outstandingOwed };
}
