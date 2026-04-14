import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getLoanBalance, getLoanProgress, isOverdue } from '../data/loansData';
import { formatCurrencyShort, formatCurrency, formatDateShort } from '../utils/formatters';
import { clsx } from '../utils/clsx';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { ConfirmModal } from '../components/common/Modal';

const statusConfig = {
  pending: { label: 'Pending',  bg: 'bg-amber-100',  text: 'text-amber-700'  },
  partial: { label: 'Partial',  bg: 'bg-blue-100',   text: 'text-blue-700'   },
  settled: { label: 'Settled',  bg: 'bg-teal-100',   text: 'text-teal-700'   },
};

export default function LoanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loans, addLoanPayment, deleteLoan } = useApp();

  const loan = loans.find(l => l.id === id);

  // Payment modal state
  const [payModal, setPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payNote, setPayNote] = useState('');
  const [payError, setPayError] = useState('');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState(false);

  if (!loan) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">🔍</span>
          <h2 className="text-navy-800 font-semibold text-base mb-1">Loan not found</h2>
          <p className="text-navy-400 text-sm mb-5">This loan may have been deleted.</p>
          <Button onClick={() => navigate('/loans')}>Back to Loans</Button>
        </div>
      </Layout>
    );
  }

  const balance  = getLoanBalance(loan);
  const progress = getLoanProgress(loan);
  const overdue  = isOverdue(loan);
  const isLent   = loan.direction === 'lent';
  const cfg      = statusConfig[loan.status] || statusConfig.pending;

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const amt = Number(payAmount);
    if (!amt || amt <= 0) { setPayError('Enter a valid amount'); return; }
    if (amt > balance)    { setPayError(`Amount exceeds remaining balance of ${formatCurrencyShort(balance)}`); return; }

    addLoanPayment(loan.id, amt, payDate, payNote.trim() || undefined);
    setPayModal(false);
    setPayAmount('');
    setPayDate(new Date().toISOString().split('T')[0]);
    setPayNote('');
    setPayError('');
  };

  const handleDelete = () => {
    deleteLoan(loan.id);
    navigate('/loans');
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-navy-500 hover:bg-navy-100 transition-colors shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-navy-900 truncate">{loan.personName}</h1>
          <p className="text-xs text-navy-400 mt-0.5">
            {isLent ? 'You lent money · ' : 'You borrowed · '}
            {formatDateShort(loan.date)}
          </p>
        </div>
        <button
          onClick={() => setDeleteModal(true)}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-50 transition-colors shrink-0"
          aria-label="Delete loan"
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Main info card */}
      <div className="bg-white rounded-2xl border border-navy-100 shadow-card p-5 mb-4">
        {/* Amount + status */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-navy-400 mb-1">Total Amount</p>
            <p className={clsx('text-3xl font-bold', isLent ? 'text-teal-600' : 'text-red-500')}>
              {formatCurrencyShort(loan.amount)}
            </p>
          </div>
          <span className={clsx('text-xs font-semibold px-3 py-1 rounded-full mt-1', cfg.bg, cfg.text)}>
            {cfg.label}
          </span>
        </div>

        {/* Progress bar */}
        {loan.status !== 'pending' && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-navy-400 mb-1.5">
              <span>{progress}% repaid</span>
              <span>{formatCurrencyShort(balance)} remaining</span>
            </div>
            <div className="h-2 bg-navy-100 rounded-full overflow-hidden">
              <div
                className={clsx('h-full rounded-full transition-all', isLent ? 'bg-teal-500' : 'bg-red-400')}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Meta rows */}
        <div className="flex flex-col gap-2 text-sm">
          {loan.dueDate && (
            <div className="flex items-center justify-between">
              <span className="text-navy-400">Due date</span>
              <span className={clsx('font-medium', overdue && loan.status !== 'settled' ? 'text-red-500' : 'text-navy-700')}>
                {overdue && loan.status !== 'settled' ? 'Overdue · ' : ''}{formatDateShort(loan.dueDate)}
              </span>
            </div>
          )}
          {loan.notes && (
            <div className="flex items-start justify-between gap-4">
              <span className="text-navy-400 shrink-0">Notes</span>
              <span className="text-navy-700 text-right">{loan.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Record payment button */}
      {loan.status !== 'settled' && (
        <Button
          fullWidth
          size="lg"
          onClick={() => setPayModal(true)}
          className="mb-5"
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Record Payment
        </Button>
      )}

      {/* Payment history */}
      <div>
        <h2 className="text-sm font-semibold text-navy-700 mb-3">
          Payment History
          {loan.payments.length > 0 && (
            <span className="ml-2 text-xs font-normal text-navy-400">({loan.payments.length})</span>
          )}
        </h2>

        {loan.payments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-navy-100 p-6 text-center">
            <p className="text-navy-400 text-sm">No payments recorded yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {[...loan.payments].reverse().map(pay => (
              <div
                key={pay.id}
                className="bg-white rounded-xl border border-navy-100 px-4 py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                    isLent ? 'bg-teal-100' : 'bg-red-100',
                  )}>
                    <svg className={clsx('w-4 h-4', isLent ? 'text-teal-600' : 'text-red-500')}
                      fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy-800 truncate">
                      {pay.note || 'Payment'}
                    </p>
                    <p className="text-xs text-navy-400">{formatDateShort(pay.date)}</p>
                  </div>
                </div>
                <span className={clsx('text-sm font-bold shrink-0', isLent ? 'text-teal-600' : 'text-red-500')}>
                  {formatCurrencyShort(pay.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      <Modal
        isOpen={payModal}
        onClose={() => { setPayModal(false); setPayError(''); }}
        title="Record Payment"
      >
        <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
          <div className="text-xs text-navy-500 bg-navy-50 rounded-xl px-4 py-3">
            Balance remaining: <span className="font-bold text-navy-800">{formatCurrency(balance)}</span>
          </div>

          <Input
            label="Amount (UGX)"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            placeholder="0"
            value={payAmount}
            onChange={e => { setPayAmount(e.target.value); setPayError(''); }}
            error={payError}
            leftIcon={<span className="text-xs font-semibold">USh</span>}
            autoFocus
          />

          {/* Quick fill buttons */}
          <div className="flex gap-2 flex-wrap -mt-2">
            {balance > 0 && (
              <button
                type="button"
                onClick={() => setPayAmount(String(balance))}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-teal-400 text-teal-700 bg-teal-50 hover:bg-teal-100 transition-all"
              >
                Full balance
              </button>
            )}
            {[25000, 50000, 100000].filter(a => a < balance).map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setPayAmount(String(amt))}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-navy-200 text-navy-600 bg-white hover:border-teal-400 transition-all"
              >
                {amt >= 1000 ? `${amt / 1000}k` : amt}
              </button>
            ))}
          </div>

          <Input
            label="Date"
            type="date"
            value={payDate}
            onChange={e => setPayDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-navy-700">Note (optional)</label>
            <input
              type="text"
              value={payNote}
              onChange={e => setPayNote(e.target.value)}
              placeholder="e.g. First instalment"
              className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-navy-300 transition-all"
            />
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <Button type="button" variant="ghost" onClick={() => { setPayModal(false); setPayError(''); }}>
              Cancel
            </Button>
            <Button type="submit">Save Payment</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Loan"
        message={`Delete this loan with ${loan.personName}? This cannot be undone. Any auto-created transactions will remain in your history.`}
        confirmLabel="Delete"
      />
    </Layout>
  );
}
