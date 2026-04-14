import { clsx } from '../../utils/clsx';

export default function SegmentedControl({ options = [], value, onChange, className = '' }) {
  return (
    <div className={clsx(
      'inline-flex bg-navy-100 rounded-xl p-1 gap-1',
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
              'flex-1 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none',
              isActive
                ? 'bg-white text-teal-700 shadow-sm'
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
