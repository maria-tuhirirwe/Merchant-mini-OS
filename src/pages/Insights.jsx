import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useApp } from '../context/AppContext';
import {
  computeSummary,
  getRecentTransactions,
  getCategoryBreakdown,
  generateInsights,
} from '../data/sampleData';
import { formatCurrencyShort } from '../utils/formatters';
import { clsx } from '../utils/clsx';

// ─── Insight card styles ──────────────────────────────────────────────────────
const insightStyles = {
  positive: { bg: 'bg-teal-50  border-teal-200',  text: 'text-teal-800',   icon: '💡' },
  warning:  { bg: 'bg-amber-50 border-amber-200',  text: 'text-amber-800',  icon: '⚠️' },
  danger:   { bg: 'bg-red-50   border-red-200',    text: 'text-red-800',    icon: '🚨' },
  info:     { bg: 'bg-blue-50  border-blue-200',   text: 'text-blue-800',   icon: '📊' },
  tip:      { bg: 'bg-purple-50 border-purple-200',text: 'text-purple-800', icon: '💜' },
};

// ─── Category spending bar ────────────────────────────────────────────────────
function CategoryBar({ name, amount, total, icon, color }) {
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-navy-700">{name}</span>
          <span className="text-xs font-bold text-navy-600">{formatCurrencyShort(amount)}</span>
        </div>
        <div className="h-1.5 bg-navy-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
      </div>
      <span className="text-[10px] text-navy-400 font-medium w-8 text-right shrink-0">{pct}%</span>
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ label, value, sub, color }) {
  return (
    <div className={clsx(
      'rounded-2xl p-4 flex flex-col gap-1',
      color === 'teal' ? 'bg-teal-500/10 border border-teal-200/60' :
      color === 'red'  ? 'bg-red-50 border border-red-200/60' :
      color === 'navy' ? 'bg-navy-800/90 border border-navy-600/30' :
                         'bg-white/70 border border-navy-100',
    )}>
      <p className={clsx(
        'text-[10px] font-semibold uppercase tracking-widest',
        color === 'teal' ? 'text-teal-600' :
        color === 'red'  ? 'text-red-500' :
        color === 'navy' ? 'text-navy-300' :
                           'text-navy-400',
      )}>
        {label}
      </p>
      <p className={clsx(
        'text-xl font-bold',
        color === 'navy' ? 'text-white' : 'text-navy-900',
      )}>
        {value}
      </p>
      {sub && (
        <p className={clsx(
          'text-[10px]',
          color === 'teal' ? 'text-teal-500' :
          color === 'red'  ? 'text-red-400' :
          color === 'navy' ? 'text-navy-400' :
                             'text-navy-400',
        )}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Insights() {
  const { transactions, categories, businessMode, streakDays } = useApp();
  const navigate = useNavigate();

  const modeTransactions = useMemo(() =>
    transactions.filter(t =>
      businessMode === 'business'
        ? t.mode === 'business'
        : t.mode !== 'business'
    ),
  [transactions, businessMode]);

  const thisWeek = useMemo(() => getRecentTransactions(modeTransactions, 7),   [modeTransactions]);
  const thisMonth = useMemo(() => getRecentTransactions(modeTransactions, 30),  [modeTransactions]);

  const weekSummary  = useMemo(() => computeSummary(thisWeek),  [thisWeek]);
  const monthSummary = useMemo(() => computeSummary(thisMonth), [thisMonth]);

  // Last week for comparison
  const lastWeekTxs = useMemo(() => {
    const start = new Date(); start.setDate(start.getDate() - 14);
    const end   = new Date(); end.setDate(end.getDate() - 7);
    return modeTransactions.filter(t => new Date(t.date) >= start && new Date(t.date) < end);
  }, [modeTransactions]);
  const lastWeekSummary = useMemo(() => computeSummary(lastWeekTxs), [lastWeekTxs]);

  const catBreakdown = useMemo(() => getCategoryBreakdown(thisWeek, 'out'), [thisWeek]);
  const insights     = useMemo(() => generateInsights(modeTransactions, categories), [modeTransactions, categories]);

  // Daily average spend
  const dailyAvg = Math.round(monthSummary.totalOut / 30);

  // Savings rate
  const savingsRate = monthSummary.totalIn > 0
    ? Math.max(0, Math.round(((monthSummary.totalIn - monthSummary.totalOut) / monthSummary.totalIn) * 100))
    : 0;

  // Week-over-week income change
  const incomePct = lastWeekSummary.totalIn > 0
    ? Math.round(((weekSummary.totalIn - lastWeekSummary.totalIn) / lastWeekSummary.totalIn) * 100)
    : null;

  const catWithMeta = catBreakdown.map(item => {
    const found = categories.find(c => c.name === item.name);
    return { ...item, icon: found?.icon || '📝', color: found?.color || '#94a3b8' };
  });

  return (
    <Layout title="Insights" subtitle="How your money is moving">

      {/* Streak banner */}
      {streakDays >= 2 && (
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-4 mb-5 flex items-center gap-3">
          <span className="text-3xl leading-none">🔥</span>
          <div>
            <p className="text-white font-bold text-base leading-tight">{streakDays}-Day Streak!</p>
            <p className="text-amber-100 text-xs mt-0.5">
              You&apos;ve tracked money for {streakDays} days in a row. Keep it up!
            </p>
          </div>
        </div>
      )}

      {/* Month overview stats */}
      <p className="text-xs font-semibold text-navy-500 uppercase tracking-widest mb-3">This Month</p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatPill label="Income"       value={formatCurrencyShort(monthSummary.totalIn)}  color="teal" sub="Total received" />
        <StatPill label="Expenses"     value={formatCurrencyShort(monthSummary.totalOut)} color="red"  sub="Total spent" />
        <StatPill label="Balance"      value={formatCurrencyShort(monthSummary.balance)}  color="navy" sub="Net position" />
        <StatPill label="Savings Rate" value={`${savingsRate}%`}  color="" sub="of income saved" />
      </div>

      {/* Weekly highlights */}
      <p className="text-xs font-semibold text-navy-500 uppercase tracking-widest mb-3">This Week</p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatPill
          label="Daily Avg Spend"
          value={formatCurrencyShort(dailyAvg)}
          color=""
          sub="per day this month"
        />
        <StatPill
          label="Income vs Last Wk"
          value={incomePct !== null ? `${incomePct >= 0 ? '+' : ''}${incomePct}%` : '—'}
          color={incomePct >= 0 ? 'teal' : 'red'}
          sub="week-over-week"
        />
      </div>

      {/* AI Insights */}
      <p className="text-xs font-semibold text-navy-500 uppercase tracking-widest mb-3">Smart Insights</p>
      <div className="flex flex-col gap-2.5 mb-5">
        {insights.map((insight, i) => {
          const style = insightStyles[insight.type] || insightStyles.info;
          return (
            <div key={i} className={clsx('rounded-2xl border p-4 flex items-start gap-3', style.bg)}>
              <span className="text-xl shrink-0 leading-none mt-0.5">{style.icon}</span>
              <p className={clsx('text-sm font-medium leading-relaxed', style.text)}>{insight.text}</p>
            </div>
          );
        })}
      </div>

      {/* Category breakdown */}
      {catWithMeta.length > 0 && (
        <>
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-widest mb-3">
            Where Your Money Went (This Week)
          </p>
          <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-4 mb-5 shadow-card flex flex-col gap-3">
            {catWithMeta.slice(0, 6).map(item => (
              <CategoryBar
                key={item.name}
                name={item.name}
                amount={item.value}
                total={weekSummary.totalOut}
                icon={item.icon}
                color={item.color}
              />
            ))}
          </div>
        </>
      )}

      {/* CTA */}
      <button
        onClick={() => navigate('/add')}
        className="w-full py-4 rounded-2xl font-bold text-sm bg-teal-600 text-white hover:bg-teal-700 transition-all active:scale-95 mb-2"
      >
        + Record a Transaction
      </button>
    </Layout>
  );
}
