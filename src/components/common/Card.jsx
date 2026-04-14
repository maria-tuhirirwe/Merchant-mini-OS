import { clsx } from '../../utils/clsx';

export default function Card({ children, className = '', padding = true, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white/70 backdrop-blur-md rounded-2xl shadow-card border border-white/60',
        padding && 'p-4',
        onClick && 'cursor-pointer hover:bg-white/80 hover:shadow-card-md transition-all duration-150',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
