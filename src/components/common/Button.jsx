import { clsx } from '../../utils/clsx';

const variants = {
  primary:   'bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-sm',
  secondary: 'bg-navy-800 hover:bg-navy-900 active:bg-navy-900 text-white shadow-sm',
  outline:   'border border-teal-600 text-teal-700 hover:bg-teal-50 active:bg-teal-100 bg-white',
  ghost:     'text-navy-600 hover:bg-navy-100 active:bg-navy-200 bg-transparent',
  danger:    'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm',
  'danger-outline': 'border border-red-400 text-red-600 hover:bg-red-50 active:bg-red-100 bg-white',
};

const sizes = {
  sm:   'px-3 py-1.5 text-sm rounded-lg',
  md:   'px-4 py-2.5 text-sm rounded-xl',
  lg:   'px-5 py-3 text-base rounded-xl',
  icon: 'p-2.5 rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
