import { forwardRef } from 'react';
import { clsx } from '../../utils/clsx';

const Input = forwardRef(function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  wrapperClassName = '',
  ...props
}, ref) {
  return (
    <div className={clsx('flex flex-col gap-1', wrapperClassName)}>
      {label && (
        <label className="text-sm font-medium text-navy-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-navy-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-navy-900 placeholder-navy-400 transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500',
            error
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
              : 'border-navy-200 hover:border-navy-300',
            leftIcon  && 'pl-10',
            rightIcon && 'pr-10',
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 text-navy-400">
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-navy-400">{hint}</p>
      )}
    </div>
  );
});

export default Input;
