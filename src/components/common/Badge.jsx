import { clsx } from '../../utils/clsx';

const variants = {
  income:  'bg-teal-100 text-teal-700',
  expense: 'bg-red-100 text-red-600',
  neutral: 'bg-navy-100 text-navy-600',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
};

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
      variants[variant],
      className,
    )}>
      {children}
    </span>
  );
}
