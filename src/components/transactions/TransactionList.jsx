import { groupByDate } from '../../utils/formatters';
import TransactionItem from './TransactionItem';
import EmptyState from '../common/EmptyState';

export default function TransactionList({ transactions = [], onEdit, onDelete, compact = false, onAddNew }) {
  if (!transactions.length) {
    return (
      <EmptyState
        icon="💸"
        title="No transactions yet"
        description="Start by recording your first money in or out."
        actionLabel={onAddNew ? 'Add Transaction' : undefined}
        onAction={onAddNew}
      />
    );
  }

  const groups = groupByDate(transactions);

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(groups).map(([label, txns]) => (
        <div key={label}>
          <p className="text-[11px] font-semibold text-navy-400 uppercase tracking-widest mb-2 px-1">
            {label}
          </p>
          {/* All items for this date share one card */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 shadow-card overflow-hidden divide-y divide-navy-50/60">
            {txns.map(tx => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onEdit={onEdit}
                onDelete={onDelete}
                compact={compact}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
