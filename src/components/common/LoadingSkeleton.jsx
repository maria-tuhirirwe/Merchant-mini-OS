import { clsx } from '../../utils/clsx';

function Skeleton({ className = '' }) {
  return (
    <div className={clsx('animate-pulse bg-navy-100 rounded-xl', className)} />
  );
}

export function SummaryCardSkeleton() {
  return (
    <div className="rounded-2xl p-5 bg-navy-100 animate-pulse flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
      <Skeleton className="h-7 w-24" />
    </div>
  );
}

export function TransactionSkeleton({ count = 4 }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-card border border-navy-100">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-navy-100 animate-pulse">
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-44 w-full rounded-xl" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-6 w-40" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="col-span-2 h-28 rounded-2xl" />
      </div>
      <TransactionSkeleton count={3} />
    </div>
  );
}

export default Skeleton;
