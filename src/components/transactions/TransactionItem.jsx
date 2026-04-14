import { formatCurrencyShort, formatDateShort, getCategoryColor, getCategoryIcon } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';
import { clsx } from '../../utils/clsx';

export default function TransactionItem({ transaction, onEdit, onDelete, compact = false }) {
  const { categories } = useApp();
  const { type, amount, category, date, note } = transaction;

  const isIncome  = type === 'in';
  const color     = getCategoryColor(category, categories);
  const icon      = getCategoryIcon(category, categories);

  return (
    <div className={clsx(
      'bg-white rounded-2xl border border-navy-100 shadow-card flex items-center gap-3',
      compact ? 'p-3' : 'p-4',
    )}>
      {/* Category icon */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-navy-800 truncate">{category}</p>
        {note && (
          <p className="text-xs text-navy-400 truncate mt-0.5">{note}</p>
        )}
        {!compact && (
          <p className="text-xs text-navy-300 mt-0.5">{formatDateShort(date)}</p>
        )}
      </div>

      {/* Amount + actions */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className={clsx(
          'text-sm font-bold',
          isIncome ? 'text-teal-600' : 'text-red-500',
        )}>
          {isIncome ? '+' : '-'}{formatCurrencyShort(amount)}
        </span>
        {compact && (
          <span className="text-[10px] text-navy-300">{formatDateShort(date)}</span>
        )}
        {(onEdit || onDelete) && !compact && (
          <div className="flex gap-1 mt-1">
            {onEdit && (
              <button
                onClick={() => onEdit(transaction)}
                className="text-navy-300 hover:text-teal-600 transition-colors p-0.5"
                aria-label="Edit"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(transaction)}
                className="text-navy-300 hover:text-red-500 transition-colors p-0.5"
                aria-label="Delete"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
