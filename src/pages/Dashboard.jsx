import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SummaryCard from '../components/common/SummaryCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import SegmentedControl from '../components/common/SegmentedControl';
import TransactionList from '../components/transactions/TransactionList';
import ChartCard from '../components/charts/ChartCard';
import SpendingChart from '../components/charts/SpendingChart';
import CategoryChart from '../components/charts/CategoryChart';
import { useApp } from '../context/AppContext';
import {
  computeSummary,
  getRecentTransactions,
  getDailyChartData,
  getCategoryBreakdown,
  insightMessages,
} from '../data/sampleData';

const periodOptions = [
  { label: 'Daily',  value: 'daily'  },
  { label: 'Weekly', value: 'weekly' },
];

const chartOptions = [
  { label: 'Trend',      value: 'trend'    },
  { label: 'Categories', value: 'category' },
];

export default function Dashboard() {
  const { user, transactions } = useApp();
  const navigate = useNavigate();

  const [period,    setPeriod]    = useState('weekly');
  const [chartType, setChartType] = useState('trend');

  const days = period === 'daily' ? 1 : 7;

  const recent     = useMemo(() => getRecentTransactions(transactions, days), [transactions, days]);
  const summary    = useMemo(() => computeSummary(recent), [recent]);
  const chartData  = useMemo(() => getDailyChartData(transactions, 7), [transactions]);
  const catData    = useMemo(() => getCategoryBreakdown(recent, 'out'), [recent]);

  const insight = useMemo(() => {
    return insightMessages[Math.floor(Math.random() * insightMessages.length)];
  }, [period]);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Layout>
      {/* Header greeting */}
      <div className="mb-5">
        <p className="text-navy-400 text-sm">{greeting},</p>
        <h1 className="text-2xl font-bold text-navy-900">{firstName} 👋</h1>
      </div>

      {/* Period toggle */}
      <div className="mb-4">
        <SegmentedControl
          options={periodOptions}
          value={period}
          onChange={setPeriod}
        />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <SummaryCard
          label="Money In"
          amount={summary.totalIn}
          icon="↑"
          theme="income"
        />
        <SummaryCard
          label="Money Out"
          amount={summary.totalOut}
          icon="↓"
          theme="expense"
        />
        <SummaryCard
          label="Balance"
          amount={summary.balance}
          icon="◈"
          theme="balance"
          className="col-span-2"
        />
      </div>

      {/* Insight banner */}
      <Card className="!p-3.5 mb-4 bg-teal-500/10 !border-teal-200/60">
        <div className="flex items-start gap-2">
          <span className="text-lg shrink-0">💡</span>
          <p className="text-xs text-teal-800 font-medium leading-relaxed">{insight}</p>
        </div>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Button
          onClick={() => navigate('/add?type=in')}
          variant="outline"
          fullWidth
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }
          className="border-teal-200 text-teal-700 hover:bg-teal-50/60 backdrop-blur-sm"
        >
          Money In
        </Button>
        <Button
          onClick={() => navigate('/add?type=out')}
          variant="outline"
          fullWidth
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          }
          className="border-red-200 text-red-600 hover:bg-red-50/60 backdrop-blur-sm"
        >
          Money Out
        </Button>
      </div>

      {/* Chart section */}
      <ChartCard
        title={chartType === 'trend' ? 'Income vs Expenses' : 'Spending by Category'}
        toggle={chartType}
        onToggle={setChartType}
        toggleOptions={chartOptions}
      >
        {chartType === 'trend'
          ? <SpendingChart data={chartData} />
          : <CategoryChart data={catData} />
        }
        {chartType === 'trend' && (
          <div className="flex gap-4 mt-2 justify-center">
            <div className="flex items-center gap-1.5 text-xs text-navy-500">
              <span className="w-3 h-0.5 rounded-full bg-teal-500 inline-block" />
              Money In
            </div>
            <div className="flex items-center gap-1.5 text-xs text-navy-500">
              <span className="w-3 h-0.5 rounded-full bg-red-400 inline-block" />
              Money Out
            </div>
          </div>
        )}
      </ChartCard>

      {/* Recent transactions */}
      <div className="mt-5">
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
          transactions={recent.slice(0, 6)}
          compact
          onAddNew={() => navigate('/add')}
        />
      </div>
    </Layout>
  );
}
