import { clsx } from '../../utils/clsx';
import { formatCurrencyShort } from '../../utils/formatters';

const themes = {
  income: {
    bg:       'bg-gradient-to-br from-teal-500 to-teal-600',
    iconBg:   'bg-teal-400/30',
    text:     'text-white',
    subtext:  'text-teal-100',
  },
  expense: {
    bg:       'bg-gradient-to-br from-red-400 to-red-500',
    iconBg:   'bg-red-300/30',
    text:     'text-white',
    subtext:  'text-red-100',
  },
  balance: {
    bg:       'bg-gradient-to-br from-navy-800 to-navy-900',
    iconBg:   'bg-navy-600/30',
    text:     'text-white',
    subtext:  'text-navy-300',
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
      'rounded-2xl p-5 flex flex-col gap-3 shadow-card-md',
      t.bg, className,
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
