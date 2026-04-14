import Button from './Button';

export default function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load your data. Please try again.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
      <h3 className="text-navy-800 font-semibold text-base mb-1">{title}</h3>
      <p className="text-navy-400 text-sm max-w-xs">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-5">
          Try Again
        </Button>
      )}
    </div>
  );
}
