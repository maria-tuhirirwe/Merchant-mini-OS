import { useNavigate } from 'react-router-dom';
import { formatCurrencyShort, formatDateShort } from '../../utils/formatters';
import { getLoanBalance, getLoanProgress, isOverdue } from '../../data/loansData';
import { clsx } from '../../utils/clsx';

const statusConfig = {
  pending: { label: 'Pending',  bg: 'bg-amber-100',  text: 'text-amber-700'  },
  partial: { label: 'Partial',  bg: 'bg-blue-100',   text: 'text-blue-700'   },
  settled: { label: 'Settled',  bg: 'bg-teal-100',   text: 'text-teal-700'   },
};

export default function LoanItem({ loan }) {
  const navigate  = useNavigate();
  const balance   = getLoanBalance(loan);
  const progress  = getLoanProgress(loan);
  const overdue   = isOverdue(loan);
  const isLent    = loan.direction === 'lent';
  const cfg       = statusConfig[loan.status] || statusConfig.pending;

  return (
    <div
      onClick={() => navigate(`/loans/${loan.id}`)}
      className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 shadow-card p-4 cursor-pointer hover:bg-white/80 hover:shadow-card-md transition-all"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className={clsx(
            'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
            isLent ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-600',
          )}>
            {loan.personName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-navy-900 truncate">{loan.personName}</p>
            <p className="text-xs text-navy-400 mt-0.5">
              {isLent ? 'You lent' : 'You borrowed'} · {formatDateShort(loan.date)}
            </p>
          </div>
        </div>

        {/* Right: amount + status */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={clsx(
            'text-sm font-bold',
            isLent ? 'text-teal-600' : 'text-red-500',
          )}>
            {formatCurrencyShort(loan.amount)}
          </span>
          <span className={clsx('text-[10px] font-semibold px-2 py-0.5 rounded-full', cfg.bg, cfg.text)}>
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      {loan.status !== 'pending' && (
        <div className="mb-2">
          <div className="h-1.5 bg-navy-100 rounded-full overflow-hidden">
            <div
              className={clsx('h-full rounded-full transition-all', isLent ? 'bg-teal-500' : 'bg-red-400')}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between text-xs text-navy-400">
        <span>
          {loan.status === 'settled'
            ? 'Fully settled'
            : `${formatCurrencyShort(balance)} remaining`}
        </span>
        {loan.dueDate && loan.status !== 'settled' && (
          <span className={clsx(overdue ? 'text-red-500 font-semibold' : 'text-navy-400')}>
            {overdue ? 'Overdue · ' : 'Due '}{formatDateShort(loan.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}
