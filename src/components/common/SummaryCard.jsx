import { clsx } from '../../utils/clsx';
import { formatCurrencyShort } from '../../utils/formatters';

const themes = {
  income: {
    bg:      'bg-gradient-to-br from-teal-500/90 to-teal-600/90',
    border:  'border-teal-400/30',
    iconBg:  'bg-white/20',
    text:    'text-white',
    subtext: 'text-teal-100',
  },
  expense: {
    bg:      'bg-gradient-to-br from-red-400/90 to-red-500/90',
    border:  'border-red-300/30',
    iconBg:  'bg-white/20',
    text:    'text-white',
    subtext: 'text-red-100',
  },
  balance: {
    bg:      'bg-gradient-to-br from-navy-800/90 to-navy-900/90',
    border:  'border-navy-600/30',
    iconBg:  'bg-white/10',
    text:    'text-white',
    subtext: 'text-navy-300',
  },
};

export default function SummaryCard({
  label,
  amount,
  icon,
  theme = 'income',
  loading = false,
  className = '',
}) {
  const t = themes[theme] || themes.income;

  return (
    <div className={clsx(
      'rounded-2xl p-5 flex flex-col gap-3 shadow-card-md backdrop-blur-sm border',
      t.bg, t.border, className,
    )}>
      <div className="flex items-center justify-between">
        <span className={clsx('text-xs font-semibold uppercase tracking-widest', t.subtext)}>
          {label}
        </span>
        <span className={clsx('w-9 h-9 rounded-full flex items-center justify-center text-lg', t.iconBg)}>
          {icon}
        </span>
      </div>
      {loading ? (
        <div className="h-7 w-28 rounded-lg bg-white/20 animate-pulse" />
      ) : (
        <p className={clsx('text-2xl font-bold tracking-tight', t.text)}>
          {formatCurrencyShort(amount)}
        </p>
      )}
    </div>
  );
}
