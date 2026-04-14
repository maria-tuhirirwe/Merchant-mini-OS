// Currency formatter — UGX (Ugandan Shilling)
export function formatCurrency(amount, currency = 'UGX') {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Short form: USh1.2M, USh350k, USh5,000
export function formatCurrencyShort(amount) {
  if (amount >= 1_000_000) return `USh${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)     return `USh${(amount / 1_000).toFixed(0)}k`;
  return `USh${Math.round(amount).toLocaleString()}`;
}

// Date formatting
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateShort(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString())     return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en', { day: 'numeric', month: 'short' });
}

export function formatDateFull(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

// Capitalize first letter
export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Group transactions by date label
export function groupByDate(transactions) {
  const groups = {};
  transactions.forEach(t => {
    const label = formatDateShort(t.date);
    if (!groups[label]) groups[label] = [];
    groups[label].push(t);
  });
  return groups;
}

// Get category color from defaultCategories list
export function getCategoryColor(categoryName, categories = []) {
  const found = categories.find(c => c.name === categoryName);
  return found?.color || '#94a3b8';
}

// Get category icon
export function getCategoryIcon(categoryName, categories = []) {
  const found = categories.find(c => c.name === categoryName);
  return found?.icon || '📝';
}
