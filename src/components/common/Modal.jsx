import { useEffect } from 'react';
import { clsx } from '../../utils/clsx';
import Button from './Button';

export default function Modal({ isOpen, onClose, title, children, footer, className = '' }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className={clsx(
        'relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto',
        className,
      )}>
        <div className="flex items-center justify-between p-5 border-b border-navy-100">
          <h2 className="text-base font-semibold text-navy-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-navy-400 hover:bg-navy-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && (
          <div className="p-5 pt-0 flex gap-3 justify-end">{footer}</div>
        )}
      </div>
    </div>
  );
}

// Confirmation dialog
export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-navy-600 text-sm mb-5">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
