import { clsx } from '../../utils/clsx';

export default function SegmentedControl({ options = [], value, onChange, className = '' }) {
  return (
    <div className={clsx(
      'inline-flex bg-navy-100 rounded-xl p-0.5 gap-0.5',
      className,
    )}>
      {options.map(opt => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={clsx(
              'flex-1 px-3 py-1 rounded-[10px] text-xs font-medium transition-all duration-150 focus:outline-none whitespace-nowrap',
              isActive
                ? 'bg-white text-navy-800 shadow-sm'
                : 'text-navy-500 hover:text-navy-700',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
