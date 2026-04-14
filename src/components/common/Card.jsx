import { clsx } from '../../utils/clsx';

export default function Card({ children, className = '', padding = true, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-2xl shadow-card border border-navy-100',
        padding && 'p-4',
        onClick && 'cursor-pointer hover:shadow-card-md transition-shadow duration-150',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
