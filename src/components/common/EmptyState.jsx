import Button from './Button';

export default function EmptyState({
  icon = '📭',
  title = 'Nothing here yet',
  description = '',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-navy-800 font-semibold text-base mb-1">{title}</h3>
      {description && (
        <p className="text-navy-400 text-sm max-w-xs">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-5" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
