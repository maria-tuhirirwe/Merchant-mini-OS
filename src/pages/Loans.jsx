import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { computeLoanSummary, isOverdue } from '../data/loansData';
import { formatCurrencyShort } from '../utils/formatters';
import { clsx } from '../utils/clsx';
import Layout from '../components/layout/Layout';
import SegmentedControl from '../components/common/SegmentedControl';
import LoanItem from '../components/loans/LoanItem';
import EmptyState from '../components/common/EmptyState';

const TABS = [
  { value: 'lent',     label: 'Money Lent' },
  { value: 'borrowed', label: 'Money Borrowed' },
];

export default function Loans() {
  const { loans } = useApp();
  const navigate   = useNavigate();
  const [tab, setTab] = useState('lent');

  const summary  = useMemo(() => computeLoanSummary(loans), [loans]);
  const filtered = useMemo(
    () => loans.filter(l => l.direction === tab),
    [loans, tab],
  );
  const overdueCount = useMemo(
    () => filtered.filter(l => isOverdue(l)).length,
    [filtered],
  );

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Loans</h1>
          <p className="text-xs text-navy-400 mt-0.5">Track money lent &amp; borrowed</p>
        </div>
        <button
          onClick={() => navigate('/loans/add')}
          className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-card-md hover:bg-teal-700 transition-colors"
          aria-label="Add loan"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 backdrop-blur-sm rounded-2xl p-4 shadow-card-md border border-teal-400/30">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-100 mb-1">You're Owed</p>
          <p className="text-xl font-bold text-white">{formatCurrencyShort(summary.outstandingLent)}</p>
          <p className="text-[10px] text-teal-200 mt-0.5">outstanding lent</p>
        </div>
        <div className="bg-gradient-to-br from-red-400 to-red-500 backdrop-blur-sm rounded-2xl p-4 shadow-card-md border border-red-300/30">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-red-100 mb-1">You Owe</p>
          <p className="text-xl font-bold text-white">{formatCurrencyShort(summary.outstandingOwed)}</p>
          <p className="text-[10px] text-red-200 mt-0.5">outstanding borrowed</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-4">
        <SegmentedControl
          options={TABS}
          value={tab}
          onChange={setTab}
          className="flex-1"
        />
        {overdueCount > 0 && (
          <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-1 rounded-full shrink-0">
            {overdueCount} overdue
          </span>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={tab === 'lent' ? '🤝' : '💸'}
          title={tab === 'lent' ? 'No money lent yet' : 'No borrowed money recorded'}
          description={
            tab === 'lent'
              ? 'Tap + to record money you\'ve lent to someone.'
              : 'Tap + to record money you\'ve borrowed from someone.'
          }
          actionLabel="Record a loan"
          onAction={() => navigate('/loans/add')}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(loan => (
            <LoanItem key={loan.id} loan={loan} />
          ))}
        </div>
      )}
    </Layout>
  );
}
