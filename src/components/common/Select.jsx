import { forwardRef } from 'react';
import { clsx } from '../../utils/clsx';

const Select = forwardRef(function Select({
  label,
  error,
  hint,
  options = [],
  placeholder = 'Select...',
  className = '',
  wrapperClassName = '',
  ...props
}, ref) {
  return (
    <div className={clsx('flex flex-col gap-1', wrapperClassName)}>
      {label && (
        <label className="text-sm font-medium text-navy-700">{label}</label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={clsx(
            'w-full appearance-none rounded-xl border bg-white px-4 py-2.5 pr-10 text-sm text-navy-900 transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500',
            error
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
              : 'border-navy-200 hover:border-navy-300',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>{placeholder}</option>
          )}
          {options.map(opt =>
            typeof opt === 'string'
              ? <option key={opt} value={opt}>{opt}</option>
              : <option key={opt.value} value={opt.value}>{opt.label}</option>
          )}
        </select>
        {/* Chevron icon */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-navy-400">{hint}</p>}
    </div>
  );
});

export default Select;
