import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import TransactionList from '../components/transactions/TransactionList';
import { useApp } from '../context/AppContext';
import {
  computeSummary,
  getRecentTransactions,
  generateInsights,
} from '../data/sampleData';
import { formatCurrencyShort } from '../utils/formatters';
import { clsx } from '../utils/clsx';

// ─── Streak Badge ─────────────────────────────────────────────────────────────
function StreakBadge({ days }) {
  if (days < 1) return null;
  return (
    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
      <span className="text-base leading-none">🔥</span>
      <span className="text-xs font-bold text-amber-700">{days}d</span>
    </div>
  );
}

// ─── Business Mode Toggle ─────────────────────────────────────────────────────
function ModeToggle({ mode, onChange }) {
  return (
    <div className="flex items-center bg-navy-100/70 rounded-full p-0.5">
      {['personal', 'business'].map(m => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={clsx(
            'px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200',
            mode === m
              ? 'bg-white text-navy-800 shadow-sm'
              : 'text-navy-400 hover:text-navy-600',
          )}
        >
          {m === 'personal' ? '👤 Personal' : '💼 Business'}
        </button>
      ))}
    </div>
  );
}

// ─── Balance Hero Card ────────────────────────────────────────────────────────
function BalanceCard({ balance, totalIn, totalOut }) {
  const isPositive = balance >= 0;
  return (
    <div
      className="rounded-3xl p-5 mb-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 60%, #2dd4bf 100%)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/8" />

      <div className="relative">
        <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mb-1">
          Total Balance
        </p>
        <p className={clsx(
          'text-4xl font-bold text-white tracking-tight mb-4',
          !isPositive && 'text-red-200',
        )}>
          {isPositive ? '' : '−'}{formatCurrencyShort(Math.abs(balance))}
        </p>

        <div className="flex gap-4">
          <div>
            <p className="text-teal-200 text-[10px] font-medium uppercase tracking-wider">Income</p>
            <p className="text-white font-bold text-sm mt-0.5">+{formatCurrencyShort(totalIn)}</p>
          </div>
          <div className="w-px bg-teal-400/30" />
          <div>
            <p className="text-teal-200 text-[10px] font-medium uppercase tracking-wider">Expenses</p>
            <p className="text-red-200 font-bold text-sm mt-0.5">−{formatCurrencyShort(totalOut)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Week Comparison ──────────────────────────────────────────────────────────
function WeekComparison({ thisWeek, lastWeek }) {
  const maxVal = Math.max(thisWeek.income, lastWeek.income, thisWeek.expense, lastWeek.expense, 1);

  const Bar = ({ value, max, color }) => (
    <div className="flex-1 flex flex-col items-center gap-1">
      <div className="w-full h-12 flex items-end">
        <div
          className="w-full rounded-t-lg transition-all duration-500"
          style={{
            height: `${Math.max(4, (value / max) * 100)}%`,
            backgroundColor: color,
            opacity: 0.85,
          }}
        />
      </div>
    </div>
  );

  const incomePct = lastWeek.income > 0
    ? Math.round(((thisWeek.income - lastWeek.income) / lastWeek.income) * 100)
    : null;
  const expensePct = lastWeek.expense > 0
    ? Math.round(((thisWeek.expense - lastWeek.expense) / lastWeek.expense) * 100)
    : null;

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-4 mb-4 shadow-card">
      <p className="text-xs font-semibold text-navy-700 mb-3">This Week vs Last Week</p>
      <div className="flex gap-3 items-end mb-2">
        {/* Income group */}
        <div className="flex-1">
          <div className="flex gap-1 items-end h-12 mb-1">
            <Bar value={lastWeek.income}  max={maxVal} color="#94a3b8" />
            <Bar value={thisWeek.income}  max={maxVal} color="#14b8a6" />
          </div>
          <p className="text-[10px] text-navy-400 text-center">Income</p>
          {incomePct !== null && (
            <p className={clsx(
              'text-[10px] font-bold text-center',
              incomePct >= 0 ? 'text-teal-600' : 'text-red-500',
            )}>
              {incomePct >= 0 ? '+' : ''}{incomePct}%
            </p>
          )}
        </div>

        {/* Expense group */}
        <div className="flex-1">
          <div className="flex gap-1 items-end h-12 mb-1">
            <Bar value={lastWeek.expense} max={maxVal} color="#94a3b8" />
            <Bar value={thisWeek.expense} max={maxVal} color="#f87171" />
          </div>
          <p className="text-[10px] text-navy-400 text-center">Expenses</p>
          {expensePct !== null && (
            <p className={clsx(
              'text-[10px] font-bold text-center',
              expensePct <= 0 ? 'text-teal-600' : 'text-red-500',
            )}>
              {expensePct >= 0 ? '+' : ''}{expensePct}%
            </p>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-3 justify-center">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-navy-300" />
          <span className="text-[10px] text-navy-400">Last week</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-teal-500" />
          <span className="text-[10px] text-navy-400">This week</span>
        </div>
      </div>
    </div>
  );
}

// ─── Insight Card ─────────────────────────────────────────────────────────────
const insightStyles = {
  positive: { bg: 'bg-teal-500/10 border-teal-200/60',  text: 'text-teal-800', icon: '💡' },
  warning:  { bg: 'bg-amber-50   border-amber-200/60',  text: 'text-amber-800', icon: '⚠️' },
  danger:   { bg: 'bg-red-50     border-red-200/60',    text: 'text-red-800',   icon: '🚨' },
  info:     { bg: 'bg-blue-50    border-blue-200/60',   text: 'text-blue-800',  icon: '📊' },
  tip:      { bg: 'bg-purple-50  border-purple-200/60', text: 'text-purple-800',icon: '💜' },
};

function InsightCard({ insight }) {
  const style = insightStyles[insight.type] || insightStyles.info;
  return (
    <div className={clsx('rounded-2xl border p-3.5 flex items-start gap-2.5', style.bg)}>
      <span className="text-lg shrink-0 leading-none mt-0.5">{style.icon}</span>
      <p className={clsx('text-xs font-medium leading-relaxed', style.text)}>{insight.text}</p>
    </div>
  );
}

// ─── Quick Action Buttons ─────────────────────────────────────────────────────
function QuickActions({ onIncome, onExpense }) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      <button
        onClick={onIncome}
        className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-teal-200 bg-teal-50/80 text-teal-700 font-semibold text-sm transition-all hover:bg-teal-100 active:scale-95"
      >
        <span className="text-base">↑</span>
        Money In
      </button>
      <button
        onClick={onExpense}
        className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-red-200 bg-red-50/80 text-red-600 font-semibold text-sm transition-all hover:bg-red-100 active:scale-95"
      >
        <span className="text-base">↓</span>
        Money Out
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, transactions, categories, businessMode, setBusinessMode, streakDays } = useApp();
  const navigate = useNavigate();

  const now     = new Date();
  const hour    = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'there';

  // Filter by mode (transactions without a mode tag belong to personal)
  const modeTransactions = useMemo(() =>
    transactions.filter(t =>
      businessMode === 'business'
        ? t.mode === 'business'
        : t.mode !== 'business'
    ),
  [transactions, businessMode]);

  const thisWeekTxs = useMemo(() => getRecentTransactions(modeTransactions, 7),  [modeTransactions]);
  const lastWeekTxs = useMemo(() => {
    const start = new Date(); start.setDate(start.getDate() - 14);
    const end   = new Date(); end.setDate(end.getDate() - 7);
    return modeTransactions.filter(t => new Date(t.date) >= start && new Date(t.date) < end);
  }, [modeTransactions]);

  const summary = useMemo(() => computeSummary(thisWeekTxs), [thisWeekTxs]);
  const lastSummary = useMemo(() => computeSummary(lastWeekTxs), [lastWeekTxs]);

  const thisWeekStats = { income: summary.totalIn,     expense: summary.totalOut };
  const lastWeekStats = { income: lastSummary.totalIn, expense: lastSummary.totalOut };

  const insights = useMemo(() => generateInsights(modeTransactions, categories), [modeTransactions, categories]);

  const recent = useMemo(() => thisWeekTxs.slice(0, 6), [thisWeekTxs]);

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-navy-400 text-sm">{greeting},</p>
          <h1 className="text-2xl font-bold text-navy-900">{firstName} 👋</h1>
        </div>
        <div className="flex items-center gap-2">
          <StreakBadge days={streakDays} />
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center mb-4">
        <ModeToggle mode={businessMode} onChange={setBusinessMode} />
      </div>

      {/* Balance hero */}
      <BalanceCard
        balance={summary.balance}
        totalIn={summary.totalIn}
        totalOut={summary.totalOut}
      />

      {/* Quick actions */}
      <QuickActions
        onIncome={()  => navigate('/add?type=in')}
        onExpense={() => navigate('/add?type=out')}
      />

      {/* Week comparison */}
      <WeekComparison thisWeek={thisWeekStats} lastWeek={lastWeekStats} />

      {/* Insights */}
      <div className="flex flex-col gap-2.5 mb-5">
        {insights.slice(0, 2).map((insight, i) => (
          <InsightCard key={i} insight={insight} />
        ))}
      </div>

      {/* Recent transactions */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-navy-800">Recent Transactions</h2>
          <button
            onClick={() => navigate('/history')}
            className="text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
          >
            See all →
          </button>
        </div>
        <TransactionList
          transactions={recent}
          compact
          onAddNew={() => navigate('/add')}
        />
      </div>
    </Layout>
  );
}
