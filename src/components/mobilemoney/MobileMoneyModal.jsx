import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from '../../utils/clsx';
import { getProviderLabel } from '../../utils/momoSimulator';
import { formatCurrency, formatDateShort } from '../../utils/formatters';
import Button from '../common/Button';

/**
 * Bottom-sheet modal for Mobile Money flow.
 * status: 'pending' | 'success' | 'failed'
 */
export default function MobileMoneyModal({
  isOpen,
  status,
  details,
  onCancel,
  onRetry,
  onRecordManually,
  onAddAnother,
}) {
  const navigate = useNavigate();
  const providerLabel = getProviderLabel(details?.provider);

  // Trap scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape to cancel (only when pending)
  useEffect(() => {
    if (!isOpen || status !== 'pending') return;
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, status, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-900/40 backdrop-blur-md"
        onClick={status === 'pending' ? onCancel : undefined}
      />

      {/* Sheet */}
      <div className={clsx(
        'relative w-full sm:max-w-md bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl',
        'rounded-t-3xl sm:rounded-3xl overflow-hidden',
        'transition-transform duration-300',
      )}>
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-navy-200" />
        </div>

        <div className="px-6 pb-8 pt-4">
          {status === 'pending' && <PendingContent details={details} providerLabel={providerLabel} onCancel={onCancel} />}
          {status === 'success' && <SuccessContent details={details} providerLabel={providerLabel} onAddAnother={onAddAnother} onDashboard={() => navigate('/dashboard')} />}
          {status === 'failed'  && <FailedContent  details={details} providerLabel={providerLabel} onRetry={onRetry} onRecordManually={onRecordManually} />}
        </div>
      </div>
    </div>
  );
}

/* ─── Pending ─────────────────────────────────────────────────────────────── */

function PendingContent({ details, providerLabel, onCancel }) {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* Pulsing icon */}
      <div className="relative mt-2">
        <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
        <div className="relative w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center text-3xl">
          📱
        </div>
      </div>

      {/* Heading */}
      <div className="text-center">
        <h2 className="text-lg font-bold text-navy-900">Check your phone</h2>
        <p className="text-sm text-navy-500 mt-1 leading-relaxed">
          {providerLabel} has sent a prompt to{' '}
          <span className="font-semibold text-navy-700">{details.phone}</span>.
          <br />Approve it to complete the payment.
        </p>
      </div>

      {/* Summary */}
      <ReceiptCard details={details} providerLabel={providerLabel} />

      {/* Waiting indicator */}
      <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 w-full justify-center">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
        Waiting for approval…
      </div>

      <Button variant="ghost" onClick={onCancel} className="w-full text-navy-500">
        Cancel
      </Button>
    </div>
  );
}

/* ─── Success ─────────────────────────────────────────────────────────────── */

function SuccessContent({ details, providerLabel, onAddAnother, onDashboard }) {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* Checkmark */}
      <div className="mt-2 w-16 h-16 rounded-full bg-teal-100 border-2 border-teal-300 flex items-center justify-center animate-[scale-in_0.3s_ease-out]">
        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="text-center">
        <h2 className="text-lg font-bold text-navy-900">Payment confirmed!</h2>
        <p className="text-sm text-navy-400 mt-1">Saved to your records.</p>
      </div>

      <ReceiptCard details={details} providerLabel={providerLabel} success />

      <div className="flex gap-3 w-full">
        <Button variant="outline" onClick={onAddAnother} fullWidth>
          Add Another
        </Button>
        <Button onClick={onDashboard} fullWidth>
          Dashboard
        </Button>
      </div>
    </div>
  );
}

/* ─── Failed ──────────────────────────────────────────────────────────────── */

function FailedContent({ details, providerLabel, onRetry, onRecordManually }) {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* Warning icon */}
      <div className="mt-2 w-16 h-16 rounded-full bg-red-50 border-2 border-red-300 flex items-center justify-center text-3xl">
        ⚠️
      </div>

      <div className="text-center">
        <h2 className="text-lg font-bold text-navy-900">Payment not confirmed</h2>
        <p className="text-sm text-navy-500 mt-1 leading-relaxed">
          The {providerLabel} request was not approved or timed out.
        </p>
      </div>

      {/* Amount + failed badge */}
      <div className="w-full bg-white/70 border border-red-100 rounded-2xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-navy-400 mb-0.5">Amount</p>
          <p className="text-lg font-bold text-navy-900">{formatCurrency(details.amount)}</p>
        </div>
        <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
          FAILED
        </span>
      </div>

      <div className="flex flex-col gap-2.5 w-full">
        <Button variant="danger" onClick={onRetry} fullWidth leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        }>
          Try Again
        </Button>
        <Button variant="ghost" onClick={onRecordManually} fullWidth className="text-navy-600">
          Record Manually Instead
        </Button>
      </div>
    </div>
  );
}

/* ─── Shared receipt card ─────────────────────────────────────────────────── */

function ReceiptCard({ details, providerLabel, success = false }) {
  return (
    <div className={clsx(
      'w-full rounded-2xl border overflow-hidden',
      success ? 'bg-teal-50/60 border-teal-100' : 'bg-white/70 border-navy-100',
    )}>
      <Row label="Amount"   value={formatCurrency(details.amount)} highlight={success} />
      <Row label="Provider" value={providerLabel} />
      <Row label="To / From" value={details.phone} />
      <Row label="Category" value={details.category} />
      <Row label="Date"     value={formatDateShort(details.date)} />
      {details.note && (
        <div className="px-4 py-2.5 border-t border-navy-50">
          <p className="text-xs text-navy-400 italic truncate">{details.note}</p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-navy-50 last:border-b-0">
      <span className="text-xs text-navy-400">{label}</span>
      <span className={clsx('text-sm font-semibold', highlight ? 'text-teal-600' : 'text-navy-800')}>
        {value}
      </span>
    </div>
  );
}
